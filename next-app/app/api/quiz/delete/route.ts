import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/utils/requireAuth";
import { deleteItemWithChildren } from "@/utils/deleteWithChildren";

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

    const result = await deleteItemWithChildren(supabase, {
      parentTableName: "quiz",
      childTableName: "quiz_question",
      parentId: id,
      parentIdField: "quiz_id",
      parentValidationField: "topic_id",
      parentValidationValue: topic_id,
      childPathField: "path",
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Problem deleting quiz" },
      { status: 500 },
    );
  }
}
