import Link from "next/link";

type ClassCardProps = {
  id: string;
  name: string;
};

export default function ClassCard({ id, name }: ClassCardProps) {
  return (
    <Link
      href={`/class/${id}`}
      className="block rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-4 sm:p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#592803]/30 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#592803]/30"
    >
      <h3 className="text-lg sm:text-xl font-bold text-[#592803]">
        {name}
      </h3>
      <p className="mt-2 text-sm font-semibold text-[#4B3A46]">
        View assignments →
      </p>
    </Link>
  );
}