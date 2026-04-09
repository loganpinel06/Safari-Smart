export type LessonPageType = "Image" | "Text" | "Video";

export type LessonPageSummary = {
  id: number;
  type: LessonPageType;
  order: number;
};

/** Full row from `lesson_page` — everything needed to render each slide in order. */
export type LessonPageDetail = {
  id: number;
  lesson_id: number;
  type: LessonPageType;
  order: number;
  main_text: string | null;
  sub_text: string | null;
  path: string | null;
};

export type TopicBasicInfo = {
  id: number;
  name: string;
};

export async function getLessonPages(
  lessonID: string | number,
  supabase: any,
): Promise<LessonPageSummary[]> {
  const lessonIdNum =
    typeof lessonID === "string" ? Number.parseInt(lessonID, 10) : lessonID;

  if (!Number.isFinite(lessonIdNum)) {
    return [];
  }

  const res = await supabase
    .from("lesson_page")
    .select("id, type, order")
    .eq("lesson_id", lessonIdNum)
    .order("order", { ascending: true });

  if (res.error) {
    console.error("Error fetching lesson pages:", res.error);
    return [];
  }

  return (res.data ?? []) as LessonPageSummary[];
}

export async function getLessonPagesDetail(
  lessonID: string | number,
  supabase: any,
): Promise<LessonPageDetail[]> {
  const lessonIdNum =
    typeof lessonID === "string" ? Number.parseInt(lessonID, 10) : lessonID;

  if (!Number.isFinite(lessonIdNum)) {
    return [];
  }

  const res = await supabase
    .from("lesson_page")
    .select("id, lesson_id, type, order, main_text, sub_text, path")
    .eq("lesson_id", lessonIdNum)
    .order("order", { ascending: true });

  if (res.error) {
    console.error("Error fetching lesson pages (detail):", res.error);
    return [];
  }

  return (res.data ?? []) as LessonPageDetail[];
}

export async function getTopicFromLessonID(
  lessonID: number,
  supabase: any,
): Promise<TopicBasicInfo | null> {
  if (!Number.isFinite(lessonID)) {
    return null;
  }

  const lessonRes = await supabase
    .from("lesson")
    .select("topic_id")
    .eq("id", lessonID)
    .maybeSingle();

  if (lessonRes.error) {
    console.error("Error fetching lesson for topic lookup:", lessonRes.error);
    return null;
  }

  const topicId = lessonRes.data?.topic_id;
  if (topicId == null || !Number.isFinite(Number(topicId))) {
    return null;
  }

  const topicRes = await supabase
    .from("topic")
    .select("id, name")
    .eq("id", topicId)
    .maybeSingle();

  if (topicRes.error) {
    console.error("Error fetching topic for lesson:", topicRes.error);
    return null;
  }

  const row = topicRes.data;
  if (
    !row ||
    typeof row.id !== "number" ||
    typeof row.name !== "string"
  ) {
    return null;
  }

  return { id: row.id, name: row.name };
}
