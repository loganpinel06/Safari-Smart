import Image from "next/image";
import SidebarNavItem from "./SidebarNavItem";

type ActiveItem = "Dashboard" | "GoodStart AI" | "Settings";

type SidebarProps = {
  userName: string;
  activeItem: ActiveItem;
  examTrack?: string;
};

export default function Sidebar({
  userName,
  activeItem,
  examTrack = "BECE",
}: SidebarProps) {
  return (
    <aside className="bg-[#d9d9d9] min-h-screen flex flex-col">

    {/* PROFILE + MANAGE ACCOUNT */}
    <div className="px-8 pt-10 pb-6 flex flex-col items-center gap-4">
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

        <button className="w-full bg-black text-white py-3 text-sm font-semibold rounded-lg hover:opacity-90 transition mt-4">
        Manage Account
        </button>
    </div>


    {/* NAV BUTTONS (THIS IS THE KEY CHANGE) */}
    <div className="flex-1 flex flex-col justify-center px-8 space-y-6">
        <SidebarNavItem label="Dashboard" active={activeItem === "Dashboard"} />
        <SidebarNavItem label="GoodStart AI" active={activeItem === "GoodStart AI"} />
        <SidebarNavItem label="Settings" active={activeItem === "Settings"} />
    </div>


    {/* LOG OUT */}
    <div className="px-8 pb-12">
        <button className="w-full border border-black/30 py-3 text-sm font-semibold rounded-lg hover:bg-black/5 transition">
        Log Out
        </button>
    </div>

    </aside>
  );
}