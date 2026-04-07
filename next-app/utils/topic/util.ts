export type TopicContentRow = {
  id: number;
  name: string;
  order: number;
};

export type TopicDetails = {
  lessons: TopicContentRow[];
  quizzes: TopicContentRow[];
  exams: TopicContentRow[];
};

export async function getTopicDetails(
  topicID: string | number,
  supabase: any,
): Promise<TopicDetails> {
  const topicIdNum =
    typeof topicID === "string" ? Number.parseInt(topicID, 10) : topicID;

  if (!Number.isFinite(topicIdNum)) {
    return { lessons: [], quizzes: [], exams: [] };
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

  return {
    lessons: lessonsRes.error ? [] : (lessonsRes.data ?? []),
    quizzes: quizzesRes.error ? [] : (quizzesRes.data ?? []),
    exams: examsRes.error ? [] : (examsRes.data ?? []),
  };
}
