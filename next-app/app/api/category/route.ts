//backend route for adding 'categories' to the database 'category' table
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
