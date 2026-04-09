import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdminQuizQuestionClient from "@/components/Admin/AdminQuizQuestionClient";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getQuizQuestions } from "@/utils/quiz/util";

export default async function AdminQuizPage({
  params,
}: {
  params: Promise<{ quizID: string }>;
}) {
  const supabase = await createClient();
  const quizID = (await params).quizID;
  const quizIdNum = Number.parseInt(quizID, 10);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user!.id)
    .single();

  if (!Number.isFinite(quizIdNum)) {
    redirect("/admin-dashboard");
  }

  const { data: quiz } = await supabase
    .from("quiz")
    .select("name, topic_id")
    .eq("id", quizIdNum)
    .single();

  if (!quiz) {
    redirect("/admin-dashboard");
  }

  const { data: topic } = await supabase
    .from("topic")
    .select("name")
    .eq("id", quiz.topic_id)
    .single();

  const questions = await getQuizQuestions(quizIdNum, supabase);
  const nextOrder =
    questions.length === 0 ? 0 : Math.max(...questions.map((q) => q.order)) + 1;

  async function logout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/signin");
  }

  const breadcrumbItems = [
    ...(topic?.name
      ? [
          {
            label: topic.name,
            href: `/admin-topic/${quiz.topic_id}`,
          },
        ]
      : []),
    {
      label: quiz.name,
    },
  ];

  return (
    <main className="min-h-screen bg-[#FFF1E5] text-[#592803]">
      <div className="flex min-h-screen">
        <div className="w-[320px]">
          <Sidebar
            userName={profile?.name ?? "Admin"}
            examTrack={profile?.exam_type ?? "BECE"}
            activeItem="Admin Dashboard"
            logoutAction={logout}
            profile={profile}
          />
        </div>

        <div className="flex-1 px-10 py-10">
          <div className="max-w-6xl flex flex-col gap-8">
            <Breadcrumbs items={breadcrumbItems} />

            <PageHeader
              title={quiz.name}
              subtitle="Quiz questions for this quiz, in display order."
            />

            <SectionCard>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#592803]">
                    Questions
                  </h2>
                  <p className="mt-1 text-sm text-[#4B3A46]">
                    Add and manage question items for this quiz.
                  </p>
                </div>
                <AdminQuizQuestionClient
                  quizId={quizIdNum}
                  defaultOrder={nextOrder}
                />
              </div>

              {questions.length === 0 ? (
                <p className="text-sm text-[#4B3A46]">
                  No quiz questions yet. Add questions to build this quiz.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {questions.map((quizQuestion) => (
                    <div
                      key={quizQuestion.id}
                      className="rounded-xl border border-[#4B3A46]/15 bg-white/70 px-5 py-4 shadow-sm"
                    >
                      <div className="grid gap-3 sm:grid-cols-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                            ID
                          </span>
                          <span className="font-semibold text-[#592803]">
                            {quizQuestion.id}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                            Type
                          </span>
                          <span className="font-semibold text-[#592803]">
                            {quizQuestion.type}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                            Order
                          </span>
                          <span className="font-semibold text-[#592803]">
                            {quizQuestion.order}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                            Question
                          </span>
                          <span className="font-semibold text-[#592803]">
                            {quizQuestion.question}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}
