"use client";

import { useState } from "react";
import SectionCard from "@/components/SectionCard";
import QuizChoiceButton from "@/components/QuizChoiceButton";
import { QuizQuestionDetail } from "@/utils/quiz/util";

type QuizRunnerProps = {
  topicName: string;
  questions: QuizQuestionDetail[];
};

export default function QuizRunner({ topicName, questions }: QuizRunnerProps) {
  const questions = [
    {
      id: 1,
      question: "Which answer best matches this placeholder quiz structure?",
      choices: ["Option A", "Option B", "Option C", "Option D"],
    },
    {
      id: 2,
      question: "Which choice would be the next example question?",
      choices: ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];
  const selectedChoiceIndex = selectedAnswers[currentQuestion.id];

  function handleSelect(choiceIndex: number) {
    if (submitted) return;

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

  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <div className="space-y-8">
      <SectionCard>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <p className="text-sm text-[#4B3A46]">Practice Mode</p>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
              {topicName}
            </p>
            <h2 className="mt-3 text-2xl font-bold text-[#592803]">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="grid gap-4">
            {currentQuestion.choices.map((choice, index) => (
              <QuizChoiceButton
                key={choice}
                label={choice}
                selected={selectedChoiceIndex === index}
                onClick={() => handleSelect(index)}
                disabled={submitted}
              />
            ))}
          </div>
        </div>
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
              Submit Quiz
            </button>
          )}
        </SectionCard>
      ) : (
        <SectionCard>
          <h3 className="text-2xl font-bold text-[#592803]">Quiz Submitted</h3>
          <p className="mt-2 text-sm text-[#4B3A46]">
            You answered all questions for {topicName}.
          </p>
        </SectionCard>
      )}
    </div>
  );
}
