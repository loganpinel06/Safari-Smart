import Link from "next/link";

type SidebarNavItemProps = {
  label: string;
  href: string;
  active?: boolean;
};

export default function SidebarNavItem({
  label,
  href,
  active = false,
}: SidebarNavItemProps) {
  const base =
    "block w-full rounded-xl px-4 py-3 text-sm sm:text-base font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#FFF1B8] focus:ring-offset-2 focus:ring-offset-[#6B3300]";

  const activeCls = "bg-[#FFF1B8] text-[#592803] shadow-sm";

  const inactiveCls = "bg-white/10 text-[#FFF1E5] hover:bg-white/20";

  return (
    <Link href={href} className={`${base} ${active ? activeCls : inactiveCls}`}>
      {label}
    </Link>
  );
}