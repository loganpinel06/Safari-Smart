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
        { error: "Only teachers can delete assignments" },
        { status: 403 },
      );
    }

    const formData = await request.formData();

    const idRaw = formData.get("id");
    const idStr = typeof idRaw === "string" ? idRaw.trim() : "";
    const id = Number.parseInt(idStr, 10);

    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { error: "Missing assignment id" },
        { status: 400 },
      );
    }

    const { data: assignmentData, error: assignmentError } = await supabase
      .from("class_assignments")
      .select("id, class_id")
      .eq("id", id)
      .single();

    if (assignmentError || !assignmentData) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    const { data: classData, error: classError } = await supabase
      .from("classes")
      .select("id")
      .eq("id", assignmentData.class_id)
      .eq("teacher_id", user.id)
      .single();

    if (classError || !classData) {
      return NextResponse.json(
        { error: "Only the class teacher can delete assignments" },
        { status: 403 },
      );
    }

    const { error: deleteError } = await supabase
      .from("class_assignments")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Problem deleting assignment" },
      { status: 500 },
    );
  }
}
