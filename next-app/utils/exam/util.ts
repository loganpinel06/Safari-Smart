//util for getting exam related data from supabase

export type ExamQuestionType = "Image" | "Text" | "Video";

export type ExamQuestionSummary = {
  id: number;
  type: ExamQuestionType;
  order: number;
  question: string;
};

export type ExamQuestionDetail = {
  id: number;
  exam_id: number;
  type: ExamQuestionType;
  order: number;
  main_text: string | null;
  question: string;
  path: string | null;
};

export type QuizQuestionChoice = {
  name: string;
  correct: boolean;
};

export async function getExamQuestions(
  examID: string | number,
  supabase: any,
): Promise<ExamQuestionSummary[]> {
  const examIdNum =
    typeof examID === "string" ? Number.parseInt(examID, 10) : examID;

  if (!Number.isFinite(examIdNum)) {
    return [];
  }

  const res = await supabase
    .from("exam_question")
    .select("id, type, order, question")
    .eq("exam_id", examIdNum)
    .order("order", { ascending: true });

  if (res.error) {
    console.error("Error fetching exam questions:", res.error);
    return [];
  }

  return (res.data ?? []) as ExamQuestionSummary[];
}

//this function is used to get exam questions with all details for admin and student views
export async function getExamQuestionsDetail(
  examID: string | number,
  supabase: any,
): Promise<ExamQuestionDetail[]> {
  const examIdNum =
    typeof examID === "string" ? Number.parseInt(examID, 10) : examID;

  if (!Number.isFinite(examIdNum)) {
    return [];
  }

  const res = await supabase
    .from("exam_question")
    .select("id, exam_id, type, order, main_text, question, path")
    .eq("exam_id", examIdNum)
    .order("order", { ascending: true });

  if (res.error) {
    console.error("Error fetching exam questions (detail):", res.error);
    return [];
  }

  return (res.data ?? []) as ExamQuestionDetail[];
}
