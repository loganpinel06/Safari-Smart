import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/utils/requireAuth";
import { uploadFile } from "@/utils/files/uploadFile";

const PAGE_TYPES = ["Text", "Image", "Video"] as const;
type PageType = (typeof PAGE_TYPES)[number];

//type for existing lesson page to check if media can be reused when type is unchanged.
//Not all fields are needed so not using the full type from the DB.
type ExistingLessonPage = {
  id: number;
  lesson_id: number;
  type: PageType;
  path: string | null;
};

//parses the page type from the raw form data. Returns null if invalid.
function parsePageType(raw: unknown): PageType | null {
  if (typeof raw !== "string") return null;
  const t = raw.trim();
  const match = PAGE_TYPES.find((v) => v.toLowerCase() === t.toLowerCase());
  return match ?? null;
}

//helper to parse optional text fields, treating missing, non-string, or whitespace-only values as null.
function optionalText(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const s = raw.trim();
  return s === "" ? null : s;
}

//API route to update a lesson page. Expects form data with fields:
//- id: the ID of the lesson page to update
//- lesson_id: the ID of the lesson this page belongs to (for validation)
//- type: the type of the page ("Text", "Image", or "Video")
//- order: the order of the page within the lesson
//- main_text: (for Text pages) the main text content
//- sub_text: (optional) additional text content
//- file: (for Image or Video pages) an optional new media file to upload. If not provided, existing media will be reused if the type is unchanged.
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

    const orderRaw = formData.get("order");
    const orderStr = typeof orderRaw === "string" ? orderRaw.trim() : "";
    const order = Number.parseInt(orderStr, 10);

    const pageType = parsePageType(formData.get("type"));

    if (
      !Number.isFinite(id) ||
      !Number.isFinite(lesson_id) ||
      !Number.isFinite(order) ||
      !pageType
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    //Validate that the lesson page exists and belongs to the specified lesson before proceeding with the update.
    const { data: existing, error: existingError } = await supabase
      .from("lesson_page")
      .select("id, lesson_id, type, path")
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

    const sub_text = optionalText(formData.get("sub_text"));

    let main_text: string | null = null;
    let path: string | null = null;

    //check page type and handle text vs media fields accordingly.
    //for media, if no new file is uploaded and the type is unchanged, reuse the existing media path.
    if (pageType === "Text") {
      const mainRaw = formData.get("main_text");
      const main = typeof mainRaw === "string" ? mainRaw.trim() : "";
      if (!main) {
        return NextResponse.json(
          { error: "main_text is required for Text pages" },
          { status: 400 },
        );
      }
      main_text = main;
      path = null;
    } else {
      const fileEntry = formData.get("file");
      if (fileEntry instanceof File && fileEntry.size > 0) {
        const mediaKind = pageType === "Image" ? "image" : "video";
        const uploaded = await uploadFile(supabase, fileEntry, mediaKind);
        if (!uploaded.success) {
          return NextResponse.json({ error: uploaded.error }, { status: 400 });
        }
        path = `${uploaded.bucket}/${uploaded.path}`;
      } else if (existingRow.type === pageType && existingRow.path) {
        path = existingRow.path;
      } else {
        return NextResponse.json(
          {
            error: `file is required for ${pageType} pages when no existing media is available`,
          },
          { status: 400 },
        );
      }

      main_text = null;
    }

    //update the lesson page with the new values
    const { error } = await supabase
      .from("lesson_page")
      .update({
        type: pageType,
        order,
        main_text,
        sub_text,
        path,
      })
      .eq("id", id)
      .eq("lesson_id", lesson_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Lesson page updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Problem updating lesson page" },
      { status: 500 },
    );
  }
}
