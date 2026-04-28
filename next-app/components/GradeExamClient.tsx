"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SectionCard from "@/components/SectionCard";
import {
  gradeExamSubmission,
  type FullExamForGrading,
} from "@/utils/grade/util";

type GradeExamClientProps = {
  examData: FullExamForGrading;
};

type QuestionGradeState = {
  score: number | null;
  feedback: string;
};

export default function GradeExamClient({ examData }: GradeExamClientProps) {
  const router = useRouter();
  const [gradingState, setGradingState] = useState<
    Record<string, Record<number, QuestionGradeState>>
  >({});
  const [submittingKeys, setSubmittingKeys] = useState<Record<string, boolean>>({});
  const [submitErrors, setSubmitErrors] = useState<Record<string, string | null>>({});
  const [submittedKeys, setSubmittedKeys] = useState<Record<string, boolean>>({});

  const questionById = useMemo(
    () => new Map(examData.questions.map((q) => [q.id, q])),
    [examData.questions],
  );

  function submissionKey(userId: string, submissionNumber: number) {
    return `${userId}:${submissionNumber}`;
  }

  function getGradeState(key: string, questionId: number): QuestionGradeState {
    return gradingState[key]?.[questionId] ?? { score: null, feedback: "" };
  }

  function updateQuestionGrade(
    key: string,
    questionId: number,
    update: Partial<QuestionGradeState>,
  ) {
    setGradingState((prev) => {
      const currentQuestion = prev[key]?.[questionId] ?? { score: null, feedback: "" };
      return {
        ...prev,
        [key]: {
          ...(prev[key] ?? {}),
          [questionId]: {
            ...currentQuestion,
            ...update,
          },
        },
      };
    });
  }

  async function submitGrade(submission: FullExamForGrading["submissions"][number]) {
    const key = submissionKey(submission.user_id, submission.submission_number);
    const questionGrades = gradingState[key] ?? {};

    const missing = examData.questions.some((question) => {
      const state = questionGrades[question.id];
      return (
        !state ||
        !Number.isFinite(state.score ?? NaN) ||
        (state.score ?? 0) < 1 ||
        (state.score ?? 0) > 10 ||
        !state.feedback.trim()
      );
    });

    if (missing) {
      setSubmitErrors((prev) => ({
        ...prev,
        [key]: "Please grade every question (1-10) and add feedback before submitting.",
      }));
      return;
    }

    const feedbackRows = examData.questions.map((question) => ({
      exam_question_id: question.id,
      score: questionGrades[question.id].score ?? 0,
      feedback: questionGrades[question.id].feedback.trim(),
    }));

    const totalScore = feedbackRows.reduce((sum, row) => sum + (row.score ?? 0), 0);
    const maxScore = examData.questions.length * 10;

    setSubmittingKeys((prev) => ({ ...prev, [key]: true }));
    setSubmitErrors((prev) => ({ ...prev, [key]: null }));

    const result = await gradeExamSubmission({
      user_id: submission.user_id,
      topic_id: submission.topic_id,
      exam_id: submission.exam_id,
      teacher_feedback: feedbackRows,
      score: totalScore,
      max_score: maxScore,
      submission_number: submission.submission_number,
    });

    setSubmittingKeys((prev) => ({ ...prev, [key]: false }));

    if (!result.success) {
      setSubmitErrors((prev) => ({
        ...prev,
        [key]: result.error ?? "Failed to submit grade.",
      }));
      return;
    }

    setSubmittedKeys((prev) => ({ ...prev, [key]: true }));
    router.push("/grades");
  }

  if (examData.submissions.length === 0) {
    return (
      <SectionCard>
        <p className="text-sm text-[#4B3A46]">
          No outstanding submissions for this exam right now.
        </p>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-8">
      {examData.submissions.map((submission) => {
        const key = submissionKey(submission.user_id, submission.submission_number);
        const isSubmitting = submittingKeys[key] === true;
        const isSubmitted = submittedKeys[key] === true;

        return (
          <SectionCard key={key}>
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                    Student
                  </p>
                  <h3 className="text-xl font-bold text-[#592803]">
                    {submission.student_name ?? submission.user_id}
                  </h3>
                  <p className="text-sm text-[#4B3A46]">
                    Submission #{submission.submission_number}
                  </p>
                </div>
                {isSubmitted ? (
                  <span className="rounded-full bg-[#EAF7D7] px-3 py-1 text-xs font-semibold text-[#4F6B1B]">
                    Submitted
                  </span>
                ) : null}
              </div>

              {examData.questions.map((question, index) => {
                const studentAnswer =
                  submission.submitted_answers.find(
                    (row) => Number(row.exam_question_id) === question.id,
                  )?.answer ?? "";
                const questionState = getGradeState(key, question.id);

                return (
                  <div
                    key={question.id}
                    className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-5"
                  >
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

                    <div className="mt-4 rounded-xl border border-[#4B3A46]/10 bg-[#FFF8F0] p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                        Student Answer
                      </p>
                      <p className="mt-2 text-sm text-[#4B3A46] whitespace-pre-wrap">
                        {studentAnswer.trim() || "No answer provided."}
                      </p>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-[140px_1fr]">
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                          Score (1-10)
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={questionState.score ?? ""}
                          onChange={(e) =>
                            updateQuestionGrade(key, question.id, {
                              score:
                                e.target.value === ""
                                  ? null
                                  : Number.parseInt(e.target.value, 10),
                            })
                          }
                          className="rounded-lg border border-[#4B3A46]/20 bg-white px-3 py-2 text-sm text-[#592803] outline-none focus:border-[#592803]"
                        />
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                          Feedback
                        </span>
                        <textarea
                          rows={3}
                          value={questionState.feedback}
                          onChange={(e) =>
                            updateQuestionGrade(key, question.id, {
                              feedback: e.target.value,
                            })
                          }
                          className="rounded-lg border border-[#4B3A46]/20 bg-white px-3 py-2 text-sm text-[#592803] outline-none focus:border-[#592803]"
                          placeholder="Write feedback for this answer..."
                        />
                      </label>
                    </div>
                  </div>
                );
              })}

              {submitErrors[key] ? (
                <p className="text-sm font-semibold text-red-600">{submitErrors[key]}</p>
              ) : null}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => submitGrade(submission)}
                  disabled={isSubmitting || isSubmitted}
                  className="rounded-xl bg-[#592803] px-5 py-3 text-sm font-semibold text-[#FFF1E5] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : isSubmitted
                      ? "Grade Submitted"
                      : "Submit Grade"}
                </button>
              </div>
            </div>
          </SectionCard>
        );
      })}
    </div>
  );
}
