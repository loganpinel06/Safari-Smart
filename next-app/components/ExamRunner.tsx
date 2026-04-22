"use client";

import { useMemo, useState } from "react";
import SectionCard from "@/components/SectionCard";
import ExamQuestionCard from "@/components/ExamQuestionCard";
import { ExamQuestionDetail } from "@/utils/exam/util";
import { handleExamSubmission } from "@/utils/progress/exam/util";

type ExamRunnerProps = {
  examTitle: string;
  questions: ExamQuestionDetail[];
  userId: string;
  topicId: number | null;
  examId: number | null;
  hasPreviousSubmission: boolean;
  previousStatus: string | null;
  previousScore: number | null;
};

export default function ExamRunner({
  examTitle,
  questions,
  userId,
  topicId,
  examId,
  hasPreviousSubmission,
  previousStatus,
  previousScore,
}: ExamRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [started, setStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] ?? "" : "";

  const answeredCount = useMemo(() => {
    return questions.filter((question) => {
      const value = answers[question.id];
      return !!value?.trim();
    }).length;
  }, [questions, answers]);

  const progressPercent =
    questions.length > 0
      ? Math.round((answeredCount / questions.length) * 100)
      : 0;

  const allAnswered = questions.length > 0 && answeredCount === questions.length;

  function handleTextChange(value: string) {
    if (!currentQuestion || submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setReviewMode(false);
    }
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setReviewMode(false);
    }
  }

  function goToQuestion(index: number) {
    setCurrentIndex(index);
    setReviewMode(false);
  }

  function openReview() {
    setReviewMode(true);
  }

  async function submitExam() {
    if (!allAnswered || submitted || isSubmitting) {
      return;
    }

    if (topicId == null || examId == null) {
      setSubmitError("Could not save exam submission right now.");
      setSubmitted(true);
      setReviewMode(false);
      return;
    }

    const submittedAnswers = questions.map((question) => ({
      exam_question_id: question.id,
      answer: answers[question.id]?.trim() ?? "",
    }));

    setIsSubmitting(true);
    setSubmitError(null);

    const result = await handleExamSubmission({
      user_id: userId,
      topic_id: topicId,
      exam_id: examId,
      submitted_answers: submittedAnswers,
    });

    if (!result.success) {
      setSubmitError(result.error ?? "Failed to submit exam.");
    }

    setIsSubmitting(false);
    setSubmitted(true);
    setReviewMode(false);
  }

  function getWordCount(text: string) {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }

  function getQuestionStatus(question: ExamQuestionDetail) {
    const value = answers[question.id];
    return !!value?.trim();
  }

  function renderMedia(question: ExamQuestionDetail) {
    if (!question.path) return null;

    if (question.type === "Image") {
      return (
        <SectionCard>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
              Image Prompt
            </p>
            <img
              src={question.path}
              alt="Exam question media"
              className="max-h-[420px] w-full rounded-2xl object-contain border border-[#4B3A46]/10 bg-white"
            />
          </div>
        </SectionCard>
      );
    }

    if (question.type === "Video") {
      return (
        <SectionCard>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
              Video Prompt
            </p>
            <video
              controls
              className="w-full rounded-2xl border border-[#4B3A46]/10 bg-black"
            >
              <source src={question.path} />
              Your browser does not support the video tag.
            </video>
          </div>
        </SectionCard>
      );
    }

    return null;
  }

  if (!questions || questions.length === 0) {
    return (
      <SectionCard>
        <div className="space-y-3 text-center py-6">
          <h2 className="text-2xl font-bold text-[#592803]">
            No Exam Available
          </h2>

          <p className="text-sm text-[#4B3A46]">
            This topic does not have an exam yet.
          </p>

          <p className="text-sm text-[#4B3A46]">
            Please check back later or ask your teacher for more information.
          </p>
        </div>
      </SectionCard>
    );
  }

  if (!started) {
    return (
      <SectionCard>
        <div className="space-y-6 text-center py-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
              Exam Mode
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#592803]">
              {examTitle}
            </h2>
          </div>

          <div className="flex justify-center gap-8 rounded-2xl bg-[#FFF1B8] py-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#592803]">{questions.length}</p>
              <p className="text-xs font-semibold text-[#4B3A46]">Questions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#592803]">Written</p>
              <p className="text-xs font-semibold text-[#4B3A46]">Responses</p>
            </div>
          </div>

          {hasPreviousSubmission ? (
            <div className="rounded-2xl border border-[#4B3A46]/15 bg-white/70 px-4 py-3">
              <p className="text-sm font-semibold text-[#592803]">
                Previous status: {previousStatus ?? "submitted"}
              </p>
              <p className="mt-1 text-xs text-[#4B3A46]">
                {previousScore != null
                  ? `Previous score: ${previousScore}`
                  : "No score yet (awaiting grading)."}
              </p>
              <p className="mt-1 text-xs text-[#4B3A46]">
                You have submitted this exam before. Do you want to try again?
              </p>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setStarted(true)}
            className="w-full rounded-xl bg-[#592803] px-5 py-4 font-semibold text-[#FFF1E5] transition hover:opacity-90"
          >
            {hasPreviousSubmission ? "Try Again" : "Start Exam"}
          </button>
        </div>
      </SectionCard>
    );
  }

  if (!currentQuestion) return null;

  if (submitted) {
    return (
      <div className="space-y-8">
        <SectionCard>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-[#592803]">
              Exam Submitted
            </h2>
            <p className="text-sm text-[#4B3A46]">
              You completed {answeredCount} out of {questions.length} questions.
            </p>
            <p className="text-sm text-[#4B3A46]">
              This exam includes written responses and may require teacher review.
            </p>
            {submitError ? (
              <p className="text-sm font-semibold text-red-600">
                {submitError}
              </p>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#592803]">
              Submission Review
            </h3>

            <div className="space-y-4">
              {questions.map((question, index) => (
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
                  <p className="mt-3 text-sm leading-7 text-[#4B3A46] whitespace-pre-wrap">
                    {answers[question.id]?.trim() || "No response provided."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    );
  }

  if (reviewMode) {
    return (
      <div className="space-y-8">
        <SectionCard>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#592803]">
                Review Before Submit
              </h2>
              <p className="mt-1 text-sm text-[#4B3A46]">
                Check your responses before submitting the exam.
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                Completion
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#592803]">
                {answeredCount}/{questions.length}
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const answered = getQuestionStatus(question);

              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => goToQuestion(index)}
                  className="flex w-full cursor-pointer items-start justify-between rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                      Question {index + 1}
                    </p>
                    <p className="mt-2 font-semibold text-[#592803]">
                      {question.question}
                    </p>
                    <p className="mt-2 text-sm text-[#4B3A46]">
                      {answered
                        ? `${getWordCount(answers[question.id])} words written`
                        : "No response yet"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      answered
                        ? "bg-[#EAF7D7] text-[#4F6B1B] border border-[#C9E39B]"
                        : "bg-[#FFF6CC] text-[#7A5E00] border border-[#E7D37A]"
                    }`}
                  >
                    {answered ? "Answered" : "Unanswered"}
                  </span>
                </button>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setReviewMode(false)}
            className="rounded-xl cursor-pointer border border-[#4B3A46]/20 px-5 py-3 font-semibold text-[#592803] transition hover:bg-white/40"
          >
            Back to Exam
          </button>

          <button
            type="button"
            onClick={submitExam}
            disabled={!allAnswered || isSubmitting}
            className="rounded-xl cursor-pointer bg-[#592803] px-5 py-3 font-semibold text-[#FFF1E5] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Exam"}
          </button>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionCard>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
              {examTitle}
            </p>
            <p className="text-sm text-[#4B3A46]">
              Answered {answeredCount} / {questions.length}
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#4B3A46]/10">
              <div
                className="h-2 rounded-full bg-[#592803] transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="flex justify-center gap-3">
          {questions.map((question, index) => {
            const answered = getQuestionStatus(question);
            const isCurrent = index === currentIndex;

            return (
              <button
                key={question.id}
                type="button"
                onClick={() => goToQuestion(index)}
                className={`cursor-pointer h-9 w-9 rounded-full text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-[#592803] text-[#FFF1E5] scale-110"
                    : answered
                    ? "bg-[#FFF1B8] text-[#592803] border border-[#592803]"
                    : "bg-white text-[#4B3A46] border border-[#4B3A46]/30"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </SectionCard>

      <ExamQuestionCard
        question={currentQuestion.question}
        questionNumber={currentIndex + 1}
      />

      {currentQuestion.main_text && (
        <SectionCard>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
              Prompt
            </p>
            <p className="text-sm leading-7 text-[#4B3A46] whitespace-pre-wrap">
              {currentQuestion.main_text}
            </p>
          </div>
        </SectionCard>
      )}

      {renderMedia(currentQuestion)}

      <SectionCard>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
              Your Response
            </p>
            <p className="text-xs text-[#4B3A46]">
              {getWordCount(currentAnswer)} words
            </p>
          </div>

          <textarea
            value={currentAnswer}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={10}
            className="w-full rounded-2xl border border-[#4B3A46]/15 bg-white p-4 text-[#592803] outline-none focus:border-[#592803]"
            placeholder="Write your answer here..."
          />
        </div>
      </SectionCard>

      <SectionCard className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="rounded-xl cursor-pointer border border-[#4B3A46]/20 px-5 py-3 font-semibold text-[#592803] transition hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <div className="flex gap-3">
          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!currentAnswer.trim()}
              className="rounded-xl cursor-pointer bg-[#FFF1B8] px-5 py-3 font-semibold text-[#592803] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next Question
            </button>
          ) : (
            <button
              type="button"
              onClick={openReview}
              disabled={!allAnswered}
              className="rounded-xl cursor-pointer bg-[#FFF1B8] px-5 py-3 font-semibold text-[#592803] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Review Exam
            </button>
          )}
        </div>
      </SectionCard>
    </div>
  );
}