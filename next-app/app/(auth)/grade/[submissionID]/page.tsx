import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import GradeExamClient from "@/components/GradeExamClient";
import { createClient } from "@/utils/supabase/server";
import { getFullExamForGrading } from "@/utils/grade/util";

export default async function GradeExamPage({
  params,
}: {
  params: Promise<{ submissionID: string }>;
}) {
  const supabase = await createClient();
  const submissionID = Number.parseInt((await params).submissionID, 10);

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

  if (profile?.account_type !== "Teacher") {
    redirect("/dashboard");
  }

  if (!Number.isFinite(submissionID)) {
    redirect("/grade");
  }

  const examData = await getFullExamForGrading(submissionID, supabase);

  async function logout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/signin");
  }

  return (
    <main className="min-h-screen bg-[#FFF1E5] text-[#592803]">
      <div className="flex min-h-screen">
        <div className="w-[320px] shrink-0">
          <Sidebar
            userName={profile?.name ?? "Teacher"}
            examTrack={profile?.exam_type ?? "BECE"}
            role={profile?.account_type ?? "Teacher"}
            activeItem="Grading"
            logoutAction={logout}
            profile={profile}
          />
        </div>

        <div className="flex-1 px-10 py-10">
          <div className="mx-auto max-w-6xl space-y-8">
            <PageHeader
              title={`Grade: ${examData.exam?.name ?? "Exam"}`}
              subtitle="Score each question from 1-10 and leave feedback before submitting"
            />

            <GradeExamClient examData={examData} />
          </div>
        </div>
      </div>
    </main>
  );
}
