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
      { error: "Only students can submit quiz attempts" },
      { status: 403 },
    );
  }

  const formData = await request.formData();
  const userId = formData.get("user_id")?.toString().trim();
  const topicIdRaw = formData.get("topic_id")?.toString().trim();
  const quizIdRaw = formData.get("quiz_id")?.toString().trim();
  const scoreRaw = formData.get("score")?.toString().trim();
  const maxScoreRaw = formData.get("max_score")?.toString().trim();
  const answersRaw = formData.get("answers")?.toString().trim();

  if (
    !userId ||
    !topicIdRaw ||
    !quizIdRaw ||
    !scoreRaw ||
    !maxScoreRaw ||
    !answersRaw
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (userId !== user.id) {
    return NextResponse.json(
      { error: "You can only submit your own quiz attempts" },
      { status: 403 },
    );
  }

  const topicId = Number.parseInt(topicIdRaw, 10);
  const quizId = Number.parseInt(quizIdRaw, 10);
  const score = Number(scoreRaw);
  const maxScore = Number(maxScoreRaw);

  if (
    !Number.isFinite(topicId) ||
    !Number.isFinite(quizId) ||
    !Number.isFinite(score) ||
    !Number.isFinite(maxScore)
  ) {
    return NextResponse.json(
      { error: "Invalid numeric fields" },
      { status: 400 },
    );
  }

  let parsedAnswers: unknown;
  try {
    parsedAnswers = JSON.parse(answersRaw);
  } catch {
    return NextResponse.json(
      { error: "answers must be valid JSON" },
      { status: 400 },
    );
  }

  const { data: latestAttempt, error: latestAttemptError } = await supabase
    .from("quiz_attempt")
    .select("attempt_number")
    .eq("user_id", userId)
    .eq("topic_id", topicId)
    .eq("quiz_id", quizId)
    .order("attempt_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestAttemptError) {
    return NextResponse.json(
      { error: latestAttemptError.message },
      { status: 500 },
    );
  }

  const nextAttemptNumber = (latestAttempt?.attempt_number ?? 0) + 1;

  const { error: insertError } = await supabase.from("quiz_attempt").insert({
    user_id: userId,
    topic_id: topicId,
    quiz_id: quizId,
    attempt_number: nextAttemptNumber,
    score,
    max_score: maxScore,
    answers: parsedAnswers,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Quiz attempt recorded",
    attempt_number: nextAttemptNumber,
  });
}
