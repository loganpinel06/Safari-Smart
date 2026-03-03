import Image from "next/image";
import SidebarNavItem from "./SidebarNavItem";

type ActiveItem = "Dashboard" | "GoodStart AI" | "Settings";

type SidebarProps = {
  userName: string;
  activeItem: ActiveItem;
};

export default function Sidebar({ userName, activeItem }: SidebarProps) {
  return (
    <aside className="bg-[#d9d9d9] rounded-xl overflow-hidden min-h-screen">      <div className="p-6 flex flex-col items-center gap-3">
        <Image
          src="/sslogo.png"
          alt="Safari Smart"
          width={56}
          height={56}
          className="rounded-full"
          priority
        />
        <p className="font-bold">{userName.toUpperCase()}</p>
      </div>

      <div className="px-4 pb-4">
        <button className="w-full bg-black text-white py-2 text-sm font-semibold rounded">
          Manage Account
        </button>
      </div>

      <div className="px-4 space-y-3 pb-6">
        <SidebarNavItem label="Dashboard" active={activeItem === "Dashboard"} />
        <SidebarNavItem label="GoodStart AI" active={activeItem === "GoodStart AI"} />
        <SidebarNavItem label="Settings" active={activeItem === "Settings"} />
      </div>

      <div className="px-4 pb-6">
        <button className="w-full border border-black/30 py-2 text-sm rounded hover:bg-black/5">
          Log Out
        </button>
      </div>
    </aside>
  );
}