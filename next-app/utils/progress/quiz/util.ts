export type QuizAttemptAnswer = {
  question_id: number;
  selected_choice_index: number;
  is_correct: boolean;
};

export async function handleQuizAttempt(input: {
  user_id: string;
  topic_id: number;
  quiz_id: number;
  score: number;
  max_score: number;
  answers: QuizAttemptAnswer[];
}): Promise<{ success: boolean; error?: string }> {
  const { user_id, topic_id, quiz_id, score, max_score, answers } = input;

  if (
    !user_id.trim() ||
    !Number.isFinite(topic_id) ||
    !Number.isFinite(quiz_id) ||
    !Number.isFinite(score) ||
    !Number.isFinite(max_score) ||
    !Array.isArray(answers)
  ) {
    return { success: false, error: "Missing or invalid required fields" };
  }

  try {
    const formData = new FormData();
    formData.append("user_id", user_id.trim());
    formData.append("topic_id", String(topic_id));
    formData.append("quiz_id", String(quiz_id));
    formData.append("score", String(score));
    formData.append("max_score", String(max_score));
    formData.append("answers", JSON.stringify(answers));

    const response = await fetch("/api/quiz/progress", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      return {
        success: false,
        error: data.error ?? "Failed to submit quiz attempt",
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Failed to submit quiz attempt" };
  }
}

export async function hasCompletedQuiz(
  quizId: number,
  userId: string,
  supabase: any,
): Promise<{
  completed: boolean;
  highestScore: number | null;
  lastScore: number | null;
  error?: string;
}> {
  if (!Number.isFinite(quizId) || !userId.trim()) {
    return {
      completed: false,
      highestScore: null,
      lastScore: null,
      error: "Invalid quiz id or user id",
    };
  }

  try {
    const { data: highestData, error: highestError } = await supabase
      .from("quiz_attempt")
      .select("score")
      .eq("user_id", userId.trim())
      .eq("quiz_id", quizId)
      .order("score", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (highestError) {
      return {
        completed: false,
        highestScore: null,
        lastScore: null,
        error: highestError.message,
      };
    }

    const { data: latestData, error: latestError } = await supabase
      .from("quiz_attempt")
      .select("score")
      .eq("user_id", userId.trim())
      .eq("quiz_id", quizId)
      .order("attempt_number", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestError) {
      return {
        completed: false,
        highestScore: null,
        lastScore: null,
        error: latestError.message,
      };
    }

    if (!highestData && !latestData) {
      return { completed: false, highestScore: null, lastScore: null };
    }

    return {
      completed: true,
      highestScore: highestData?.score ?? null,
      lastScore: latestData?.score ?? null,
    };
  } catch {
    return {
      completed: false,
      highestScore: null,
      lastScore: null,
      error: "Failed to check quiz completion",
    };
  }
}
