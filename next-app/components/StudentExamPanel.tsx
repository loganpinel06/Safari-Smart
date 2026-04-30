"use client";

import { useState } from "react";
import Link from "next/link";
import SectionCard from "@/components/SectionCard";
import ExamRunner from "@/components/ExamRunner";
import { ExamQuestionDetail } from "@/utils/exam/util";
import { StudentExamSubmissionSummary } from "@/utils/progress/exam/util";

type StudentExamPanelProps = {
  examTitle: string;
  questions: ExamQuestionDetail[];
  userId: string;
  topicId: number | null;
  examId: number | null;
  submissions: StudentExamSubmissionSummary[];
};

export default function StudentExamPanel({
  examTitle,
  questions,
  userId,
  topicId,
  examId,
  submissions,
}: StudentExamPanelProps) {
  const [hasStartedExam, setHasStartedExam] = useState(false);
  const showSubmissions = submissions.length > 0 && !hasStartedExam;

  return (
    <div className="space-y-8">
      {showSubmissions ? (
        <SectionCard>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-[#592803]">Your Submissions</h2>
            <p className="mt-1 text-sm text-[#4B3A46]">
              View all your attempts, grades, and feedback.
            </p>
          </div>

          <div className="grid gap-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#592803]">
                      Submission #{submission.submission_number}
                    </p>
                    <p className="mt-1 text-sm text-[#4B3A46]">
                      Status:{" "}
                      <span className="font-semibold text-[#592803]">
                        {submission.status ?? "submitted"}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-[#4B3A46]">
                      Grade:{" "}
                      <span className="font-semibold text-[#592803]">
                        {submission.score != null && submission.max_score != null
                          ? `${submission.score}/${submission.max_score}`
                          : "Pending grading"}
                      </span>
                    </p>
                  </div>
                  <Link
                    href={`/exam/feedback/${submission.id}`}
                    className="rounded-xl bg-[#592803] px-4 py-2 text-sm font-semibold text-[#FFF1E5] transition hover:opacity-90"
                  >
                    View Feedback
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}

      <ExamRunner
        examTitle={examTitle}
        questions={questions}
        userId={userId}
        topicId={topicId}
        examId={examId}
        hasPreviousSubmission={submissions.length > 0}
        onStartExam={() => setHasStartedExam(true)}
      />
    </div>
  );
}
