import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import LearningItemCard from "@/components/LearningItemCard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getTopicDetails } from "@/utils/topic/util";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topicID: string }>;
}) {
  const supabase = await createClient();
  const topicID = Number.parseInt((await params).topicID, 10);

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

  const { data: currentTopicCategory } = await supabase
    .from("topic")
    .select("name")
    .eq("id", topicID)
    .single();

  const topicContent = await getTopicDetails(topicID, supabase);
  const lessons = topicContent.filter((c) => c.type === "lesson");
  const quizzes = topicContent.filter((c) => c.type === "quiz");
  const exams = topicContent.filter((c) => c.type === "exam");

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
            profile={profile ?? undefined}
          />
        </div>

        <div className="flex-1 px-10 py-10">
          <div className="max-w-6xl space-y-8">
            <Breadcrumbs
              items={[
                {
                  label: currentTopicCategory?.name ?? "Topic",
                },
              ]}
            />
            <PageHeader
              title={currentTopicCategory?.name ?? "Topic"}
            />

            <SectionCard className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
                  Topic
                </p>
                <h2 className="text-2xl font-bold text-[#592803]">
                  {currentTopicCategory?.name ?? "Current Topic"}
                </h2>
                <p className="text-sm text-[#4B3A46]">
                  {isTeacher
                    ? "Teacher view for this topic."
                    : isParent
                      ? "Parent view of student activity for this topic."
                      : "View topic structure and student progress in this topic."}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 md:w-[360px]">
                <div className="rounded-xl bg-[#FFF1B8] p-4 border border-[#4B3A46]/10">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                    Lessons
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-[#592803]">
                    {lessons.length}
                  </p>
                </div>

                <div className="rounded-xl bg-white/80 p-4 border border-[#4B3A46]/10">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                    Quizzes
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-[#592803]">
                    {quizzes.length}
                  </p>
                </div>

                <div className="rounded-xl bg-white/80 p-4 border border-[#4B3A46]/10">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                    Exams
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-[#592803]">
                    {exams.length}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#592803]">Lessons</h2>
                <p className="text-sm text-[#4B3A46] mt-1">
                  {isTeacher
                    ? "Preview and manage lesson content assigned to students."
                    : isParent
                      ? "View lesson content and monitor student completion."
                      : "Work through the lessons in order to build understanding."}
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {lessons.map((lesson) => (
                  <LearningItemCard
                    key={lesson.id}
                    title={lesson.name}
                    description={"View lesson content and monitor student completion."}
                    href={`/lesson/${lesson.id}`}
                    kind="Lesson"
                    status="Not Started"
                  />
                ))}
              </div>
            </SectionCard>

            <SectionCard>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#592803]">Quizzes</h2>
                <p className="text-sm text-[#4B3A46] mt-1">
                  {isTeacher
                    ? "Review quiz content and track student performance."
                    : isParent
                      ? "View quiz activity and student performance for this topic."
                      : "Check your understanding with quiz practice for this topic."}
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {quizzes.map((quiz) => (
                  <LearningItemCard
                    key={quiz.id}
                    title={quiz.name}
                    description={"View quiz content and monitor student completion."}
                    href={`/quiz/${quiz.id}`}
                    kind="Quiz"
                    status="Not Started"
                  />
                ))}
              </div>
            </SectionCard>

            <SectionCard>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#592803]">
                  Exam Practice
                </h2>
                <p className="text-sm text-[#4B3A46] mt-1">
                  {isTeacher
                    ? "Preview exam-style practice and manage assessment flow."
                    : isParent
                      ? "View exam-practice progress and completion."
                      : "Apply what you learned with exam-style practice."}
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {exams.map((exam) => (
                  <LearningItemCard
                    key={exam.id}
                    title={exam.name}
                    description={"View exam content and monitor student completion."}
                    href={`/exam/${exam.id}`}
                    kind="Exam"
                    status="Not Started"
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