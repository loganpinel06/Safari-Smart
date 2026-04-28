import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getStudentExamFeedbackDetail } from "@/utils/progress/exam/util";

export default async function ExamFeedbackPage({
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

  if (profile?.account_type !== "Student") {
    redirect("/dashboard");
  }

  const feedbackDetail = await getStudentExamFeedbackDetail(
    submissionID,
    user.id,
    supabase,
  );

  if (!feedbackDetail) {
    redirect("/dashboard");
  }

  const feedbackByQuestionId = new Map<number, { score: number | null; feedback: string }>(
    feedbackDetail.teacherFeedback.map((row) => [
      Number(row.exam_question_id),
      {
        score: row.score ?? null,
        feedback: row.feedback ?? "",
      },
    ]),
  );
  const answerByQuestionId = new Map<number, string>(
    feedbackDetail.submittedAnswers.map((row) => [
      Number(row.exam_question_id),
      row.answer ?? "",
    ]),
  );

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
                { label: feedbackDetail.topicName ?? "Topic", href: "/dashboard" },
                { label: feedbackDetail.examName ?? "Exam", href: `/exam/${feedbackDetail.submission.exam_id}` },
                { label: `Feedback #${feedbackDetail.submission.submission_number}` },
              ]}
            />

            <PageHeader
              title={`${feedbackDetail.examName ?? "Exam"} Feedback`}
              subtitle={`Submission #${feedbackDetail.submission.submission_number}`}
            />

            <SectionCard>
              <p className="text-sm text-[#4B3A46]">
                Status:{" "}
                <span className="font-semibold text-[#592803]">
                  {feedbackDetail.submission.status ?? "submitted"}
                </span>
              </p>
              <p className="mt-1 text-sm text-[#4B3A46]">
                Grade:{" "}
                <span className="font-semibold text-[#592803]">
                  {feedbackDetail.submission.score != null &&
                  feedbackDetail.submission.max_score != null
                    ? `${feedbackDetail.submission.score}/${feedbackDetail.submission.max_score}`
                    : "Pending grading"}
                </span>
              </p>
            </SectionCard>

            <div className="space-y-4">
              {feedbackDetail.questions.map((question, index) => {
                const answer = answerByQuestionId.get(question.id) ?? "";
                const feedback = feedbackByQuestionId.get(question.id);

                return (
                  <SectionCard key={question.id}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                      Question {index + 1}
                    </p>
                    <p className="mt-2 font-semibold text-[#592803]">
                      {question.question}
                    </p>
                    {question.main_text ? (
                      <p className="mt-2 text-sm text-[#4B3A46] whitespace-pre-wrap">
                        {question.main_text}
                      </p>
                    ) : null}

                    <div className="mt-4 rounded-xl border border-[#4B3A46]/10 bg-white/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                        Your Answer
                      </p>
                      <p className="mt-2 text-sm text-[#4B3A46] whitespace-pre-wrap">
                        {answer.trim() || "No answer provided."}
                      </p>
                    </div>

                    <div className="mt-4 rounded-xl border border-[#4B3A46]/10 bg-[#FFF8F0] p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                        Teacher Feedback
                      </p>
                      <p className="mt-2 text-sm text-[#4B3A46] whitespace-pre-wrap">
                        {feedback?.feedback?.trim() || "No feedback yet."}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[#592803]">
                        Question Grade:{" "}
                        {feedback?.score != null ? `${feedback.score}/10` : "Pending"}
                      </p>
                    </div>
                  </SectionCard>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
