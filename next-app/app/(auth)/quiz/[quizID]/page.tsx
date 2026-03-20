import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import QuizChoiceButton from "@/components/QuizChoiceButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ quizID: string }>;
}) {
  const supabase = await createClient();
  const quizID = (await params).quizID;

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

  // For now, quizID is really the selected topic/category id
  const { data: currentQuizCategory } = await supabase
    .from("category")
    .select("name, parent_id")
    .eq("id", quizID)
    .single();

  const { data: parentCategory } = await supabase
    .from("category")
    .select("name")
    .eq("id", currentQuizCategory?.parent_id)
    .single();

  async function logout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/signin");
  }

  const choices = ["Option A", "Option B", "Option C", "Option D"];

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
          <div className="max-w-4xl space-y-8">
            <Breadcrumbs
                items={[
                    {
                    label: parentCategory?.name ?? "Subject",
                    href: `/dashboard/${currentQuizCategory?.parent_id}`,
                    },
                    {
                    label: currentQuizCategory?.name ?? "Topic",
                    href: `/topic/${quizID}`,
                    },
                    {
                    label: "Quiz",
                    },
                ]}
                />
            <PageHeader
              title={`${currentQuizCategory?.name ?? "Topic"} Quiz`}
              subtitle={`${parentCategory?.name ?? "Subject"} • Question 1 of 5`}
            />

            <SectionCard>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
                  Question 1 of 5
                </p>
                <p className="text-sm text-[#4B3A46]">Practice Mode</p>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
                    {currentQuizCategory?.name ?? "Sample Topic"}
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-[#592803]">
                    Which answer best matches this placeholder quiz structure?
                  </h2>
                </div>

                <div className="grid gap-4">
                  {choices.map((choice) => (
                    <QuizChoiceButton key={choice} label={choice} />
                  ))}
                </div>
              </div>
            </SectionCard>

            <SectionCard className="flex items-center justify-between">
              <button className="rounded-xl border border-[#4B3A46]/20 px-5 py-3 font-semibold text-[#592803] transition hover:bg-white/40">
                Previous
              </button>

              <button className="rounded-xl bg-[#FFF1B8] px-5 py-3 font-semibold text-[#592803] transition hover:opacity-90">
                Next Question
              </button>
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}