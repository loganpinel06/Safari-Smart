import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ExamRunner from "@/components/ExamRunner";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionCard from "@/components/SectionCard";

type Choice =
  | string
  | {
    text: string;
    correct?: boolean;
  };

type ExamQuestion = {
  id: string;
  top_text?: string | null;
  question: string;
  choices?: Choice[] | null;
};

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

  // For now examID is still acting like the selected topic/category id
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

  // Load the real exam row for this topic/category if it exists
  const { data: exam } = await supabase
    .from("exam")
    .select("*")
    .eq("topic_id", examID)
    .order("order", { ascending: true })
    .limit(1)
    .maybeSingle();

  let questions: ExamQuestion[] = [];

  if (exam) {
    const { data: examQuestions } = await supabase
      .from("exam_question")
      .select("*")
      .eq("exam_id", exam.id)
      .order("id", { ascending: true });

    questions = examQuestions ?? [];
  }

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
                  label: parentCategory?.name ?? "Subject",
                  href: `/dashboard/${currentExamCategory?.parent_id}`,
                },
                {
                  label: currentExamCategory?.name ?? "Topic",
                  href: `/topic/${examID}`,
                },
                {
                  label: "Exam",
                },
              ]}
            />

            <PageHeader
              title={`${currentExamCategory?.name ?? "Topic"} Exam`}
              subtitle={
                isTeacher
                  ? `${parentCategory?.name ?? "Subject"} • Teacher preview mode`
                  : isParent
                    ? `${parentCategory?.name ?? "Subject"} • Parent read-only view`
                    : `${parentCategory?.name ?? "Subject"} • Exam Mode`
              }
            />

            {isTeacher ? (
              <SectionCard>
                <h2 className="text-2xl font-bold text-[#592803]">
                  Teacher Preview
                </h2>
                <p className="mt-2 text-sm text-[#4B3A46]">
                  Teachers can preview exam structure and questions here. This is where
                  exam editing, assignment controls, and analytics can be added later.
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
              <ExamRunner questions={questions} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}