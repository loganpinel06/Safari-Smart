import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdminExamQuestionClient from "@/components/Admin/AdminExamQuestionClient";
import EditExamQuestionClient from "@/components/Admin/EditExamQuestionClient";
import DeleteExamClient from "@/components/Admin/DeleteExamClient";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getExamQuestionsDetail } from "@/utils/exam/util";

export default async function AdminExamPage({
  params,
}: {
  params: Promise<{ examID: string }>;
}) {
  const supabase = await createClient();
  const examID = (await params).examID;
  const examIdNum = Number.parseInt(examID, 10);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user!.id)
    .single();

  if (!Number.isFinite(examIdNum)) {
    redirect("/admin-dashboard");
  }

  const { data: exam } = await supabase
    .from("exam")
    .select("name, topic_id")
    .eq("id", examIdNum)
    .single();

  if (!exam) {
    redirect("/admin-dashboard");
  }

  const { data: topic } = await supabase
    .from("topic")
    .select("name")
    .eq("id", exam.topic_id)
    .single();

  const questions = await getExamQuestionsDetail(examIdNum, supabase);
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
            href: `/admin-topic/${exam.topic_id}`,
          },
        ]
      : []),
    {
      label: exam.name,
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
              title={exam.name}
              subtitle="Exam questions for this exam, in display order."
            />

            <SectionCard>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#592803]">
                    Questions
                  </h2>
                  <p className="mt-1 text-sm text-[#4B3A46]">
                    Add and manage question items for this exam.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AdminExamQuestionClient
                    examId={examIdNum}
                    defaultOrder={nextOrder}
                  />
                  <DeleteExamClient
                    examId={examIdNum}
                    topicId={exam.topic_id}
                  />
                </div>
              </div>

              {questions.length === 0 ? (
                <p className="text-sm text-[#4B3A46]">
                  No exam questions yet. Add questions to build this exam.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {questions.map((examQuestion) => (
                    <div
                      key={examQuestion.id}
                      className="rounded-xl border border-[#4B3A46]/15 bg-white/70 px-5 py-4 shadow-sm"
                    >
                      <div className="mb-3 grid gap-3 sm:grid-cols-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                            ID
                          </span>
                          <span className="font-semibold text-[#592803]">
                            {examQuestion.id}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                            Type
                          </span>
                          <span className="font-semibold text-[#592803]">
                            {examQuestion.type}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                            Order
                          </span>
                          <span className="font-semibold text-[#592803]">
                            {examQuestion.order}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                            Question
                          </span>
                          <span className="font-semibold text-[#592803]">
                            {examQuestion.question}
                          </span>
                        </div>
                      </div>
                      <div className="border-t border-[#4B3A46]/10 pt-3">
                        <EditExamQuestionClient
                          examId={examIdNum}
                          question={examQuestion}
                        />
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
