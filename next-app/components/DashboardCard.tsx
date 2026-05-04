import Link from "next/link";

type DashboardCardProps = {
  title: string;
  subtitle?: string;
  href?: string;
  locked?: boolean;
  onLockedClick?: () => void;
};

export default function DashboardCard({
  title,
  subtitle,
  href,
  locked,
  onLockedClick,
}: DashboardCardProps) {
  if (locked) {
    return (
      <button
        onClick={onLockedClick}
        className="group min-h-[140px] w-full text-left rounded-2xl bg-[#2E1501]/40 p-5 flex flex-col justify-end border border-[#4B3A46]/10 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus:outline-none"
      >
        <p className="text-[#592803] text-2xl font-bold tracking-tight">{title}</p>
        <p className="text-[#FFF1B8] text-sm font-medium mt-4 opacity-0 transition group-hover:opacity-100">
          Subscribe to Access →
        </p>
      </button>
    );
  }
  const card = (
    <div className="group min-h-[140px] rounded-2xl bg-[#592803] p-5 flex flex-col justify-end border border-[#4B3A46]/10 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <p className="text-white text-2xl font-bold tracking-tight">
        {title}
      </p>
      {subtitle && (
        <p className="text-white/75 text-sm mt-2">
          {subtitle}
        </p>
      )}
      <p className="text-[#FFF1B8] text-sm font-medium mt-4 opacity-0 transition group-hover:opacity-100">
        Open subject →
      </p>
    </div>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}
