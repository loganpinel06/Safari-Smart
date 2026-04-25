export type ExamTeacherFeedbackRow = {
  exam_question_id: number;
  feedback: string;
  score: number;
};

export type OutstandingUngradedExam = {
  submission_id: number;
  user_id: string;
  student_name: string | null;
  topic_id: number;
  topic_name: string | null;
  exam_id: number;
  exam_name: string | null;
  submission_number: number;
  submitted_at: string | null;
};

export type OutstandingExamSubmissionForGrading = {
  submission_id: number;
  user_id: string;
  student_name: string | null;
  topic_id: number;
  topic_name: string | null;
  exam_id: number;
  exam_name: string | null;
  submission_number: number;
  submitted_at: string | null;
  submitted_answers: Array<{
    exam_question_id: number;
    answer: string;
  }>;
};

export type FullExamForGrading = {
  exam: {
    id: number;
    name: string;
    topic_id: number;
  } | null;
  questions: Array<{
    id: number;
    order: number;
    type: "Image" | "Text" | "Video";
    question: string;
    main_text: string | null;
    path: string | null;
  }>;
  submissions: OutstandingExamSubmissionForGrading[];
};

export async function gradeExamSubmission(input: {
  user_id: string;
  topic_id: number;
  exam_id: number;
  teacher_feedback: ExamTeacherFeedbackRow[];
  score: number;
  max_score: number;
  submission_number?: number;
}): Promise<{ success: boolean; error?: string }> {
  const {
    user_id,
    topic_id,
    exam_id,
    teacher_feedback,
    score,
    max_score,
    submission_number,
  } = input;

  if (
    !user_id.trim() ||
    !Number.isFinite(topic_id) ||
    !Number.isFinite(exam_id) ||
    !Array.isArray(teacher_feedback) ||
    !Number.isFinite(score) ||
    !Number.isFinite(max_score)
  ) {
    return { success: false, error: "Missing or invalid required fields" };
  }

  const invalidFeedbackRow = teacher_feedback.some(
    (row) =>
      !Number.isFinite(row.exam_question_id) ||
      !Number.isFinite(row.score) ||
      row.score < 0 ||
      !row.feedback?.trim(),
  );

  if (invalidFeedbackRow) {
    return {
      success: false,
      error: "Each feedback row must include exam_question_id, score, and feedback",
    };
  }

  if (
    submission_number != null &&
    !Number.isFinite(submission_number)
  ) {
    return { success: false, error: "Invalid submission number" };
  }

  try {
    const formData = new FormData();
    formData.append("user_id", user_id.trim());
    formData.append("topic_id", String(topic_id));
    formData.append("exam_id", String(exam_id));
    formData.append("teacher_feedback", JSON.stringify(teacher_feedback));
    formData.append("score", String(score));
    formData.append("max_score", String(max_score));

    if (submission_number != null) {
      formData.append("submission_number", String(submission_number));
    }

    const response = await fetch("/api/exam/grade", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      return {
        success: false,
        error: data.error ?? "Failed to grade exam submission",
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Failed to grade exam submission" };
  }
}

export async function getOutstandingUngradedExams(
  supabase: any,
): Promise<OutstandingUngradedExam[]> {
  const submissionsRes = await supabase
    .from("exam_submission")
    .select("id, user_id, topic_id, exam_id, submission_number, created_at, status")
    .eq("status", "submitted")
    .order("created_at", { ascending: true });

  if (submissionsRes.error) {
    console.error(
      "Error fetching outstanding exam submissions:",
      submissionsRes.error,
    );
    return [];
  }

  const submissions = (submissionsRes.data ?? []) as Array<{
    id: number;
    user_id: string;
    topic_id: number;
    exam_id: number;
    submission_number: number;
    created_at: string | null;
    status: string | null;
  }>;

  if (submissions.length === 0) {
    return [];
  }

  const studentIds = Array.from(new Set(submissions.map((s) => s.user_id)));
  const topicIds = Array.from(new Set(submissions.map((s) => s.topic_id)));
  const examIds = Array.from(new Set(submissions.map((s) => s.exam_id)));

  const [studentsRes, topicsRes, examsRes] = await Promise.all([
    supabase.from("users").select("id, name").in("id", studentIds),
    supabase.from("topic").select("id, name").in("id", topicIds),
    supabase.from("exam").select("id, name").in("id", examIds),
  ]);

  if (studentsRes.error) {
    console.error("Error fetching student names for grading:", studentsRes.error);
  }
  if (topicsRes.error) {
    console.error("Error fetching topic names for grading:", topicsRes.error);
  }
  if (examsRes.error) {
    console.error("Error fetching exam names for grading:", examsRes.error);
  }

  const studentNameById = new Map<string, string>(
    ((studentsRes.error ? [] : studentsRes.data) ?? []).map((row: any) => [
      row.id,
      row.name,
    ]),
  );
  const topicNameById = new Map<number, string>(
    ((topicsRes.error ? [] : topicsRes.data) ?? []).map((row: any) => [
      Number(row.id),
      row.name,
    ]),
  );
  const examNameById = new Map<number, string>(
    ((examsRes.error ? [] : examsRes.data) ?? []).map((row: any) => [
      Number(row.id),
      row.name,
    ]),
  );

  return submissions.map((submission) => ({
    submission_id: submission.id,
    user_id: submission.user_id,
    student_name: studentNameById.get(submission.user_id) ?? null,
    topic_id: submission.topic_id,
    topic_name: topicNameById.get(submission.topic_id) ?? null,
    exam_id: submission.exam_id,
    exam_name: examNameById.get(submission.exam_id) ?? null,
    submission_number: submission.submission_number,
    submitted_at: submission.created_at,
  }));
}

export async function getFullExamForGrading(
  submissionId: number,
  supabase: any,
): Promise<FullExamForGrading> {
  if (!Number.isFinite(submissionId)) {
    return { exam: null, questions: [], submissions: [] };
  }

  const submissionRes = await supabase
    .from("exam_submission")
    .select(
      "id, user_id, topic_id, exam_id, submission_number, created_at, submitted_answers, users!exam_submission_user_id_fkey(name), topic(name)",
    )
    .eq("id", submissionId)
    .eq("status", "submitted")
    .maybeSingle();

  if (submissionRes.error) {
    console.error(
      "Error fetching exam submission for grading:",
      submissionRes.error,
    );
    return { exam: null, questions: [], submissions: [] };
  }

  if (!submissionRes.data) {
    return { exam: null, questions: [], submissions: [] };
  }

  const examId = Number(submissionRes.data.exam_id);
  const [examRes, questionsRes] = await Promise.all([
    supabase.from("exam").select("id, name, topic_id").eq("id", examId).maybeSingle(),
    supabase
      .from("exam_question")
      .select("id, order, type, question, main_text, path")
      .eq("exam_id", examId)
      .order("order", { ascending: true }),
  ]);

  if (examRes.error) {
    console.error("Error fetching exam info for grading:", examRes.error);
  }
  if (questionsRes.error) {
    console.error("Error fetching exam questions for grading:", questionsRes.error);
  }

  const submission = submissionRes.data;
  const submissions: OutstandingExamSubmissionForGrading[] = [{
    submission_id: Number(submission.id),
    user_id: submission.user_id,
    student_name: submission.users?.name ?? null,
    topic_id: Number(submission.topic_id),
    topic_name: submission.topic?.name ?? null,
    exam_id: Number(submission.exam_id),
    exam_name: examRes.data?.name ?? null,
    submission_number: Number(submission.submission_number),
    submitted_at: submission.created_at ?? null,
    submitted_answers: Array.isArray(submission.submitted_answers)
      ? submission.submitted_answers
      : [],
  }];

  return {
    exam: examRes.error ? null : (examRes.data ?? null),
    questions: (questionsRes.error ? [] : (questionsRes.data ?? [])) as FullExamForGrading["questions"],
    submissions,
  };
}
