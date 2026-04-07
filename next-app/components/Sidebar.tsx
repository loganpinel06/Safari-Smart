import Image from "next/image";
import Link from "next/link";
import SidebarNavItem from "./SidebarNavItem";

type ActiveItem =
  | "Dashboard"
  | "Manage Account"
  | "GoodStart AI"
  | "Settings"
  | "Admin Dashboard";

type Profile = {
  id: string;
  name: string;
  exam_type: string;
  account_type: string;
};

type SidebarProps = {
  userName: string;
  activeItem: ActiveItem;
  examTrack?: string;
  role?: string;
  logoutAction: () => Promise<void>;
  profile: Profile;
};

export default function Sidebar({
  userName,
  activeItem,
  examTrack,
  role = "Student",
  logoutAction,
  profile,
}: SidebarProps) {
  const isStudent = role === "Student";

  return (
    <aside className="bg-[#6B3300] min-h-screen h-full flex flex-col justify-between px-6 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/sslogo.png"
            alt="Safari Smart"
            width={140}
            height={140}
            className="rounded-full"
            priority
          />

          <div className="text-center">
            <p className="font-extrabold text-2xl tracking-wide text-white">
              {userName.toUpperCase()}
            </p>

            <p className="text-sm text-white/80 mt-1">
              {isStudent ? (
                <>
                  Exam Track: <span className="font-semibold">{examTrack}</span>
                </>
              ) : (
                <>
                  Role: <span className="font-semibold">{role}</span>
                </>
              )}
            </p>
          </div>

          <Link
            href="/manageaccount"
            className={`w-full text-center py-3 text-sm font-semibold rounded-lg transition ${
              activeItem === "Manage Account"
                ? "bg-[#FFF1B8] text-[#592803] shadow-sm"
                : "bg-[#FFF1B8] text-[#592803] hover:opacity-90"
            }`}
          >
            Manage Account
          </Link>
        </div>

        <div className="space-y-4">
          <SidebarNavItem
            label="Dashboard"
            href="/dashboard"
            active={activeItem === "Dashboard"}
          />
          {profile?.account_type === "Admin" && (
            <SidebarNavItem
              label="Admin Dashboard"
              href="/admin-dashboard"
              active={activeItem === "Admin Dashboard"}
            />
          )}
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

      <div>
        <form action={logoutAction}>
          <button className="w-full border border-white/30 text-white py-3 text-sm rounded-lg hover:bg-white/5 transition">
            Log Out
          </button>
        </form>
      </div>
    </aside>
  );
}