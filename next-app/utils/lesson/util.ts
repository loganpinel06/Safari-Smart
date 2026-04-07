export type LessonPageType = "Image" | "Text" | "Video";

export type LessonPageSummary = {
  id: number;
  type: LessonPageType;
  order: number;
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
