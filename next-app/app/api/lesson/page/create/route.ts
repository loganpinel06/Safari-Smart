import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/utils/requireAuth";
import { uploadFile } from "@/utils/files/uploadFile";

const PAGE_TYPES = ["Text", "Image", "Video"] as const;
type PageType = (typeof PAGE_TYPES)[number];

function parsePageType(raw: unknown): PageType | null {
  if (typeof raw !== "string") return null;
  const t = raw.trim();
  const match = PAGE_TYPES.find(
    (v) => v.toLowerCase() === t.toLowerCase(),
  );
  return match ?? null;
}

function optionalText(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const s = raw.trim();
  return s === "" ? null : s;
}

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

    const pageType = parsePageType(formData.get("type"));
    if (!pageType) {
      return NextResponse.json(
        { error: "type must be Text, Image, or Video" },
        { status: 400 },
      );
    }

    const lessonIdRaw = formData.get("lesson_id");
    const lessonIdStr =
      typeof lessonIdRaw === "string" ? lessonIdRaw.trim() : "";
    const lesson_id = Number.parseInt(lessonIdStr, 10);

    const orderRaw = formData.get("order");
    const orderStr =
      typeof orderRaw === "string" ? orderRaw.trim() : "";
    const order = Number.parseInt(orderStr, 10);

    if (!Number.isFinite(lesson_id) || !Number.isFinite(order)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const sub_text = optionalText(formData.get("sub_text"));

    let main_text: string | null = null;
    let path: string | null = null;

    if (pageType === "Text") {
      const mainRaw = formData.get("main_text");
      const main =
        typeof mainRaw === "string" ? mainRaw.trim() : "";
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
      if (!(fileEntry instanceof File) || fileEntry.size === 0) {
        return NextResponse.json(
          { error: "file is required for Image and Video pages" },
          { status: 400 },
        );
      }

      const mediaKind = pageType === "Image" ? "image" : "video";
      const uploaded = await uploadFile(supabase, fileEntry, mediaKind);
      if (!uploaded.success) {
        return NextResponse.json({ error: uploaded.error }, { status: 400 });
      }

      path = `${uploaded.bucket}/${uploaded.path}`;
      main_text = null;
    }

    const { error } = await supabase.from("lesson_page").insert({
      type: pageType,
      order,
      main_text,
      sub_text,
      lesson_id,
      path,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Lesson page created successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Problem creating lesson page" },
      { status: 500 },
    );
  }
}
