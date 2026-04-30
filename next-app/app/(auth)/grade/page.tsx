import Link from "next/link";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import { createClient } from "@/utils/supabase/server";
import { getOutstandingUngradedExams } from "@/utils/grade/util";

export default async function GradePage() {
  const supabase = await createClient();

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

  const outstandingExams = await getOutstandingUngradedExams(supabase);

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
          <div className="max-w-6xl space-y-8">
            <PageHeader
              title="Grade Exams"
              subtitle="Outstanding exam submissions waiting for teacher grading"
            />

            <SectionCard>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#592803]">
                    Outstanding Submissions
                  </h2>
                  <p className="mt-1 text-sm text-[#4B3A46]">
                    {outstandingExams.length} submission
                    {outstandingExams.length === 1 ? "" : "s"} waiting for grading.
                  </p>
                </div>
              </div>

              {outstandingExams.length === 0 ? (
                <p className="text-sm text-[#4B3A46]">
                  No outstanding exams right now.
                </p>
              ) : (
                <div className="grid gap-4">
                  {outstandingExams.map((submission) => (
                    <div
                      key={submission.submission_id}
                      className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                            {submission.topic_name ?? "Topic"}
                          </p>
                          <h3 className="text-lg font-bold text-[#592803]">
                            {submission.exam_name ?? "Exam"}
                          </h3>
                          <p className="text-sm text-[#4B3A46]">
                            Student:{" "}
                            <span className="font-semibold text-[#592803]">
                              {submission.student_name ?? submission.user_id}
                            </span>
                          </p>
                          <p className="text-sm text-[#4B3A46]">
                            Submission #{submission.submission_number}
                          </p>
                        </div>

                        <Link
                          href={`/grade/${submission.submission_id}`}
                          className="rounded-xl bg-[#592803] px-4 py-2 text-sm font-semibold text-[#FFF1E5] transition hover:opacity-90"
                        >
                          Grade Exam
                        </Link>
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
