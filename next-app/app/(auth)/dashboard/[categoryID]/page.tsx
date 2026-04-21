import Sidebar from "@/components/Sidebar";
import DashboardCard from "@/components/DashboardCard";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getSubjects } from "@/utils/categories/util";

export default async function DashboardCategoryPage({
  params,
}: {
  params: Promise<{ categoryID: string }>;
}) {
  const supabase = await createClient();
  const categoryID = (await params).categoryID;

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

  const { subjects } = await getSubjects(
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

  const isTeacher = profile?.account_type === "Teacher";
  const isParent = profile?.account_type === "Parent";

  return (
    <main className="min-h-screen bg-[#FFF1E5] text-[#592803]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar
          userName={profile?.name ?? "John Doe"}
          examTrack={profile?.exam_type ?? "BECE"}
          role={profile?.account_type ?? "Student"}
          activeItem="Dashboard"
          logoutAction={logout}
          profile={profile}
        />

        <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-6xl space-y-6 lg:space-y-8">
            <PageHeader
              title="Subject"
              subtitle={
                isTeacher
                  ? "Review and manage topic content for this subject."
                  : isParent
                  ? "View topic structure and student progress in this subject."
                  : "Choose a topic to continue learning."
              }
            />

            <SectionCard className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
                  Subject Overview
                </p>
                <h2 className="text-2xl font-bold text-[#592803]">
                  Available Topics
                </h2>
                <p className="text-sm text-[#4B3A46]">
                  {isTeacher
                    ? "Select a topic to manage lessons, quizzes, and exam content."
                    : isParent
                    ? "Select a topic to view student activity and progress."
                    : "Select one of the available topics below."}
                </p>
              </div>

              <div className="w-full rounded-xl border border-[#4B3A46]/10 bg-[#FFF1B8] p-4 lg:w-[180px]">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                  Topics
                </p>
                <p className="mt-2 text-2xl font-extrabold text-[#592803]">
                  {subjects.length}
                </p>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#592803]">
                  Topics in This Subject
                </h2>
                <p className="mt-1 text-sm text-[#4B3A46]">
                  {isTeacher
                    ? "Open a topic to review or manage content."
                    : isParent
                    ? "Open a topic to view the student-facing learning structure."
                    : "These topics lead into lesson content, quizzes, and exam practice."}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {subjects.map((topic) => (
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