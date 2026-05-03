export type TopicContentType = "lesson" | "quiz" | "exam";

export type TopicContentRow = {
  id: number;
  name: string;
  order: number;
  type: TopicContentType;
  completed: boolean;
  /** Sequential unlock: completed items plus the next item in topic order only. */
  accessible: boolean;
};

type TopicContentDbRow = {
  id: number;
  name: string;
  order: number;
};

async function getTopicCompletionSets(
  topicIdNum: number,
  userID: string,
  supabase: any,
): Promise<{
  completedLessonIds: Set<number>;
  completedQuizIds: Set<number>;
  completedExamIds: Set<number>;
}> {
  const [lessonProgressRes, quizAttemptRes, examSubmissionRes] = await Promise.all([
    supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("topic_id", topicIdNum)
      .eq("user_id", userID),
    supabase
      .from("quiz_attempt")
      .select("quiz_id")
      .eq("topic_id", topicIdNum)
      .eq("user_id", userID),
    supabase
      .from("exam_submission")
      .select("exam_id")
      .eq("topic_id", topicIdNum)
      .eq("user_id", userID),
  ]);

  if (lessonProgressRes.error) {
    console.error("Error fetching lesson progress:", lessonProgressRes.error);
  }
  if (quizAttemptRes.error) {
    console.error("Error fetching quiz attempts:", quizAttemptRes.error);
  }
  if (examSubmissionRes.error) {
    console.error("Error fetching exam submissions:", examSubmissionRes.error);
  }

  const completedLessonIds = new Set<number>(
    ((lessonProgressRes.error ? [] : lessonProgressRes.data) ?? [])
      .map((row: any) => Number(row.lesson_id))
      .filter((id: number) => Number.isFinite(id)),
  );
  const completedQuizIds = new Set<number>(
    ((quizAttemptRes.error ? [] : quizAttemptRes.data) ?? [])
      .map((row: any) => Number(row.quiz_id))
      .filter((id: number) => Number.isFinite(id)),
  );
  const completedExamIds = new Set<number>(
    ((examSubmissionRes.error ? [] : examSubmissionRes.data) ?? [])
      .map((row: any) => Number(row.exam_id))
      .filter((id: number) => Number.isFinite(id)),
  );

  return { completedLessonIds, completedQuizIds, completedExamIds };
}

export async function getTopicCompletionPercent(
  topicID: string | number,
  userID: string,
  supabase: any,
): Promise<number> {
  const topicIdNum =
    typeof topicID === "string" ? Number.parseInt(topicID, 10) : topicID;

  if (!Number.isFinite(topicIdNum) || !userID?.trim()) {
    return 0;
  }

  const topicContent = await getTopicDetails(topicIdNum, supabase, userID);
  if (topicContent.length === 0) {
    return 0;
  }

  const completedCount = topicContent.filter((row) => row.completed).length;
  return Math.round((completedCount / topicContent.length) * 100);
}

export async function getTopicDetails(
  topicID: string | number,
  supabase: any,
  userID?: string,
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

  let completedLessonIds = new Set<number>();
  let completedQuizIds = new Set<number>();
  let completedExamIds = new Set<number>();

  if (userID?.trim()) {
    const completionSets = await getTopicCompletionSets(topicIdNum, userID.trim(), supabase);
    completedLessonIds = completionSets.completedLessonIds;
    completedQuizIds = completionSets.completedQuizIds;
    completedExamIds = completionSets.completedExamIds;
  }

  const lessonRows = (
    lessonsRes.error ? [] : (lessonsRes.data as TopicContentDbRow[] | null) ?? []
  ).map((row) => ({
    ...row,
    type: "lesson" as const,
    completed: completedLessonIds.has(row.id),
  }));
  const quizRows = (
    quizzesRes.error ? [] : (quizzesRes.data as TopicContentDbRow[] | null) ?? []
  ).map((row) => ({
    ...row,
    type: "quiz" as const,
    completed: completedQuizIds.has(row.id),
  }));
  const examRows = (
    examsRes.error ? [] : (examsRes.data as TopicContentDbRow[] | null) ?? []
  ).map((row) => ({
    ...row,
    type: "exam" as const,
    completed: completedExamIds.has(row.id),
  }));

  const combined = [...lessonRows, ...quizRows, ...examRows];
  combined.sort((a, b) => a.order - b.order);

  let prefix = 0;
  while (prefix < combined.length && combined[prefix].completed) {
    prefix++;
  }

  return combined.map((row, index) => ({
    ...row,
    accessible: row.completed || index === prefix,
  }));
}

export async function canAccessTopicItem(
  topicID: string | number,
  supabase: any,
  userID: string,
  item: { type: TopicContentType; id: number },
): Promise<boolean> {
  if (!userID?.trim()) {
    return false;
  }

  const rows = await getTopicDetails(topicID, supabase, userID.trim());
  const row = rows.find((r) => r.type === item.type && r.id === item.id);
  return row?.accessible ?? false;
}
