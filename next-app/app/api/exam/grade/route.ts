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

  const { data: teacherProfile, error: teacherProfileError } = await supabase
    .from("users")
    .select("account_type")
    .eq("id", user.id)
    .single();

  if (teacherProfileError || !teacherProfile) {
    return NextResponse.json(
      { error: "User profile not found" },
      { status: 404 },
    );
  }

  if (teacherProfile.account_type !== "Teacher") {
    return NextResponse.json(
      { error: "Only teachers can grade exams" },
      { status: 403 },
    );
  }

  const formData = await request.formData();
  const studentUserId = formData.get("user_id")?.toString().trim();
  const topicIdRaw = formData.get("topic_id")?.toString().trim();
  const examIdRaw = formData.get("exam_id")?.toString().trim();
  const teacherFeedbackRaw = formData.get("teacher_feedback")?.toString().trim();
  const scoreRaw = formData.get("score")?.toString().trim();
  const maxScoreRaw = formData.get("max_score")?.toString().trim();
  const submissionNumberRaw = formData.get("submission_number")?.toString().trim();

  if (
    !studentUserId ||
    !topicIdRaw ||
    !examIdRaw ||
    !teacherFeedbackRaw ||
    !scoreRaw ||
    !maxScoreRaw
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const topicId = Number.parseInt(topicIdRaw, 10);
  const examId = Number.parseInt(examIdRaw, 10);
  const score = Number(scoreRaw);
  const maxScore = Number(maxScoreRaw);
  const submissionNumber = submissionNumberRaw
    ? Number.parseInt(submissionNumberRaw, 10)
    : null;

  if (
    !Number.isFinite(topicId) ||
    !Number.isFinite(examId) ||
    !Number.isFinite(score) ||
    !Number.isFinite(maxScore) ||
    (submissionNumberRaw && !Number.isFinite(submissionNumber))
  ) {
    return NextResponse.json(
      { error: "Invalid numeric fields" },
      { status: 400 },
    );
  }

  let teacherFeedback: unknown;
  try {
    teacherFeedback = JSON.parse(teacherFeedbackRaw);
  } catch {
    return NextResponse.json(
      { error: "teacher_feedback must be valid JSON" },
      { status: 400 },
    );
  }

  let targetSubmissionNumber = submissionNumber;

  if (targetSubmissionNumber == null) {
    const { data: latestSubmission, error: latestSubmissionError } = await supabase
      .from("exam_submission")
      .select("submission_number")
      .eq("user_id", studentUserId)
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

    if (!latestSubmission) {
      return NextResponse.json(
        { error: "No submission found to grade" },
        { status: 404 },
      );
    }

    targetSubmissionNumber = latestSubmission.submission_number;
  }

  const { error: updateError } = await supabase
    .from("exam_submission")
    .update({
      teacher_feedback: teacherFeedback,
      score,
      max_score: maxScore,
      status: "graded",
      graded_at: new Date().toISOString(),
      graded_by: user.id,
    })
    .eq("user_id", studentUserId)
    .eq("topic_id", topicId)
    .eq("exam_id", examId)
    .eq("submission_number", targetSubmissionNumber);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Exam submission graded",
    submission_number: targetSubmissionNumber,
  });
}
