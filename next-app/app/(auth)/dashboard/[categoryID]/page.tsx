import Sidebar from "@/components/Sidebar";
import DashboardCard from "@/components/dashboardcard";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSubjects } from "@/utils/categories/util";

export default async function DashboardCategoryPage({
  params,
}: {
  params: Promise<{ categoryID: string }>;
}) {
  const supabase = await createClient();
  let categoryID = (await params).categoryID;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user!.id)
    .single();

  const subjects = await getSubjects(
    categoryID ? parseInt(categoryID) : null,
    profile,
    supabase,
  );

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
              title={currentCategory?.name ?? "Category"}
              subtitle="Choose a topic to continue learning."
            />

            <SectionCard className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
                  Subject
                </p>
                <h2 className="text-2xl font-bold text-[#592803]">
                  {currentCategory?.name ?? "Current Subject"}
                </h2>
                <p className="text-sm text-[#4B3A46]">
                  Select one of the available topics below.
                </p>
              </div>

              <div className="rounded-xl bg-[#FFF1B8] p-4 border border-[#4B3A46]/10 w-full md:w-[180px]">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                  Topics
                </p>
                <p className="mt-2 text-2xl font-extrabold text-[#592803]">
                  {topics.length}
                </p>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#592803]">
                  Available Topics
                </h2>
                <p className="text-sm text-[#4B3A46] mt-1">
                  These topics lead into lesson content, quizzes, and exam
                  practice.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {topics.map((topic) => (
                  <DashboardCard
                    key={topic.title}
                    title={topic.title}
                    href={topic.href}
                  />
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}
