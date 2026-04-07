export type QuizQuestionType = "Image" | "Text" | "Video";

export type QuizQuestionSummary = {
  id: number;
  type: QuizQuestionType;
  order: number;
  question: string;
};

export type QuizQuestionDetail = {
  id: number;
  quiz_id: number;
  type: QuizQuestionType;
  order: number;
  main_text: string | null;
  question: string;
  choices: unknown;
  path: string | null;
};

export async function getQuizQuestions(
  quizID: string | number,
  supabase: any,
): Promise<QuizQuestionSummary[]> {
  const quizIdNum =
    typeof quizID === "string" ? Number.parseInt(quizID, 10) : quizID;

  if (!Number.isFinite(quizIdNum)) {
    return [];
  }

  const res = await supabase
    .from("quiz_question")
    .select("id, type, order, question")
    .eq("quiz_id", quizIdNum)
    .order("order", { ascending: true });

  if (res.error) {
    console.error("Error fetching quiz questions:", res.error);
    return [];
  }

  return (res.data ?? []) as QuizQuestionSummary[];
}

export async function getQuizQuestionsDetail(
  quizID: string | number,
  supabase: any,
): Promise<QuizQuestionDetail[]> {
  const quizIdNum =
    typeof quizID === "string" ? Number.parseInt(quizID, 10) : quizID;

  if (!Number.isFinite(quizIdNum)) {
    return [];
  }

  const res = await supabase
    .from("quiz_question")
    .select("id, quiz_id, type, order, main_text, question, choices, path")
    .eq("quiz_id", quizIdNum)
    .order("order", { ascending: true });

  if (res.error) {
    console.error("Error fetching quiz questions (detail):", res.error);
    return [];
  }

  return (res.data ?? []) as QuizQuestionDetail[];
}
