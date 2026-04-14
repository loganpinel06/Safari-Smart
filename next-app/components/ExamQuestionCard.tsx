type ExamQuestionCardProps = {
  question: string;
  questionNumber: number;
};

export default function ExamQuestionCard({
  question,
  questionNumber,
}: ExamQuestionCardProps) {
  return (
    <div className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
        Question {questionNumber}
      </p>

      <h2 className="mt-4 text-2xl font-bold text-[#592803]">
        {question}
      </h2>
    </div>
  );
}