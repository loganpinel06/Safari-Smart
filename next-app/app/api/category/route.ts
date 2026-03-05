//backend route for adding 'categories' to the database 'category' table.
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/utils/requireAuth";

const BECE_PARENT_ID = 1;
const WASSCE_PARENT_ID = 2;

export async function POST(request: Request) {
  //try, catch block
  try {
    //create supabase client
    const supabase = await createClient();
    //utilize requireAuth() helper function to cehck for a valid user session and return the user if valid
    //if invalid return the response to stop the route from executing
    const { user, response } = await requireAuth(supabase, request);
    if (response) return response;

    //get the name from the request body and validate it
    const { name, parent_id } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    //insert the new category into the 'category' table and handle any potential errors
    const { error } = await supabase.from("category").insert({
      name: name,
      parent_id: parent_id ?? null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    //return a success response if the category was created successfully
    return NextResponse.json({ message: "Category created successfully" });
    //catch any errors
  } catch (error) {
    //handle any unexpected errors
    return NextResponse.json(
      { error: "Problem creating category" },
      { status: 500 },
    );
  }
}

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
    const { parent_id } = await request.json();
    const isStudent = userData.role === "Student";
    let parentCategoryID;
    if (isStudent) {
      if (parent_id != null) {
        parentCategoryID = parent_id;
      } else {
        parentCategoryID = test;
      }
    } else {
      parentCategoryID = Number(parent_id) ?? null;
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

    //return a success response if the category was created successfully
    return NextResponse.json({
      categories: data,
      message: "Categories retrieved successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Problem retrieving categories" },
      { status: 500 },
    );
  }
}
