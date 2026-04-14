import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ManageAccountPage() {
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
    <main className="min-h-screen bg-[#FFF1E5] text-[#592803]">
      <div className="flex min-h-screen">
        <div className="w-[320px] border-r border-[#4B3A46]/10">
          <Sidebar
            userName={profile?.name ?? "John Doe"}
            examTrack={profile?.exam_type ?? "BECE"}
            role={profile?.account_type ?? "Student"}
            activeItem="Manage Account"
            logoutAction={logout}
            profile={profile ?? undefined}
          />
        </div>

        <div className="flex-1 px-10 py-10">
          <div className="max-w-5xl space-y-8">
            <PageHeader
              title="Manage Account"
              subtitle="View and update your account information."
            />

            {/* PROFILE */}
            <SectionCard>
              <div className="space-y-4">
                <p><span className="font-semibold">Name:</span> {profile?.name ?? "N/A"}</p>
                <p><span className="font-semibold">Exam Track:</span> {profile?.exam_type ?? "N/A"}</p>
                <p><span className="font-semibold">Account Type:</span> {profile?.account_type ?? "N/A"}</p>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}