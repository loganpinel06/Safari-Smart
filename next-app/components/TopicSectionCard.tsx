import Link from "next/link";

type TopicSectionCardProps = {
  title: string;
  description: string;
  href?: string;
  accent?: "green" | "yellow" | "orange";
};

export default function TopicSectionCard({
  title,
  description,
  href,
  accent = "green",
}: TopicSectionCardProps) {
  const accentStyles = {
    green: "bg-[#E8F6D8] border-[#B7D78A] text-[#4D6B1F]",
    yellow: "bg-[#FFF6CC] border-[#E7D37A] text-[#7A5E00]",
    orange: "bg-[#FFE3CC] border-[#E2AE7A] text-[#8A4B14]",
  };

  const card = (
    <div className="group rounded-2xl bg-white/70 border border-[#4B3A46]/10 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div
        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${accentStyles[accent]}`}
      >
        {title}
      </div>

      <p className="mt-4 text-sm leading-6 text-[#4B3A46]">
        {description}
      </p>

      <p className="mt-6 text-sm font-semibold text-[#592803] opacity-0 transition group-hover:opacity-100">
        Open →
      </p>
    </div>
  );

  return href ? <Link href={href}>{card}</Link> : card;
}