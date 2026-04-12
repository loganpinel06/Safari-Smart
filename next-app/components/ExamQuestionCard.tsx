type ExamQuestionCardProps = {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  questionType: string;
};

export default function ExamQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  questionType,
}: ExamQuestionCardProps) {
  return (
    <div className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
          Question {questionNumber} of {totalQuestions}
        </p>

        <span className="rounded-full border border-[#4B3A46]/10 bg-[#FFF1B8] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#592803]">
          {questionType}
        </span>
      </div>

      <h2 className="mt-4 text-2xl font-bold text-[#592803]">
        {question}
      </h2>
    </div>
  );
}