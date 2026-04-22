export async function markLessonAsComplete(input: {
  user_id: string;
  topic_id: number;
  lesson_id: number;
}): Promise<{ success: boolean; error?: string }> {
  const { user_id, topic_id, lesson_id } = input;

  if (!user_id.trim() || !Number.isFinite(topic_id) || !Number.isFinite(lesson_id)) {
    return { success: false, error: "Missing or invalid required fields" };
  }

  try {
    const formData = new FormData();
    formData.append("user_id", user_id.trim());
    formData.append("topic_id", String(topic_id));
    formData.append("lesson_id", String(lesson_id));

    const response = await fetch("/api/lesson/progress", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      return {
        success: false,
        error: data.error ?? "Failed to mark lesson as complete",
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Failed to mark lesson as complete" };
  }
}

export async function hasCompletedLesson(
  lessonId: number,
  userId: string,
  supabase: any,
): Promise<{ completed: boolean; error?: string }> {
  if (!Number.isFinite(lessonId) || !userId.trim()) {
    return { completed: false, error: "Invalid lesson id or user id" };
  }

  try {
    const { data, error } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", userId.trim())
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (error) {
      return { completed: false, error: error.message };
    }

    return { completed: Boolean(data) };
  } catch {
    return { completed: false, error: "Failed to check lesson progress" };
  }
}
