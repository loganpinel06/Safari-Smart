import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const formData = await request.formData();
  const join_code = formData.get("join_code")?.toString().trim();
  const normalizedJoinCode = join_code?.toUpperCase();

  if (!normalizedJoinCode) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const { data: classData, error: classError } = await supabase
    .from("classes")
    .select("id")
    .eq("join_code", normalizedJoinCode)
    .single();

  if (classError) {
    // Helps distinguish DB/RLS failures from bad join code.
    console.error("Error looking up class by join code:", classError);
    return NextResponse.json(
      { error: "Unable to verify class code right now" },
      { status: 500 },
    );
  }

  if (!classData) {
    return NextResponse.json({ error: "Invalid join code" }, { status: 400 });
  }

  const { error: insertError } = await supabase.from("class_students").insert({
    class_id: classData.id,
    student_id: data.user.id,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "You are already in this class" },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Successfully joined class",
  });
}
