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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];
  const selectedChoiceIndex = selectedAnswers[currentQuestion.id];

  const score = submitted
    ? questions.filter((q) => selectedAnswers[q.id] === q.choices.findIndex((c) => c.correct)).length
    : 0;

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  function handleSelect(choiceIndex: number) {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: choiceIndex }));
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) setCurrentIndex((prev) => prev + 1);
  }

  function handlePrevious() {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  }

  function handleReset() {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmitted(false);
  }

  const allAnswered = Object.keys(selectedAnswers).length === questions.length;
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <SectionCard>
        <div className="space-y-6 text-center py-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">Practice Mode</p>
            <h2 className="mt-3 text-3xl font-bold text-[#592803]">{topicName} Quiz</h2>
          </div>

          <div className="flex justify-center gap-8 rounded-2xl bg-[#FFF1B8] py-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#592803]">{questions.length}</p>
              <p className="text-xs font-semibold text-[#4B3A46]">Questions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#592803]">4</p>
              <p className="text-xs font-semibold text-[#4B3A46]">Choices each</p>
            </div>
          </div>

          <p className="text-sm text-[#4B3A46]">
            Answer all questions and submit when you're ready. You can navigate freely between questions.
          </p>

          <button
            type="button"
            onClick={() => setStarted(true)}
            className="w-full rounded-xl bg-[#592803] px-5 py-4 font-semibold text-[#FFF1E5] transition hover:opacity-90"
          >
            Start Quiz 🚀
          </button>
        </div>
      </SectionCard>
    );
  }

  // ── Results screen ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="space-y-6">
        <SectionCard>
          <h2 className="text-2xl font-bold text-[#592803]">Quiz Complete! 🎉</h2>
          <p className="mt-1 text-sm text-[#4B3A46]">{topicName}</p>

          <div className="mt-6 flex items-center justify-center rounded-2xl bg-[#FFF1B8] py-8">
            <div className="text-center">
              <p className="text-6xl font-bold text-[#592803]">{score}/{questions.length}</p>
              <p className="mt-2 text-sm font-semibold text-[#4B3A46]">
                {score === questions.length
                  ? "Perfect score! Excellent work! 🌟"
                  : score >= questions.length / 2
                    ? "Good effort! Keep practising! 💪"
                    : "Keep going — you'll get there! 📚"}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Per-question review */}
        <div className="space-y-4">
          {questions.map((q, i) => {
            const chosen = selectedAnswers[q.id];
            const isCorrect = chosen === q.choices.findIndex((c) => c.correct);
            return (
              <SectionCard key={q.id}>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                  Question {i + 1}
                </p>
                <p className="mt-1 font-semibold text-[#592803]">{q.question}</p>
                <div className="mt-3 space-y-2">
                  {q.choices.map((choice, idx) => {
                    let bg = "bg-white border border-[#4B3A46]/20";
                    if (idx === q.choices.findIndex((c) => c.correct)) bg = "bg-green-100 border border-green-400 text-green-800";
                    else if (idx === chosen && !isCorrect) bg = "bg-red-100 border border-red-400 text-red-800";
                    return (
                      <div key={choice.name} className={`rounded-xl px-4 py-3 text-sm font-medium ${bg}`}>
                        {choice.name}
                        {idx === q.choices.findIndex((c) => c.correct) && " ✓"}
                        {idx === chosen && !isCorrect && " ✗"}
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="w-full rounded-xl bg-[#592803] px-5 py-4 font-semibold text-[#FFF1E5] transition hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ── Quiz screen ─────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Progress bar */}
      <div>
        <div className="mb-1 flex justify-between text-xs font-semibold text-[#4B3A46]">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-[#4B3A46]/20">
          <div
            className="h-2 rounded-full bg-[#592803] transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question dot navigator */}
      <div className="flex flex-wrap justify-center gap-2">
        {questions.map((q, i) => {
          const isAnswered = selectedAnswers[q.id] !== undefined;
          const isCurrent = i === currentIndex;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`cursor-pointer h-9 w-9 rounded-full text-xs font-bold transition-all
                ${isCurrent
                  ? "bg-[#592803] text-[#FFF1E5] scale-110"
                  : isAnswered
                    ? "bg-[#FFF1B8] text-[#592803] border border-[#592803]"
                    : "bg-white text-[#4B3A46] border border-[#4B3A46]/30"
                }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <SectionCard>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
              Question {currentIndex + 1}
            </p>
            <h2 className="mt-3 text-2xl font-bold text-[#592803]">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="grid gap-4">
            {currentQuestion.choices.map((choice, index) => (
              <QuizChoiceButton
                key={choice.name}
                label={choice.name}
                selected={selectedChoiceIndex === index}
                onClick={() => handleSelect(index)}
                disabled={submitted}
              />
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Unanswered warning */}
      {currentIndex === questions.length - 1 && !allAnswered && (
        <p className="text-center text-sm font-semibold text-red-500">
          ⚠️ You have {questions.length - Object.keys(selectedAnswers).length} unanswered question(s) — use the circles above to go back!
        </p>
      )}

      <SectionCard className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="cursor-pointer rounded-xl border border-[#4B3A46]/20 px-5 py-3 font-semibold text-[#592803] transition hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={selectedChoiceIndex === undefined}
            className="cursor-pointer rounded-xl bg-[#FFF1B8] px-5 py-3 font-semibold text-[#592803] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next Question →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={!allAnswered}
            className="cursor-pointer rounded-xl bg-[#592803] px-5 py-3 font-semibold text-[#FFF1E5] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit Quiz
          </button>
        )}
      </SectionCard>
    </div>
  );
}