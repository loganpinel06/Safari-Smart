import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/utils/requireAuth";
import { parseStoredMediaPath } from "@/utils/files/getFile";

type LessonPagePathRow = {
  path: string | null;
};

type ExistingLesson = {
  id: number;
  topic_id: number;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { user, response } = await requireAuth(supabase, request);
    if (response) return response;

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 },
      );
    }

    if (userData.account_type !== "Admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await request.formData();

    const idRaw = formData.get("id");
    const idStr = typeof idRaw === "string" ? idRaw.trim() : "";
    const id = Number.parseInt(idStr, 10);

    const topicIdRaw = formData.get("topic_id");
    const topicIdStr = typeof topicIdRaw === "string" ? topicIdRaw.trim() : "";
    const topic_id = Number.parseInt(topicIdStr, 10);

    if (!Number.isFinite(id) || !Number.isFinite(topic_id)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { data: existingLesson, error: lessonError } = await supabase
      .from("lesson")
      .select("id, topic_id")
      .eq("id", id)
      .single();

    if (lessonError || !existingLesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const lesson = existingLesson as ExistingLesson;

    if (lesson.topic_id !== topic_id) {
      return NextResponse.json(
        { error: "Invalid topic for this lesson" },
        { status: 400 },
      );
    }

    const { data: lessonPages, error: lessonPagesError } = await supabase
      .from("lesson_page")
      .select("path")
      .eq("lesson_id", id);

    if (lessonPagesError) {
      return NextResponse.json(
        { error: lessonPagesError.message },
        { status: 500 },
      );
    }

    const mediaByBucket: Record<string, string[]> = {};
    for (const row of (lessonPages ?? []) as LessonPagePathRow[]) {
      const media = parseStoredMediaPath(row.path);
      if (!media) continue;
      if (!mediaByBucket[media.bucket]) mediaByBucket[media.bucket] = [];
      mediaByBucket[media.bucket].push(media.pathInBucket);
    }

    const { error: deletePagesError } = await supabase
      .from("lesson_page")
      .delete()
      .eq("lesson_id", id);

    if (deletePagesError) {
      return NextResponse.json(
        { error: deletePagesError.message },
        { status: 500 },
      );
    }

    const { error: deleteLessonError } = await supabase
      .from("lesson")
      .delete()
      .eq("id", id)
      .eq("topic_id", topic_id);

    if (deleteLessonError) {
      return NextResponse.json(
        { error: deleteLessonError.message },
        { status: 500 },
      );
    }

    for (const [bucket, paths] of Object.entries(mediaByBucket)) {
      if (paths.length > 0) {
        await supabase.storage.from(bucket).remove(paths);
      }
    }

    return NextResponse.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Problem deleting lesson" },
      { status: 500 },
    );
  }
}
