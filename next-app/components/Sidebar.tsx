import Image from "next/image";
import SidebarNavItem from "./SidebarNavItem";

type ActiveItem = "Dashboard" | "GoodStart AI" | "Settings";

type SidebarProps = {
  userName: string;
  activeItem: ActiveItem;
};

export default function Sidebar({ userName, activeItem }: SidebarProps) {
  return (
    <aside className="bg-[#d9d9d9] min-h-screen flex flex-col justify-between">

      {/* TOP SECTION */}
      <div className="p-8 flex flex-col items-center gap-6">

        <Image
          src="/sslogo.png"
          alt="Safari Smart"
          width={110}
          height={110}
          className="rounded-full"
          priority
        />

        <p className="font-bold text-lg tracking-wide">
          {userName.toUpperCase()}
        </p>

        <button className="w-full bg-black text-white py-3 text-sm font-semibold rounded-lg hover:opacity-90 transition">
          Manage Account
        </button>

        <div className="w-full space-y-5 pt-4">
          <SidebarNavItem
            label="Dashboard"
            active={activeItem === "Dashboard"}
          />
          <SidebarNavItem
            label="GoodStart AI"
            active={activeItem === "GoodStart AI"}
          />
          <SidebarNavItem
            label="Settings"
            active={activeItem === "Settings"}
          />
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="p-8">
        <button className="w-full border border-black/30 py-3 text-sm font-semibold rounded-lg hover:bg-black/5 transition">
          Log Out
        </button>
      </div>

    </aside>
  );
}