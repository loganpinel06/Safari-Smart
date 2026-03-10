import Link from "next/link";

type DashboardCardProps = {
  title: string;
  subtitle?: string;
  href?: string;
};

export default function DashboardCard({ title, subtitle, href }: DashboardCardProps) {
  const card = (
    <div className="bg-black rounded-xl h-28 flex flex-col justify-end p-4 hover:opacity-90 transition">
      <p className="text-white font-bold">{title}</p>
      {subtitle && <p className="text-white/70 text-xs mt-1">{subtitle}</p>}
    </div>
  );

  return href ? <Link href={href}>{card}</Link> : card;
}