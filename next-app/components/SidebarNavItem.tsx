import Link from "next/link";

type SidebarNavItemProps = {
  label: string;
  active?: boolean;
  href?: string;
};

export default function SidebarNavItem({
  label,
  active = false,
  href,
}: SidebarNavItemProps) {
  const className = [
    "block w-full py-2 text-sm font-semibold rounded text-center",
    active ? "bg-[#6AC700] text-white" : "bg-black text-white hover:opacity-90",
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      {label}
    </button>
  );
}