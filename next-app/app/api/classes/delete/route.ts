import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type DeleteClassBody = {
  class_id: string;
};

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
      { error: "Only teachers can delete classes" },
      { status: 403 },
    );
  }

  const body = (await request.json()) as DeleteClassBody;
  const { class_id } = body;

  if (!class_id) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const { error: deleteError } = await supabase
    .from("classes")
    .delete()
    .eq("id", class_id)
    .eq("teacher_id", data.user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Failed to delete class" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Failed to create class after multiple attempts",
  });
}
