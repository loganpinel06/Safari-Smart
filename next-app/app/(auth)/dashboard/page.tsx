import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="text-left">
        <p>ID: {profile?.id}</p>
        <p>Name: {profile?.name}</p>
        <p>Exam Type: {profile?.exam_type ?? "None"}</p>
        <p>Account Type: {profile?.account_type}</p>
      </div>

      <form action={logout}>
        <button className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600">
          Logout
        </button>
      </form>
    </div>
  );
}
