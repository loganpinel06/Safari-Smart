import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/utils/requireAuth";
import { uploadFile } from "@/utils/files/uploadFile";

const QUESTION_TYPES = ["Text", "Image", "Video"] as const;
type QuestionType = (typeof QUESTION_TYPES)[number];

function parseQuestionType(raw: unknown): QuestionType | null {
  if (typeof raw !== "string") return null;
  const type = raw.trim();
  const match = QUESTION_TYPES.find(
    (value) => value.toLowerCase() === type.toLowerCase(),
  );
  return match ?? null;
}

function optionalText(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const text = raw.trim();
  return text === "" ? null : text;
}

function parseChoices(raw: unknown): string[] | null {
  if (typeof raw !== "string") return null;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    const choices = parsed
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);

    if (choices.length < 2) return null;
    return choices;
  } catch {
    return null;
  }
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

    const type = parseQuestionType(formData.get("type"));
    if (!type) {
      return NextResponse.json(
        { error: "type must be Text, Image, or Video" },
        { status: 400 },
      );
    }

    const quizIdRaw = formData.get("quiz_id");
    const quizIdStr = typeof quizIdRaw === "string" ? quizIdRaw.trim() : "";
    const quiz_id = Number.parseInt(quizIdStr, 10);

    const orderRaw = formData.get("order");
    const orderStr = typeof orderRaw === "string" ? orderRaw.trim() : "";
    const order = Number.parseInt(orderStr, 10);

    const questionRaw = formData.get("question");
    const question = typeof questionRaw === "string" ? questionRaw.trim() : "";

    const choices = parseChoices(formData.get("choices"));

    if (
      !Number.isFinite(quiz_id) ||
      !Number.isFinite(order) ||
      !question ||
      !choices
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const main_text = optionalText(formData.get("main_text"));
    let path: string | null = null;

    if (type === "Image" || type === "Video") {
      const fileEntry = formData.get("file");
      if (!(fileEntry instanceof File) || fileEntry.size === 0) {
        return NextResponse.json(
          { error: "file is required for Image and Video questions" },
          { status: 400 },
        );
      }

      const mediaKind = type === "Image" ? "image" : "video";
      const uploaded = await uploadFile(supabase, fileEntry, mediaKind);

      if (!uploaded.success) {
        return NextResponse.json({ error: uploaded.error }, { status: 400 });
      }

      path = `${uploaded.bucket}/${uploaded.path}`;
    }

    const { error } = await supabase.from("quiz_question").insert({
      type,
      path,
      order,
      main_text,
      question,
      choices,
      quiz_id,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Quiz question created successfully" });
  } catch {
    return NextResponse.json(
      { error: "Problem creating quiz question" },
      { status: 500 },
    );
  }
}
