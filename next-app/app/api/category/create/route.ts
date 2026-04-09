import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/utils/requireAuth";

export async function POST(request: Request) {
  //try, catch block
  try {
    //create supabase client
    const supabase = await createClient();
    //utilize requireAuth() helper function to cehck for a valid user session and return the user if valid
    //if invalid return the response to stop the route from executing
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
    const name =
      typeof nameRaw === "string" ? nameRaw.trim() : "";

    const parentIdRaw = formData.get("parent_id");
    const parent_id =
      typeof parentIdRaw === "string" && parentIdRaw.trim() !== ""
        ? parentIdRaw.trim()
        : null;

    if (!name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    //insert the new category into the 'category' table and handle any potential errors
    const { error } = await supabase.from("category").insert({
      name: name,
      parent_id,
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
