import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type JoinBody = {
  join_code: string;
};

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await request.json()) as JoinBody;
  const { join_code } = body;

  if (!join_code) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const { data: classData, error: classError } = await supabase
    .from("classes")
    .select("id")
    .eq("join_code", join_code)
    .single();

  if (classError || !classData) {
    return NextResponse.json({ error: "Invalid join code" }, { status: 400 });
  }

  const { error: insertError } = await supabase.from("class_students").insert({
    class_id: classData.id,
    student_id: data.user.id,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Successfully joined class",
  });
}
