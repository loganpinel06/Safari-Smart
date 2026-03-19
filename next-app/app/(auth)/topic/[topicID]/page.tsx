import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import TopicSectionCard from "@/components/TopicSectionCard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topicID: string }>;
}) {
  const supabase = await createClient();
  const topicID = (await params).topicID;

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

  // This page is currently receiving a CATEGORY id from the previous page
  const { data: currentTopicCategory } = await supabase
    .from("category")
    .select("name, parent_id")
    .eq("id", topicID)
    .single();

  const { data: parentCategory } = await supabase
    .from("category")
    .select("name")
    .eq("id", currentTopicCategory?.parent_id)
    .single();

  async function logout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/signin");
  }

  const topicSections = [
    {
      title: "Lesson Plans",
      description:
        "Read through lesson content, video materials, and guided explanations for this topic.",
      href: `/lesson/${topicID}`,
      accent: "green" as const,
    },
    {
      title: "Quizzes",
      description:
        "Practice what you learned with topic-based quiz questions and immediate feedback.",
      href: `/quiz/${topicID}`,
      accent: "yellow" as const,
    },
    {
      title: "Exam Practice",
      description:
        "Work through exam-style questions to prepare for formal assessments.",
      href: `/exam/${topicID}`,
      accent: "orange" as const,
    },
  ];

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
          <div className="max-w-6xl space-y-8">
            <PageHeader
              title={currentTopicCategory?.name ?? "Topic"}
              subtitle={`${parentCategory?.name ?? "Subject"} • Choose how you want to continue in this topic.`}
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
                  Subject:{" "}
                  <span className="font-semibold text-[#592803]">
                    {parentCategory?.name ?? "Unknown"}
                  </span>
                </p>
              </div>

              <div className="rounded-xl bg-[#FFF1B8] p-4 border border-[#4B3A46]/10 w-full md:w-[180px]">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                  Sections
                </p>
                <p className="mt-2 text-2xl font-extrabold text-[#592803]">
                  {topicSections.length}
                </p>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#592803]">
                  Continue Learning
                </h2>
                <p className="text-sm text-[#4B3A46] mt-1">
                  Open lesson content, quizzes, or exam practice for{" "}
                  {currentTopicCategory?.name ?? "this topic"}.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {topicSections.map((section) => (
                  <TopicSectionCard
                    key={section.title}
                    title={section.title}
                    description={section.description}
                    href={section.href}
                    accent={section.accent}
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