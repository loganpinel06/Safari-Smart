import Image from "next/image";
import Link from "next/link";
import SidebarNavItem from "./SidebarNavItem";

type ActiveItem = "Dashboard" | "Manage Account" | "GoodStart AI" | "Settings";

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
  logoutAction,
}: SidebarProps) {
  return (
    <aside className="min-h-screen flex flex-col justify-between bg-[#592803] text-[#FFF1E5]">
      <div className="px-8 pt-10">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/sslogo.png"
            alt="Safari Smart"
            width={110}
            height={110}
            className="rounded-full border-4 border-white/10 shadow-md"
            priority
          />

          <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight">
            {userName.toUpperCase()}
          </h2>

          <div className="mt-3 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-[#FFF1E5]/90">
            Exam Track: <span className="font-semibold">{examTrack}</span>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/manage-account"
            className="block w-full rounded-xl bg-[#FFF1B8] px-4 py-3 text-center text-sm font-semibold text-[#592803] shadow-sm transition hover:bg-[#f7e89b]"
          >
            Manage Account
          </Link>
        </div>

        <div className="mt-10 space-y-4">
          <SidebarNavItem
            label="Dashboard"
            href="/dashboard"
            active={activeItem === "Dashboard"}
          />
          <SidebarNavItem
            label="GoodStart AI"
            href="/goodstart"
            active={activeItem === "GoodStart AI"}
          />
          <SidebarNavItem
            label="Settings"
            href="/settings"
            active={activeItem === "Settings"}
          />
        </div>
      </div>

      <div className="px-8 pb-10">
        <form action={logoutAction}>
          <button className="w-full rounded-xl border border-[#FFF1E5]/30 px-4 py-3 text-sm font-semibold text-[#FFF1E5] transition hover:bg-white/10">
            Log Out
          </button>
        </form>
      </div>
    </aside>
  );
}