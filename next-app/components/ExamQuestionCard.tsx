type ExamQuestionCardProps = {
  question: string;
};

export default function ExamQuestionCard({ question }: ExamQuestionCardProps) {
  return (
    <div className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
        Exam Question
      </p>

      <h2 className="mt-3 text-2xl font-bold text-[#592803]">
        {question}
      </h2>
    </div>
  );
}