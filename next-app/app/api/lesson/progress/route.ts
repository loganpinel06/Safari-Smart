import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/utils/requireAuth";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { user, response } = await requireAuth(supabase, request);
  if (response) {
    return response;
  }

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: userProfile, error: userProfileError } = await supabase
    .from("users")
    .select("account_type")
    .eq("id", user.id)
    .single();

  if (userProfileError || !userProfile) {
    return NextResponse.json(
      { error: "User profile not found" },
      { status: 404 },
    );
  }

  if (userProfile.account_type !== "Student") {
    return NextResponse.json(
      { error: "Only students can mark lessons complete" },
      { status: 403 },
    );
  }

  const formData = await request.formData();
  const userId = formData.get("user_id")?.toString().trim();
  const topicIdRaw = formData.get("topic_id")?.toString().trim();
  const lessonIdRaw = formData.get("lesson_id")?.toString().trim();

  if (!userId || !topicIdRaw || !lessonIdRaw) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (userId !== user.id) {
    return NextResponse.json(
      { error: "You can only mark your own lesson progress" },
      { status: 403 },
    );
  }

  const topicId = Number.parseInt(topicIdRaw, 10);
  const lessonId = Number.parseInt(lessonIdRaw, 10);

  if (!Number.isFinite(topicId) || !Number.isFinite(lessonId)) {
    return NextResponse.json(
      { error: "Invalid topic_id or lesson_id" },
      { status: 400 },
    );
  }

  const { error: insertError } = await supabase.from("lesson_progress").insert({
    user_id: userId,
    topic_id: topicId,
    lesson_id: lessonId,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json({
        message: "Lesson already marked as complete",
      });
    }

    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Lesson marked as complete",
  });
}
