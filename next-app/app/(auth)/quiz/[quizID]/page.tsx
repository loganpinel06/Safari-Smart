import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuizRunner from "@/components/QuizRunner";
import SectionCard from "@/components/SectionCard";
import { getQuizQuestionsDetail } from "@/utils/quiz/util";

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

  const isTeacher = profile?.account_type === "Teacher";
  const isParent = profile?.account_type === "Parent";

  const { data: quiz } = await supabase
    .from("quiz")
    .select("name, topic_id")
    .eq("id", quizID)
    .single();

  const questions = await getQuizQuestionsDetail(quizID, supabase);

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
          activeItem="Dashboard"
          logoutAction={logout}
          profile={profile}
        />

        <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-4xl space-y-6 lg:space-y-8">
            <Breadcrumbs
              items={[
                {
                  label: quiz?.name ?? "Quiz",
                  href: `/topic/${quiz?.topic_id}`,
                },
                {
                  label: "Quiz",
                },
              ]}
            />

            <PageHeader
              title={`${quiz?.name ?? "Quiz"} Quiz`}
              subtitle={
                isTeacher
                  ? `${quiz?.name ?? "Quiz"} • Teacher preview mode`
                  : isParent
                  ? `${quiz?.name ?? "Quiz"} • Parent read-only view`
                  : `${quiz?.name ?? "Quiz"} • Practice Mode`
              }
            />

            {isTeacher ? (
              <SectionCard>
                <h2 className="text-2xl font-bold text-[#592803]">
                  Teacher Preview
                </h2>
                <p className="mt-2 text-sm text-[#4B3A46]">
                  Teachers can preview quiz structure and questions here. This
                  is where quiz editing and assignment controls can be added later.
                </p>
              </SectionCard>
            ) : isParent ? (
              <SectionCard>
                <h2 className="text-2xl font-bold text-[#592803]">
                  Parent View
                </h2>
                <p className="mt-2 text-sm text-[#4B3A46]">
                  Parents can review quiz content and monitor progress, but
                  cannot answer or submit quiz questions.
                </p>
              </SectionCard>
            ) : (
              <QuizRunner
                topicName={quiz?.name ?? "Quiz"}
                questions={questions}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}