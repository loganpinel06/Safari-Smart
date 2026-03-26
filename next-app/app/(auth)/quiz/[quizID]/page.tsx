import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuizRunner from "@/components/QuizRunner";

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

  // For now, quizID is really the selected topic/category id
  const { data: currentQuizCategory } = await supabase
    .from("category")
    .select("name, parent_id")
    .eq("id", quizID)
    .single();

  const { data: parentCategory } = await supabase
    .from("category")
    .select("name")
    .eq("id", currentQuizCategory?.parent_id)
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
            <Breadcrumbs
                items={[
                    {
                    label: parentCategory?.name ?? "Subject",
                    href: `/dashboard/${currentQuizCategory?.parent_id}`,
                    },
                    {
                    label: currentQuizCategory?.name ?? "Topic",
                    href: `/topic/${quizID}`,
                    },
                    {
                    label: "Quiz",
                    },
                ]}
                />
            <PageHeader
              title={`${currentQuizCategory?.name ?? "Topic"} Quiz`}
              subtitle={`${parentCategory?.name ?? "Subject"} • Question 1 of 5`}
            />

          <QuizRunner topicName={currentQuizCategory?.name ?? "Sample Topic"} />
          
          </div>
        </div>
      </div>
    </main>
  );
}