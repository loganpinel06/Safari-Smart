//auth.ts will protect all backend routes making them require authentication to access
import { NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js"; //for typing

export async function requireAuth(supabase: SupabaseClient, request: Request) {
    //check if there is a current user logged in
    const {data: { user }, error } = await supabase.auth.getUser();
    //return an error response if there is no user or if there was an error fetching the user
    if (!user || error) {
        return {
            user: null,
            //send a response that redirects users to sign in page
            response: NextResponse.redirect(new URL("/signin?message=Please+sign+in+to+continue", request.url)),
        }
    }
    //return the user to the route.ts file if valid
    return { user, response: null };
}

