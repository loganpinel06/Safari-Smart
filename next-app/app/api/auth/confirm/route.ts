//confirm route will act as a middleman between the password reset email and the reset password page on the frontend to
//verify the token sent in the email is valid before redirecting to the reset password page to protect the route

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}/resetpassword`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?message=Problem+verifying+token`,
  );
}
