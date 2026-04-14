import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ExamRunner from "@/components/ExamRunner";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionCard from "@/components/SectionCard";
import { ExamQuestionDetail, getExamQuestionsDetail } from "@/utils/exam/util";

export default async function ExamPage({
  params,
}: {
  params: Promise<{ examID: string }>;
}) {
  const supabase = await createClient();
  const examID = (await params).examID;

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

  const isTeacher = profile?.account_type === "Teacher";
  const isParent = profile?.account_type === "Parent";

  const { data: exam } = await supabase
    .from("exam")
    .select("id, topic_id, name")
    .eq("id", examID)
    .maybeSingle();

  const { data: topic } = await supabase
    .from("topic")
    .select("name, id")
    .eq("id", exam?.topic_id)
    .maybeSingle();

  let questions: ExamQuestionDetail[] = await getExamQuestionsDetail(exam?.id, supabase);

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
            role={profile?.account_type ?? "Student"}
            activeItem="Dashboard"
            logoutAction={logout}
            profile={profile}
          />
        </div>

        <div className="flex-1 px-10 py-10">
          <div className="max-w-5xl space-y-8">
            <Breadcrumbs
              items={[
                {
                  label: topic?.name ?? "Topic",
                  href: `/topic/${topic?.id}`,
                },
                {
                  label: exam?.name ?? "Exam",
                },
              ]}
            />

            <PageHeader
              title={`${exam?.name ?? "Exam"}`}
              subtitle={
                isTeacher
                  ? `${topic?.name ?? "Topic"} • Teacher preview mode`
                  : isParent
                    ? `${topic?.name ?? "Topic"} • Parent read-only view`
                    : `${topic?.name ?? "Topic"} • Exam Mode`
              }
            />

            {isTeacher ? (
              <SectionCard>
                <h2 className="text-2xl font-bold text-[#592803]">
                  Teacher Preview
                </h2>
                <p className="mt-2 text-sm text-[#4B3A46]">
                  Teachers can preview the exam structure, prompts, and media here.
                  Later this page can support editing, assignment controls, and analytics.
                </p>
              </SectionCard>
            ) : isParent ? (
              <SectionCard>
                <h2 className="text-2xl font-bold text-[#592803]">
                  Parent View
                </h2>
                <p className="mt-2 text-sm text-[#4B3A46]">
                  Parents can review exam content and monitor progress, but cannot answer
                  or submit exam questions.
                </p>
              </SectionCard>
            ) : (
              <ExamRunner
                examTitle={exam?.name ?? "Exam"}
                questions={questions}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}