type TeacherClassCardProps = {
  name: string;
  code: string;
  studentCount: number;
};

export default function TeacherClassCard({
  name,
  code,
  studentCount,
}: TeacherClassCardProps) {
  return (
    <div className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-5 shadow-sm">
      <h3 className="text-xl font-bold text-[#592803]">{name}</h3>
      <p className="mt-2 text-sm text-[#4B3A46]">Class Code: {code}</p>
      <p className="mt-1 text-sm text-[#4B3A46]">
        {studentCount} students enrolled
      </p>
    </div>
  );
}