import Link from "next/link";

type ClassCardProps = {
  id: string;
  name: string;
};

export default function ClassCard({ id, name }: ClassCardProps) {
  return (
    <Link
      href={`/class/${id}`}
      className="block rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#592803]/30 hover:bg-white hover:shadow-md"
    >
      <h3 className="text-xl font-bold text-[#592803]">{name}</h3>
      <p className="mt-3 text-sm font-semibold text-[#4B3A46]">Assignments</p>
    </Link>
  );
}
