export type ExamSubmittedAnswer = {
  exam_question_id: number;
  answer: string;
};

export async function handleExamSubmission(input: {
  user_id: string;
  topic_id: number;
  exam_id: number;
  submitted_answers: ExamSubmittedAnswer[];
}): Promise<{ success: boolean; error?: string }> {
  const { user_id, topic_id, exam_id, submitted_answers } = input;

  if (
    !user_id.trim() ||
    !Number.isFinite(topic_id) ||
    !Number.isFinite(exam_id) ||
    !Array.isArray(submitted_answers)
  ) {
    return { success: false, error: "Missing or invalid required fields" };
  }

  try {
    const formData = new FormData();
    formData.append("user_id", user_id.trim());
    formData.append("topic_id", String(topic_id));
    formData.append("exam_id", String(exam_id));
    formData.append("submitted_answers", JSON.stringify(submitted_answers));

    const response = await fetch("/api/exam/progress", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      return {
        success: false,
        error: data.error ?? "Failed to submit exam",
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Failed to submit exam" };
  }
}

export async function hasCompletedExam(
  examId: number,
  userId: string,
  supabase: any,
): Promise<{
  completed: boolean;
  status: string | null;
  score: number | null;
  error?: string;
}> {
  if (!Number.isFinite(examId) || !userId.trim()) {
    return {
      completed: false,
      status: null,
      score: null,
      error: "Invalid exam id or user id",
    };
  }

  try {
    const { data, error } = await supabase
      .from("exam_submission")
      .select("status, score, submission_number")
      .eq("user_id", userId.trim())
      .eq("exam_id", examId)
      .order("submission_number", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return {
        completed: false,
        status: null,
        score: null,
        error: error.message,
      };
    }

    if (!data) {
      return { completed: false, status: null, score: null };
    }

    return {
      completed: true,
      status: data.status ?? null,
      score: data.score ?? null,
    };
  } catch {
    return {
      completed: false,
      status: null,
      score: null,
      error: "Failed to check exam completion",
    };
  }
}
