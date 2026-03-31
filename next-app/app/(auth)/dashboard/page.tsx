import Sidebar from "@/components/Sidebar";
import DashboardCard from "@/components/DashboardCard";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSubjects } from "@/utils/categories/util";
import TeacherDashboardContent from "@/components/TeacherDashboardContent";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user!.id)
    .single();

  const subjects = await getSubjects(null, profile, supabase);

  async function logout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/signin");
  }

  return (
    <main className="min-h-screen bg-[#FFF1E5] text-[#592803]">
      <div className="flex min-h-screen">
        <div className="w-[320px]">
          {" "}
          <Sidebar
            userName={profile?.name ?? "John Doe"}
            examTrack={profile?.exam_type ?? "BECE"}
            activeItem="Dashboard"
            logoutAction={logout}
          />
        </div>

        <div className="flex-1 px-10 py-10">
          <div className="max-w-6xl space-y-8">
            <PageHeader
              title="Dashboard"
              subtitle={`Account Type: ${profile?.account_type ?? "Student"}`}
            />

            <SectionCard className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
                  Welcome back
                </p>
                <h2 className="text-2xl font-bold text-[#592803]">
                  {profile?.name ?? "Student"}
                </h2>
                <p className="text-sm text-[#4B3A46]">
                  You are currently studying for{" "}
                  <span className="font-semibold text-[#592803]">
                    {profile?.exam_type ?? "BECE"}
                  </span>
                  .
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:w-[320px]">
                <div className="rounded-xl bg-[#FFF1B8] p-4 border border-[#4B3A46]/10">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                    Subjects
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-[#592803]">
                    {subjects.length}
                  </p>
                </div>

                <div className="rounded-xl bg-white/80 p-4 border border-[#4B3A46]/10">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                    Role
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-[#592803]">
                    {profile?.account_type ?? "Student"}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#592803]">
                    Your Subjects
                  </h2>
                  <p className="text-sm text-[#4B3A46] mt-1">
                    Choose a subject to continue learning.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {subjects.map((s) => (
                  <DashboardCard key={s.title} title={s.title} href={s.href} />
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}
