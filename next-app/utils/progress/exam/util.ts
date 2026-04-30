export type ExamSubmittedAnswer = {
  exam_question_id: number;
  answer: string;
};

export type StudentExamSubmissionSummary = {
  id: number;
  exam_id: number;
  submission_number: number;
  status: string | null;
  score: number | null;
  max_score: number | null;
  created_at: string | null;
};

export type StudentExamFeedbackDetail = {
  submission: StudentExamSubmissionSummary;
  examName: string | null;
  topicName: string | null;
  questions: Array<{
    id: number;
    order: number;
    question: string;
    main_text: string | null;
  }>;
  submittedAnswers: ExamSubmittedAnswer[];
  teacherFeedback: Array<{
    exam_question_id: number;
    score: number | null;
    feedback: string;
  }>;
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

export async function getStudentExamSubmissions(
  examId: number,
  userId: string,
  supabase: any,
): Promise<StudentExamSubmissionSummary[]> {
  if (!Number.isFinite(examId) || !userId.trim()) {
    return [];
  }

  const { data, error } = await supabase
    .from("exam_submission")
    .select("id, exam_id, submission_number, status, score, max_score, created_at")
    .eq("user_id", userId.trim())
    .eq("exam_id", examId)
    .order("submission_number", { ascending: false });

  if (error) {
    console.error("Error fetching student exam submissions:", error);
    return [];
  }

  return (data ?? []) as StudentExamSubmissionSummary[];
}

export async function getStudentExamFeedbackDetail(
  submissionId: number,
  userId: string,
  supabase: any,
): Promise<StudentExamFeedbackDetail | null> {
  if (!Number.isFinite(submissionId) || !userId.trim()) {
    return null;
  }

  const submissionRes = await supabase
    .from("exam_submission")
    .select(
      "id, user_id, exam_id, topic_id, submission_number, status, score, max_score, created_at, submitted_answers, teacher_feedback",
    )
    .eq("id", submissionId)
    .eq("user_id", userId.trim())
    .maybeSingle();

  if (submissionRes.error) {
    console.error("Error fetching exam submission feedback detail:", submissionRes.error);
    return null;
  }

  const submission = submissionRes.data;
  if (!submission) {
    return null;
  }

  const [examRes, topicRes, questionsRes] = await Promise.all([
    supabase.from("exam").select("name").eq("id", submission.exam_id).maybeSingle(),
    supabase.from("topic").select("name").eq("id", submission.topic_id).maybeSingle(),
    supabase
      .from("exam_question")
      .select("id, order, question, main_text")
      .eq("exam_id", submission.exam_id)
      .order("order", { ascending: true }),
  ]);

  if (questionsRes.error) {
    console.error("Error fetching exam questions for feedback detail:", questionsRes.error);
  }

  return {
    submission: {
      id: submission.id,
      exam_id: submission.exam_id,
      submission_number: submission.submission_number,
      status: submission.status ?? null,
      score: submission.score ?? null,
      max_score: submission.max_score ?? null,
      created_at: submission.created_at ?? null,
    },
    examName: examRes.data?.name ?? null,
    topicName: topicRes.data?.name ?? null,
    questions: (questionsRes.data ?? []) as StudentExamFeedbackDetail["questions"],
    submittedAnswers: Array.isArray(submission.submitted_answers)
      ? submission.submitted_answers
      : [],
    teacherFeedback: Array.isArray(submission.teacher_feedback)
      ? submission.teacher_feedback
      : [],
  };
}
