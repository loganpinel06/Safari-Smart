//imports 
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

//POST HTTP Method
export async function POST(request: Request) {
    //try, catch block
    try {
        //create supabase client
        //Logan note: We create the client every time because with Next.js app router there may not be a continuously
        //running server like in express
        const supabase = await createClient();
        //parse the body of the request
        const { email, password } = await request.json();

        //validate the input
        if (!email) {
          return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        if (!password) {
          return NextResponse.json({ error: "Password required" }, { status: 400 });
        }

        //sign in the user with supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        //check for any errrors signing in
        if (error || !data.session) {
            return NextResponse.json({ error: error?.message }, { status: 401 });
        }

    } catch (error) {
        //handle any unexpected errors
        return NextResponse.json({ error: "Problem Signing in" }, { status: 500 });
    }
}