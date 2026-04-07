import { get } from "http";

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
  choices: QuizQuestionChoice[];
  path: string | null;
};

export type QuizQuestionChoice = {
  name: string;
  correct: boolean;
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

//this function is used to get the quiz questions with all details including choices for students to view
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

  //add logic to get choices for each quiz question for students to view
  //get the json for choices and map it to QuizQuestionChoice[]
  const questions = (res.data ?? []) as QuizQuestionDetail[];
  for (const question of questions) {
    if (typeof question.choices === "string") {
      try {
        question.choices = JSON.parse(question.choices);
      } catch {
        question.choices = [];
      }
    }
  }
  return questions;
}
