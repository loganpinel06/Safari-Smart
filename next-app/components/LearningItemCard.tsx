import Link from "next/link";
import StatusBadge from "./StatusBadge";

type LearningItemCardProps = {
  title: string;
  description: string;
  href: string;
  kind: "Lesson" | "Quiz" | "Exam";
  status: "Complete" | "In Progress" | "Not Started";
};

export default function LearningItemCard({
  title,
  description,
  href,
  kind,
  status,
}: LearningItemCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-4 sm:p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#592803]/30"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
            {kind}
          </p>
          <h3 className="mt-1 text-lg sm:text-xl font-bold text-[#592803]">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-[#4B3A46]">
            {description}
          </p>
        </div>

        <div className="self-start sm:self-auto">
          <StatusBadge status={status} />
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold text-[#592803]">
        Open →
      </p>
    </Link>
  );
}