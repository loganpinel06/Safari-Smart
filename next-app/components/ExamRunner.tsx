"use client";

import { useMemo, useState } from "react";
import SectionCard from "@/components/SectionCard";
import ExamQuestionCard from "@/components/ExamQuestionCard";
import QuizChoiceButton from "@/components/QuizChoiceButton";
import { ExamQuestionDetail } from "@/utils/exam/util";

type ExamRunnerProps = {
  questions: ExamQuestionDetail[];
};

export default function ExamRunner({ questions }: ExamRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>(
    {}
  );
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];

  const normalizedChoices = useMemo(() => {
    if (!currentQuestion?.choices || currentQuestion.choices.length === 0) {
      return [];
    }

    return currentQuestion.choices.map((choice) =>
      typeof choice === "string" ? { text: choice } : choice
    );
  }, [currentQuestion]);

  const selectedChoiceIndex = currentQuestion
    ? selectedAnswers[currentQuestion.id]
    : undefined;

  function handleSelect(choiceIndex: number) {
    if (!currentQuestion || submitted) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: choiceIndex,
    }));
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  const answeredCount = Object.keys(selectedAnswers).length;
  const allAnswered = questions.length > 0 && answeredCount === questions.length;

  const score = useMemo(() => {
    let total = 0;

    for (const question of questions) {
      if (!question.choices) continue;

      const choiceIndex = selectedAnswers[question.id];
      if (choiceIndex === undefined) continue;

      const normalized = question.choices.map((choice) =>
        typeof choice === "string" ? { text: choice } : choice
      );

      if (normalized[choiceIndex]?.correct) {
        total += 1;
      }
    }

    return total;
  }, [questions, selectedAnswers]);

  if (!questions || questions.length === 0) {
    return (
      <SectionCard>
        <p className="text-sm text-[#4B3A46]">
          No exam questions were found for this exam yet.
        </p>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-8">
      <SectionCard>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <p className="text-sm text-[#4B3A46]">
            Answered {answeredCount} / {questions.length}
          </p>
        </div>
      </SectionCard>

      <ExamQuestionCard
        question={currentQuestion.question}
      />

      {currentQuestion.top_text && (
        <SectionCard>
          <p className="text-sm leading-7 text-[#4B3A46]">
            {currentQuestion.top_text}
          </p>
        </SectionCard>
      )}

      <SectionCard>
        {normalizedChoices.length > 0 ? (
          <div className="grid gap-4">
            {normalizedChoices.map((choice, index) => (
              <QuizChoiceButton
                key={`${currentQuestion.id}-${index}`}
                label={choice.text}
                selected={selectedChoiceIndex === index}
                onClick={() => handleSelect(index)}
                disabled={submitted}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#4B3A46]">
            This exam question does not have answer choices loaded from the backend yet.
          </p>
        )}
      </SectionCard>

      {!submitted ? (
        <SectionCard className="flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="rounded-xl border border-[#4B3A46]/20 px-5 py-3 font-semibold text-[#592803] transition hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={selectedChoiceIndex === undefined}
              className="rounded-xl bg-[#FFF1B8] px-5 py-3 font-semibold text-[#592803] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next Question
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              disabled={!allAnswered}
              className="rounded-xl bg-[#592803] px-5 py-3 font-semibold text-[#FFF1E5] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit Exam
            </button>
          )}
        </SectionCard>
      ) : (
        <SectionCard>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-[#592803]">
              Exam Submitted
            </h3>
            <p className="text-sm text-[#4B3A46]">
              You answered {answeredCount} out of {questions.length} questions.
            </p>
            <p className="text-sm text-[#4B3A46]">
              Score: <span className="font-semibold text-[#592803]">{score}</span> / {questions.length}
            </p>
          </div>
        </SectionCard>
      )}
    </div>
  );
}