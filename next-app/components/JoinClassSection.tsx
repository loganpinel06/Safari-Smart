type JoinClassSectionProps = {
  helperText?: string;
};

export default function JoinClassSection({
  helperText = "Enter a class code from your teacher to join a class.",
}: JoinClassSectionProps) {
  return (
    <div className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-[#592803]">Join a Class</h2>
        <p className="mt-1 text-sm text-[#4B3A46]">{helperText}</p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          placeholder="Enter class code"
          className="flex-1 rounded-xl border border-[#4B3A46]/15 bg-white px-4 py-3 text-[#592803] outline-none focus:border-[#592803]"
        />

        <button className="rounded-xl bg-[#FFF1B8] px-5 py-3 font-semibold text-[#592803] transition hover:opacity-90">
          Join Class
        </button>
      </div>
    </div>
  );
}