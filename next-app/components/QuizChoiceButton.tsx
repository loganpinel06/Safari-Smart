type QuizChoiceButtonProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

export default function QuizChoiceButton({
  label,
  selected = false,
  onClick,
  disabled = false,
}: QuizChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl border px-4 py-3 text-left font-medium transition ${
        selected
          ? "border-[#592803] bg-[#FFF1B8] text-[#592803]"
          : "border-[#4B3A46]/10 bg-white/70 text-[#592803] hover:bg-[#FFF6CC]"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      {label}
    </button>
  );
}