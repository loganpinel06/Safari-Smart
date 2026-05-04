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

  const accountRows = [
    { label: "Name", value: profile?.name ?? "N/A" },
    { label: "Email", value: user.email ?? "N/A" },
    { label: "Account Type", value: profile?.account_type ?? "Student" },
    { label: "Exam Track", value: profile?.exam_type ?? "BECE" },
  ];

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
              subtitle="View your profile, role, and learning information."
            />

            <SectionCard>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
                    Profile Overview
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[#592803]">
                    {profile?.name ?? "Student"}
                  </h2>
                  <p className="mt-1 text-sm text-[#4B3A46]">
                    Signed in as {user.email ?? "unknown email"}.
                  </p>
                </div>

                <div className="rounded-xl border border-[#4B3A46]/10 bg-[#FFF1B8] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                    Role
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-[#592803]">
                    {profile?.account_type ?? "Student"}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <h2 className="mb-5 text-2xl font-bold text-[#592803]">
                Account Information
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {accountRows.map((row) => (
                  <div
                    key={row.label}
                    className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                      {row.label}
                    </p>
                    <p className="mt-2 break-words text-base font-bold text-[#592803]">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard>
              <h2 className="mb-3 text-xl font-bold text-[#592803]">
                Account Notes
              </h2>
              <p className="text-sm leading-6 text-[#4B3A46]">
                Your role controls what you can access in Safari Smart. Students
                can complete lessons, quizzes, and exams. Teachers can manage
                class content, and parents can review student progress.
              </p>
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}