import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type ClassBody = {
  name: string;
};

function generateJoinCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

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

  if (userData.account_type !== "Teacher") {
    return NextResponse.json(
      { error: "Only teachers can create classes" },
      { status: 403 },
    );
  }

  const body = (await request.json()) as ClassBody;
  const { name } = body;

  if (!name) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const MAX_ATTEMPTS = 5;
  let attempt = 0;

  while (attempt < MAX_ATTEMPTS) {
    const { error: insertError } = await supabase.from("classes").insert({
      name,
      teacher_id: data.user.id,
      join_code: generateJoinCode(),
    });

    if (!insertError) {
      return NextResponse.json({ message: "Class created successfully" });
    }

    if (insertError.code !== "23505") {
      attempt++;
      continue;
    }

    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Failed to create class after multiple attempts",
  });
}
