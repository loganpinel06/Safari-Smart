type QuizChoiceButtonProps = {
  label: string;
};

export default function QuizChoiceButton({ label }: QuizChoiceButtonProps) {
  return (
    <button
      type="button"
      className="w-full rounded-xl border border-[#4B3A46]/10 bg-white/70 px-4 py-3 text-left font-medium text-[#592803] transition hover:bg-[#FFF6CC]"
    >
      {label}
    </button>
  );
}