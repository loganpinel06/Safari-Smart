import PaymentManager from "@/components/PaymentManager";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function PaymentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  async function logout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/signin");
  }

  return <PaymentManager profile={profile} logoutAction={logout} />;}