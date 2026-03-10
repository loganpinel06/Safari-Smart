//backend API route to handle password reset requests to supabase
//will email user a link to reset their password which will redirect them to the reset password page on the frontend
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  //get email from request
  const { email } = await req.json();
  //create supbase client
  const supabase = await createClient();
  //send password reset email
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/confirm`, //route to the confirm route to verify token
  });
  //return errors and success messages
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Password reset email sent" });
}
