import Image from "next/image";
import SidebarNavItem from "./SidebarNavItem";

type ActiveItem = "Dashboard" | "GoodStart AI" | "Settings";

type SidebarProps = {
  userName: string;
  activeItem: ActiveItem;
  examTrack?: string; // "BECE" or "WASSCE"
};

export default function Sidebar({ userName, activeItem, examTrack = "BECE" }: SidebarProps) {
  return (
    <aside className="bg-[#d9d9d9] min-h-screen flex flex-col justify-between">

      {/* TOP SECTION */}
      <div className="px-8 pt-10 pb-8 flex flex-col items-center gap-4">
    <Image
        src="/sslogo.png"
        alt="Safari Smart"
        width={140}
        height={140}
        className="rounded-full"
        priority
    />

    <div className="text-center">
        <p className="font-extrabold text-2xl tracking-wide">
        {userName.toUpperCase()}
        </p>
        <p className="text-sm text-black/60 mt-1">
        Exam Track: <span className="font-semibold">{examTrack}</span>
        </p>
    </div>

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