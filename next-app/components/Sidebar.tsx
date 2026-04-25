import Image from "next/image";
import Link from "next/link";
import SidebarNavItem from "./SidebarNavItem";

type ActiveItem =
  | "Dashboard"
  | "Grading"
  | "Classes"
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
  logoutAction,
  profile,
  role,
}: SidebarProps) {
  const isStudent = role === "Student";
  return (
    <aside className="sticky top-0 h-screen bg-[#6B3300] flex flex-col px-4 py-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/sslogo.png"
            alt="Safari Smart"
            width={96}
            height={96}
            className="rounded-full"
            priority
          />

          <div className="text-center">
            <p className="font-extrabold text-[1.9rem] leading-tight tracking-wide text-white">
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
            className={`w-full text-center py-2.5 text-sm font-semibold rounded-lg transition ${activeItem === "Manage Account"
              ? "bg-[#FFF1B8] text-[#592803] shadow-sm"
              : "bg-[#FFF1B8] text-[#592803] hover:opacity-90"
              }`}
          >
            Manage Account
          </Link>
        </div>

        <div className="pt-16 space-y-5">
          <SidebarNavItem
            label="Dashboard"
            href="/dashboard"
            active={activeItem === "Dashboard"}
          />
          {profile?.account_type === "Teacher" && (
            <SidebarNavItem
              label="Grading"
              href="/grade"
              active={activeItem === "Grading"}
            />
          )}
          <SidebarNavItem
            label="Classes"
            href="/class"
            active={activeItem === "Classes"}
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

      <div className="mt-auto pt-2">
        <form action={logoutAction}>
          <button className="w-full border border-white/30 text-white py-2.5 text-sm rounded-lg hover:bg-white/5 transition">
            Log Out
          </button>
        </form>
      </div>
    </aside>
  );
}