export type TopicContentType = "lesson" | "quiz" | "exam";

export type TopicContentRow = {
  id: number;
  name: string;
  order: number;
  type: TopicContentType;
};

type TopicContentDbRow = {
  id: number;
  name: string;
  order: number;
};

export async function getTopicDetails(
  topicID: string | number,
  supabase: any,
): Promise<TopicContentRow[]> {
  const topicIdNum =
    typeof topicID === "string" ? Number.parseInt(topicID, 10) : topicID;

  if (!Number.isFinite(topicIdNum)) {
    return [];
  }

  const [lessonsRes, quizzesRes, examsRes] = await Promise.all([
    supabase
      .from("lesson")
      .select("id, name, order")
      .eq("topic_id", topicIdNum)
      .order("order", { ascending: true }),
    supabase
      .from("quiz")
      .select("id, name, order")
      .eq("topic_id", topicIdNum)
      .order("order", { ascending: true }),
    supabase
      .from("exam")
      .select("id, name, order")
      .eq("topic_id", topicIdNum)
      .order("order", { ascending: true }),
  ]);

  if (lessonsRes.error) {
    console.error("Error fetching lessons:", lessonsRes.error);
  }
  if (quizzesRes.error) {
    console.error("Error fetching quizzes:", quizzesRes.error);
  }
  if (examsRes.error) {
    console.error("Error fetching exams:", examsRes.error);
  }

  const lessonRows: TopicContentRow[] = (
    lessonsRes.error ? [] : (lessonsRes.data as TopicContentDbRow[] | null) ?? []
  ).map((row) => ({ ...row, type: "lesson" as const }));
  const quizRows: TopicContentRow[] = (
    quizzesRes.error ? [] : (quizzesRes.data as TopicContentDbRow[] | null) ?? []
  ).map((row) => ({ ...row, type: "quiz" as const }));
  const examRows: TopicContentRow[] = (
    examsRes.error ? [] : (examsRes.data as TopicContentDbRow[] | null) ?? []
  ).map((row) => ({ ...row, type: "exam" as const }));

  const combined = [...lessonRows, ...quizRows, ...examRows];
  combined.sort((a, b) => a.order - b.order);
  return combined;
}
