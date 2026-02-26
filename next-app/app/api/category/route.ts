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

        //continue working here

        
    } catch (error) {
        //handle any unexpected errors
        return NextResponse.json({ error: "Problem creating category" }, { status: 500 });
    }
}
