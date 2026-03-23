//backend route for adding 'categories' to the database 'category' table.
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/utils/requireAuth";

const BECE_PARENT_ID = 1;
const WASSCE_PARENT_ID = 2;

export async function GET(request: Request) {
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

    const test =
      userData.exam_type === "BECE" ? BECE_PARENT_ID : WASSCE_PARENT_ID;
    const { searchParams } = new URL(request.url);
    let parent_id = searchParams.get("parent_id");
    const isStudent = userData.account_type === "Student";
    let parentCategoryID;
    let isCategory = true;

    if (isStudent) {
      if (parent_id != null) {
        parentCategoryID = Number(parent_id);
      } else {
        parentCategoryID = test;
      }
    } else {
      parentCategoryID = parent_id ? Number(parent_id) : null;
    }

    let data, error;
    if (parentCategoryID == null || isNaN(parentCategoryID)) {
      ({ data, error } = await supabase
        .from("category")
        .select("*")
        .is("parent_id", null));
    } else {
      ({ data, error } = await supabase
        .from("category")
        .select("*")
        .eq("parent_id", parentCategoryID));
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (
      data &&
      data.length === 0 &&
      parentCategoryID != null &&
      !isNaN(parentCategoryID)
    ) {
      ({ data, error } = await supabase
        .from("topic")
        .select("*")
        .eq("category_id", parentCategoryID)
        .order("order", {
          ascending: true,
        }));
      isCategory = false;
    }

    //return a success response if the category was created successfully
    return NextResponse.json({
      categories: data,
      message: "Categories retrieved successfully",
      isCategory,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Problem retrieving categories" },
      { status: 500 },
    );
  }
}
