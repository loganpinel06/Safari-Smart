import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // For all routes that require authentication we check if the user is logged in if not then we redirect
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signin?message=Please sign in to view this page");

  // logic for fetching user data and passing into context for children

  return children;
}
