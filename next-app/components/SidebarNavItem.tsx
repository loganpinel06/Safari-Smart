type SidebarNavItemProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export default function SidebarNavItem({
  label,
  active = false,
  onClick,
}: SidebarNavItemProps) {
  const base =
    "w-full py-3 text-sm font-semibold rounded-lg transition";

  const activeCls = "bg-[#6AC700] text-white";
  const inactiveCls =
    "bg-black text-white hover:opacity-90";

  return (
    <button
      type="button"
      className={`${base} ${active ? activeCls : inactiveCls}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}