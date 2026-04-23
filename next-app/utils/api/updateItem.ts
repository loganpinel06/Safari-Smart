//reusable api logic for updating lessons, quizzes, and exams
//this is used in the route.ts files for each item type to avoid code duplication

import { NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { requireAuth } from "@/utils/requireAuth";

type ItemType = "lesson" | "quiz" | "exam";

interface UpdateItemOptions {
  request: Request;
  supabase: SupabaseClient;
  itemType: ItemType;
}

export async function updateItem({
  request,
  supabase,
  itemType,
}: UpdateItemOptions) {
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

    const idRaw = formData.get("id");
    const idStr = typeof idRaw === "string" ? idRaw.trim() : "";
    const id = Number.parseInt(idStr, 10);

    const nameRaw = formData.get("name");
    const name = typeof nameRaw === "string" ? nameRaw.trim() : "";

    const orderRaw = formData.get("order");
    const orderStr = typeof orderRaw === "string" ? orderRaw.trim() : "";
    const order = Number.parseInt(orderStr, 10);

    if (!Number.isFinite(id) || !name || !Number.isFinite(order)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from(itemType)
      .update({
        name,
        order,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const capitalizedType =
      itemType.charAt(0).toUpperCase() + itemType.slice(1);
    return NextResponse.json({
      message: `${capitalizedType} updated successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Problem updating ${itemType}` },
      { status: 500 },
    );
  }
}
