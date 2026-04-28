import Link from "next/link";

type DashboardCardProps = {
  title: string;
  subtitle?: string;
  href?: string;
  //locked?: boolean;
};

export default function DashboardCard({
  title,
  subtitle,
  href,
  //locked,
}: DashboardCardProps) {
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
  //if (locked) return <Link href="/locked">{card}</Link>;
  return href ? <Link href={href}>{card}</Link> : card;
}
