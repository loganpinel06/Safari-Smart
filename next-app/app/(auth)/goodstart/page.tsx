import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function GoodStartPage() {
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
          activeItem="GoodStart AI"
          logoutAction={logout}
          profile={profile}
        />

        <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-5xl space-y-6 lg:space-y-8">
            <PageHeader
              title="GoodStart AI"
              subtitle="AI-assisted study support, writing help, and feedback tools."
            />

            <SectionCard>
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
                  Study Assistant
                </p>
                <h2 className="text-2xl font-bold text-[#592803]">
                  Personalized support for {profile?.name ?? "you"}
                </h2>
                <p className="text-sm leading-6 text-[#4B3A46]">
                  GoodStart AI is designed to help students understand lessons,
                  practice questions, and improve written responses while studying
                  for {profile?.exam_type ?? "their exam track"}.
                </p>
              </div>
            </SectionCard>

            <div className="grid gap-5 md:grid-cols-3">
              <SectionCard>
                <h2 className="mb-3 text-xl font-bold text-[#592803]">
                  Explain a Topic
                </h2>
                <p className="text-sm leading-6 text-[#4B3A46]">
                  Students can ask for simpler explanations of confusing lesson
                  material.
                </p>
              </SectionCard>

              <SectionCard>
                <h2 className="mb-3 text-xl font-bold text-[#592803]">
                  Practice Feedback
                </h2>
                <p className="text-sm leading-6 text-[#4B3A46]">
                  Written answers can be reviewed for clarity, completeness, and
                  structure.
                </p>
              </SectionCard>

              <SectionCard>
                <h2 className="mb-3 text-xl font-bold text-[#592803]">
                  Study Guidance
                </h2>
                <p className="text-sm leading-6 text-[#4B3A46]">
                  The assistant can suggest what to review next based on lessons,
                  quizzes, and exam practice.
                </p>
              </SectionCard>
            </div>

            <SectionCard>
              <h2 className="mb-3 text-xl font-bold text-[#592803]">
                Coming Next
              </h2>
              <p className="text-sm leading-6 text-[#4B3A46]">
                This page is ready for future AI tools, including lesson help,
                quiz explanations, writing support, and student progress feedback.
              </p>
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}