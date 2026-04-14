import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (userError || !userData) {
    return NextResponse.json(
      { error: "User profile not found" },
      { status: 404 },
    );
  }

  if (userData.account_type !== "Student") {
    return NextResponse.json(
      { error: "Only students can leave classes" },
      { status: 403 },
    );
  }

  const formData = await request.formData();
  const class_id = formData.get("class_id")?.toString().trim();

  if (!class_id) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const { error: leaveError } = await supabase
    .from("class_students")
    .delete()
    .eq("class_id", class_id)
    .eq("student_id", data.user.id);

  if (leaveError) {
    return NextResponse.json({ error: leaveError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Successfully left class",
  });
}
