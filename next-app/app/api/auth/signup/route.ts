import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type SignupBody = {
  name: string;
  exam_type?: string | null;
  account_type: "Student" | "Teacher";
};

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await request.json()) as SignupBody;
  const { name, exam_type, account_type } = body;

  if (!name || !account_type) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (!["Student", "Teacher"].includes(account_type)) {
    return NextResponse.json(
      { error: "Invalid account type" },
      { status: 400 },
    );
  }

  if (account_type === "Student" && !exam_type) {
    return NextResponse.json(
      { error: "Exam type is required for students" },
      { status: 400 },
    );
  }

  const { error: insertError } = await supabase.from("users").insert({
    id: data.user.id,
    name,
    exam_type: account_type === "Student" ? exam_type : null,
    account_type,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ message: "User profile created successfully" });
}
