import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ExamQuestionCard from "@/components/ExamQuestionCard";
import QuizChoiceButton from "@/components/QuizChoiceButton";

export default async function ExamPage({
  params,
}: {
  params: Promise<{ examID: string }>;
}) {
  const supabase = await createClient();
  const examID = (await params).examID;
  const choices = ["Option A", "Option B", "Option C", "Option D"];

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

  const { data: currentExamCategory } = await supabase
    .from("category")
    .select("name, parent_id")
    .eq("id", examID)
    .single();

  const { data: parentCategory } = await supabase
    .from("category")
    .select("name")
    .eq("id", currentExamCategory?.parent_id)
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
            <PageHeader
              title={`${currentExamCategory?.name ?? "Topic"} Exam`}
              subtitle={`${parentCategory?.name ?? "Subject"} • Exam Mode`}
            />

            <ExamQuestionCard question="Which answer best matches this exam-style structure?" />

            <SectionCard>
              <div className="grid gap-4">
                {choices.map((choice) => (
                  <QuizChoiceButton key={choice} label={choice} />
                ))}
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