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
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar
          userName={profile?.name ?? "John Doe"}
          examTrack={profile?.exam_type ?? "BECE"}
          role={profile?.account_type ?? "Student"}
          activeItem="Manage Account"
          logoutAction={logout}
          profile={profile}
        />

        <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-5xl space-y-6 lg:space-y-8">
            <PageHeader
              title="Manage Account"
              subtitle="View and update your account information."
            />

            <SectionCard>
              <div className="space-y-4">
                <p className="break-words">
                  <span className="font-semibold">Name:</span>{" "}
                  {profile?.name ?? "N/A"}
                </p>
                <p className="break-words">
                  <span className="font-semibold">Exam Track:</span>{" "}
                  {profile?.exam_type ?? "N/A"}
                </p>
                <p className="break-words">
                  <span className="font-semibold">Account Type:</span>{" "}
                  {profile?.account_type ?? "N/A"}
                </p>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}