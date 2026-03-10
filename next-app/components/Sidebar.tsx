import Image from "next/image";
import SidebarNavItem from "./SidebarNavItem";

type ActiveItem = "Dashboard" | "GoodStart AI" | "Settings";

type SidebarProps = {
  userName: string;
  activeItem: ActiveItem;
  examTrack?: string;
  logoutAction: () => Promise<void>;
};

export default function Sidebar({
  userName,
  activeItem,
  examTrack,
  logoutAction
}: SidebarProps) {
  return (
    <aside className="bg-[#d9d9d9] min-h-screen flex flex-col justify-between">

      {/* top */}
      <div className="px-8 pt-10 flex flex-col items-center gap-4">
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

      {/* middle nav */}
      <div className="px-4 space-y-6">
        <SidebarNavItem label="Dashboard" active={activeItem === "Dashboard"} />
        <SidebarNavItem label="GoodStart AI" active={activeItem === "GoodStart AI"} />
        <SidebarNavItem label="Settings" active={activeItem === "Settings"} />
      </div>

      {/* logout */}
      <div className="px-8 pb-10">
        <form action={logoutAction}>
          <button className="w-full border border-black/30 py-3 text-sm rounded hover:bg-black/5">
            Log Out
          </button>
        </form>
      </div>

    </aside>
  );
}