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

    if (userData.account_type !== "Teacher") {
      return NextResponse.json(
        { error: "Only teachers can create assignments" },
        { status: 403 },
      );
    }

    const formData = await request.formData();

    const classIdRaw = formData.get("class_id");
    const classIdStr = typeof classIdRaw === "string" ? classIdRaw.trim() : "";
    const class_id = Number.parseInt(classIdStr, 10);

    const topicIdRaw = formData.get("topic_id");
    const topicIdStr = typeof topicIdRaw === "string" ? topicIdRaw.trim() : "";
    const topic_id = Number.parseInt(topicIdStr, 10);

    const dueDateRaw = formData.get("due_date");
    const due_date = typeof dueDateRaw === "string" ? dueDateRaw.trim() : "";

    if (!Number.isFinite(class_id) || !Number.isFinite(topic_id) || !due_date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const parsedDueDate = Date.parse(due_date);
    if (!Number.isFinite(parsedDueDate)) {
      return NextResponse.json({ error: "Invalid due_date" }, { status: 400 });
    }

    const { data: classData, error: classError } = await supabase
      .from("classes")
      .select("id")
      .eq("id", class_id)
      .eq("teacher_id", user.id)
      .single();

    if (classError || !classData) {
      return NextResponse.json(
        { error: "Only the class teacher can create assignments" },
        { status: 403 },
      );
    }

    const { error: createError } = await supabase.from("class_assignments").insert(
      {
        class_id,
        topic_id,
        due_date,
      },
    );

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Assignment created successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Problem creating assignment" },
      { status: 500 },
    );
  }
}
