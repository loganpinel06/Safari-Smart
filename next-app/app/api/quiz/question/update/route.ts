import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/utils/requireAuth";
import { uploadFile } from "@/utils/files/uploadFile";
import { parseStoredMediaPath } from "@/utils/files/getFile";

const QUESTION_TYPES = ["Text", "Image", "Video"] as const;
type QuestionType = (typeof QUESTION_TYPES)[number];
type QuizChoice = {
  name: string;
  correct: boolean;
};

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

function parseChoices(raw: unknown): QuizChoice[] | null {
  if (typeof raw !== "string") return null;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    const choices = parsed
      .map((item) => {
        if (typeof item !== "object" || item === null) return null;
        const rawName = (item as { name?: unknown }).name;
        const rawCorrect = (item as { correct?: unknown }).correct;
        const name = typeof rawName === "string" ? rawName.trim() : "";
        const correct = typeof rawCorrect === "boolean" ? rawCorrect : null;
        if (!name || correct === null) return null;
        return { name, correct };
      })
      .filter((item): item is QuizChoice => item !== null);

    if (choices.length < 2) return null;
    if (!choices.some((choice) => choice.correct)) return null;
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

    const idRaw = formData.get("id");
    const idStr = typeof idRaw === "string" ? idRaw.trim() : "";
    const id = Number.parseInt(idStr, 10);

    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { error: "Missing question id" },
        { status: 400 },
      );
    }

    // Fetch existing question
    const { data: existingQuestion, error: fetchError } = await supabase
      .from("quiz_question")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    const type = parseQuestionType(formData.get("type"));
    if (!type) {
      return NextResponse.json(
        { error: "type must be Text, Image, or Video" },
        { status: 400 },
      );
    }

    const orderRaw = formData.get("order");
    const orderStr = typeof orderRaw === "string" ? orderRaw.trim() : "";
    const order = Number.parseInt(orderStr, 10);

    const questionRaw = formData.get("question");
    const question = typeof questionRaw === "string" ? questionRaw.trim() : "";

    const choices = parseChoices(formData.get("choices"));

    if (!Number.isFinite(order) || !question || !choices) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const main_text = optionalText(formData.get("main_text"));
    let path = existingQuestion.path as string | null;
    const keepExistingMedia = formData.get("keep_existing_media") === "true";

    // Handle media updates
    if (type !== "Text") {
      const fileEntry = formData.get("file");

      if (fileEntry instanceof File && fileEntry.size > 0) {
        // New file uploaded
        // Delete existing media if type changed
        if (existingQuestion.type !== type && existingQuestion.path) {
          const media = parseStoredMediaPath(existingQuestion.path);
          if (media) {
            await supabase.storage
              .from(media.bucket)
              .remove([media.pathInBucket]);
          }
        }

        // Upload new file
        const mediaKind = type === "Image" ? "image" : "video";
        const uploaded = await uploadFile(supabase, fileEntry, mediaKind);

        if (!uploaded.success) {
          return NextResponse.json({ error: uploaded.error }, { status: 400 });
        }

        path = `${uploaded.bucket}/${uploaded.path}`;
      } else if (!keepExistingMedia && !existingQuestion.path) {
        // No file and no existing media
        return NextResponse.json(
          { error: "file is required for Image and Video questions" },
          { status: 400 },
        );
      }
    } else {
      // Type is Text - remove any existing media
      if (existingQuestion.path) {
        const media = parseStoredMediaPath(existingQuestion.path);
        if (media) {
          await supabase.storage
            .from(media.bucket)
            .remove([media.pathInBucket]);
        }
      }
      path = null;
    }

    // Update question
    const { error: updateError } = await supabase
      .from("quiz_question")
      .update({
        type,
        path,
        order,
        main_text,
        question,
        choices,
      })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Quiz question updated successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Problem updating quiz question" },
      { status: 500 },
    );
  }
}
