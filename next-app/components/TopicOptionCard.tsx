import Link from "next/link";

type TopicOptionCardProps = {
  title: string;
  description: string;
  href: string;
  accent?: "green" | "yellow" | "orange";
};

export default function TopicOptionCard({
  title,
  description,
  href,
  accent = "green",
}: TopicOptionCardProps) {
  const accentMap = {
    green: "bg-[#EAF7D7] text-[#4F6B1B] border-[#C9E39B]",
    yellow: "bg-[#FFF6CC] text-[#7A5E00] border-[#E7D37A]",
    orange: "bg-[#FFE3CC] text-[#8A4B14] border-[#E2AE7A]",
  };

  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div
        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${accentMap[accent]}`}
      >
        {title}
      </div>

      <p className="mt-4 text-sm leading-6 text-[#4B3A46]">
        {description}
      </p>

      <p className="mt-6 text-sm font-semibold text-[#592803] opacity-0 transition group-hover:opacity-100">
        Open →
      </p>
    </Link>
  );
}