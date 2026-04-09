//reusable api logic for creating lessons, quizzes, and exams
//this is used in the route.ts files for each item type to avoid code duplication

import { NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { requireAuth } from "@/utils/requireAuth";

type ItemType = "lesson" | "quiz" | "exam";

interface CreateItemOptions {
  request: Request;
  supabase: SupabaseClient;
  itemType: ItemType;
}

export async function createItem({
  request,
  supabase,
  itemType,
}: CreateItemOptions) {
  try {
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
    const name = typeof nameRaw === "string" ? nameRaw.trim() : "";

    const topicIdRaw = formData.get("topic_id");
    const topicIdStr = typeof topicIdRaw === "string" ? topicIdRaw.trim() : "";
    const topic_id = Number.parseInt(topicIdStr, 10);

    const orderRaw = formData.get("order");
    const orderStr = typeof orderRaw === "string" ? orderRaw.trim() : "";
    const order = Number.parseInt(orderStr, 10);

    if (!name || !Number.isFinite(topic_id) || !Number.isFinite(order)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from(itemType).insert({
      name,
      topic_id,
      order,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const capitalizedType =
      itemType.charAt(0).toUpperCase() + itemType.slice(1);
    return NextResponse.json({
      message: `${capitalizedType} created successfully`,
    });
  } catch (error) {
    const itemTypeCapitalized =
      itemType.charAt(0).toUpperCase() + itemType.slice(1);
    return NextResponse.json(
      { error: `Problem creating ${itemType}` },
      { status: 500 },
    );
  }
}
