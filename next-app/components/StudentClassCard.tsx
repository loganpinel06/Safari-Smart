type StudentClassCardProps = {
  name: string;
  code: string;
  teacherName?: string;
};

export default function StudentClassCard({
  name,
  code,
  teacherName,
}: StudentClassCardProps) {
  return (
    <div className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-5 shadow-sm">
      <h3 className="text-xl font-bold text-[#592803]">{name}</h3>
      <p className="mt-2 text-sm text-[#4B3A46]">Class Code: {code}</p>
      {teacherName && (
        <p className="mt-1 text-sm text-[#4B3A46]">Teacher: {teacherName}</p>
      )}
      <button className="mt-4 rounded-xl border border-[#4B3A46]/20 px-4 py-2 text-sm font-semibold text-[#592803] transition hover:bg-white/40">
        Leave Class
      </button>
    </div>
  );
}