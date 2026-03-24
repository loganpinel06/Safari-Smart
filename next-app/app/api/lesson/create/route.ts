import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/utils/requireAuth";

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
    const nameRaw = formData.get("name");
    const name =
      typeof nameRaw === "string" ? nameRaw.trim() : "";

    const topicIdRaw = formData.get("topic_id");
    const topicIdStr =
      typeof topicIdRaw === "string" ? topicIdRaw.trim() : "";
    const topic_id = Number.parseInt(topicIdStr, 10);

    const orderRaw = formData.get("order");
    const orderStr =
      typeof orderRaw === "string" ? orderRaw.trim() : "";
    const order = Number.parseInt(orderStr, 10);

    if (
      !name ||
      !Number.isFinite(topic_id) ||
      !Number.isFinite(order)
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("lesson").insert({
      name,
      topic_id,
      order,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Lesson created successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Problem creating lesson" },
      { status: 500 },
    );
  }
}
