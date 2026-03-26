import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ExamRunner from "@/components/ExamRunner";

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

  let questions: any[] = [];

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
            activeItem="Dashboard"
            logoutAction={logout}
          />
        </div>

        <div className="flex-1 px-10 py-10">
          <div className="max-w-5xl space-y-8">
            <PageHeader
              title={`${currentExamCategory?.name ?? "Topic"} Exam`}
              subtitle={`${parentCategory?.name ?? "Subject"} • Exam Mode`}
            />

            <ExamRunner questions={questions} />
          </div>
        </div>
      </div>
    </main>
  );
}