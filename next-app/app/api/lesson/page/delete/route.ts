import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/utils/requireAuth";
import { parseStoredMediaPath } from "@/utils/files/getFile";

type ExistingLessonPage = {
  id: number;
  lesson_id: number;
  path: string | null;
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

    const lessonIdRaw = formData.get("lesson_id");
    const lessonIdStr =
      typeof lessonIdRaw === "string" ? lessonIdRaw.trim() : "";
    const lesson_id = Number.parseInt(lessonIdStr, 10);

    if (!Number.isFinite(id) || !Number.isFinite(lesson_id)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { data: existing, error: existingError } = await supabase
      .from("lesson_page")
      .select("id, lesson_id, path")
      .eq("id", id)
      .single();

    if (existingError || !existing) {
      return NextResponse.json(
        { error: "Lesson page not found" },
        { status: 404 },
      );
    }

    const existingRow = existing as ExistingLessonPage;

    if (existingRow.lesson_id !== lesson_id) {
      return NextResponse.json(
        { error: "Invalid lesson for this page" },
        { status: 400 },
      );
    }

    const { error: deleteRowError } = await supabase
      .from("lesson_page")
      .delete()
      .eq("id", id)
      .eq("lesson_id", lesson_id);

    if (deleteRowError) {
      return NextResponse.json(
        { error: deleteRowError.message },
        { status: 500 },
      );
    }

    const media = parseStoredMediaPath(existingRow.path);
    if (media) {
      await supabase.storage.from(media.bucket).remove([media.pathInBucket]);
    }

    return NextResponse.json({ message: "Lesson page deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Problem deleting lesson page" },
      { status: 500 },
    );
  }
}
