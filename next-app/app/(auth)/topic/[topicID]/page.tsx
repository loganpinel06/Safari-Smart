import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import LearningItemCard from "@/components/LearningItemCard";
import LevelMap from "@/components/LevelMap";
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

  // Level Map Nodes
  const levels = [
    {
      id: "l1",
      label: "Introduction",
      type: "lesson" as const,
      status: "completed" as const,
      href: `/lesson/${topicID}`,
    },
    {
      id: "l2",
      label: "Guided Practice",
      type: "lesson" as const,
      status: "current" as const,
      href: `/lesson/${topicID}`,
    },
    {
      id: "q1",
      label: "Quiz 1",
      type: "quiz" as const,
      status: "available" as const,
      href: `/quiz/${topicID}`,
    },
    {
      id: "l3",
      label: "Extended Review",
      type: "lesson" as const,
      status: "available" as const,
      href: `/lesson/${topicID}`,
    },
    {
      id: "q2",
      label: "Quiz 2",
      type: "quiz" as const,
      status: "available" as const,
      href: `/quiz/${topicID}`,
    },
    {
      id: "e1",
      label: "Exam Practice",
      type: "exam" as const,
      status: "available" as const,
      href: `/exam/${topicID}`,
    },
  ];

  // Listings
  const lessons = [
    {
      title: "Lesson 1: Introduction",
      description: "Start with the core ideas and overview for this topic.",
      href: `/lesson/${topicID}`,
      kind: "Lesson" as const,
      status: "Complete" as const,
    },
    {
      title: "Lesson 2: Guided Practice",
      description: "Work through examples and explanations step by step.",
      href: `/lesson/${topicID}`,
      kind: "Lesson" as const,
      status: "In Progress" as const,
    },
    {
      title: "Lesson 3: Extended Review",
      description: "Review the topic with additional notes and support.",
      href: `/lesson/${topicID}`,
      kind: "Lesson" as const,
      status: "Not Started" as const,
    },
  ];

  const quizzes = [
    {
      title: "Quiz 1",
      description: "Check your understanding with short practice questions.",
      href: `/quiz/${topicID}`,
      kind: "Quiz" as const,
      status: "Not Started" as const,
    },
    {
      title: "Quiz 2",
      description: "A second quiz to reinforce the topic.",
      href: `/quiz/${topicID}`,
      kind: "Quiz" as const,
      status: "Not Started" as const,
    },
  ];

  const exams = [
    {
      title: "Exam Practice 1",
      description: "Try an exam-style set of questions for this topic.",
      href: `/exam/${topicID}`,
      kind: "Exam" as const,
      status: "Not Started" as const,
    },
  ];

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
                  label: parentCategory?.name ?? "Subject",
                  href: `/dashboard/${currentTopicCategory?.parent_id}`,
                },
                {
                  label: currentTopicCategory?.name ?? "Topic",
                },
              ]}
            />
            <PageHeader
              title={currentTopicCategory?.name ?? "Topic"}
            />

            {/* Topic info */}
            <SectionCard>
              <div className="space-y-1">
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
            </SectionCard>

            {/* Level map replaces the three stat cards */}
            <LevelMap
              levels={levels}
              subjectTitle={currentTopicCategory?.name ?? "Topic"}
            />

            {/* Lessons */}
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

            {/* Quizzes */}
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

            {/* Exams */}
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

