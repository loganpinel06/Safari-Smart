//backend route for adding 'categories' to the database 'category' table.
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/utils/requireAuth";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { user, response } = await requireAuth(supabase, request);
    if (response) return response;

    // TODO
  } catch (error) {
    return NextResponse.json(
      { error: "Problem retrieving categories" },
      { status: 500 },
    );
  }
}
