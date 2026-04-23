import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/utils/requireAuth";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { user, response } = await requireAuth(supabase, request);

  if (response) {
    return response;
  }

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: userProfile, error: userProfileError } = await supabase
    .from("users")
    .select("account_type")
    .eq("id", user.id)
    .single();

  if (userProfileError || !userProfile) {
    return NextResponse.json(
      { error: "User profile not found" },
      { status: 404 },
    );
  }

  if (userProfile.account_type !== "Student") {
    return NextResponse.json(
      { error: "Only students can submit exams" },
      { status: 403 },
    );
  }

  const formData = await request.formData();
  const userId = formData.get("user_id")?.toString().trim();
  const topicIdRaw = formData.get("topic_id")?.toString().trim();
  const examIdRaw = formData.get("exam_id")?.toString().trim();
  const submittedAnswersRaw = formData.get("submitted_answers")?.toString().trim();

  if (
    !userId ||
    !topicIdRaw ||
    !examIdRaw ||
    !submittedAnswersRaw
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (userId !== user.id) {
    return NextResponse.json(
      { error: "You can only submit your own exam" },
      { status: 403 },
    );
  }

  const topicId = Number.parseInt(topicIdRaw, 10);
  const examId = Number.parseInt(examIdRaw, 10);

  if (!Number.isFinite(topicId) || !Number.isFinite(examId)) {
    return NextResponse.json(
      { error: "Invalid numeric fields" },
      { status: 400 },
    );
  }

  let submittedAnswers: unknown;
  try {
    submittedAnswers = JSON.parse(submittedAnswersRaw);
  } catch {
    return NextResponse.json(
      { error: "submitted_answers must be valid JSON" },
      { status: 400 },
    );
  }

  const { data: latestSubmission, error: latestSubmissionError } = await supabase
    .from("exam_submission")
    .select("submission_number")
    .eq("user_id", userId)
    .eq("topic_id", topicId)
    .eq("exam_id", examId)
    .order("submission_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestSubmissionError) {
    return NextResponse.json(
      { error: latestSubmissionError.message },
      { status: 500 },
    );
  }

  const nextSubmissionNumber = (latestSubmission?.submission_number ?? 0) + 1;

  const { error: insertError } = await supabase.from("exam_submission").insert({
    user_id: userId,
    topic_id: topicId,
    exam_id: examId,
    submitted_answers: submittedAnswers,
    teacher_feedback: null,
    score: null,
    max_score: null,
    status: "submitted",
    graded_at: null,
    graded_by: null,
    submission_number: nextSubmissionNumber,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Exam submission recorded",
    submission_number: nextSubmissionNumber,
  });
}
