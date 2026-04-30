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
    <aside className="bg-[#6B3300] text-white w-full lg:sticky lg:top-0 lg:h-screen lg:w-[320px] lg:shrink-0">
      <div className="flex flex-col px-4 py-4 sm:px-5 lg:h-full lg:px-4 lg:py-4">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/sslogo.png"
            alt="Safari Smart logo"
            width={88}
            height={88}
            className="rounded-full sm:h-24 sm:w-24"
            priority
          />

          <div className="text-center">
            <p className="font-extrabold text-[1.6rem] leading-tight tracking-wide text-white sm:text-[1.9rem]">
              {userName.toUpperCase()}
            </p>

            <p className="mt-1 text-sm text-white/80">
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
            className={`w-full rounded-lg py-2.5 text-center text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#FFF1B8] focus:ring-offset-2 focus:ring-offset-[#6B3300] ${
              activeItem === "Manage Account"
                ? "bg-[#FFF1B8] text-[#592803] shadow-sm"
                : "bg-[#FFF1B8] text-[#592803] hover:opacity-90"
            }`}
          >
            Manage Account
          </Link>
        </div>

        <nav
          aria-label="Sidebar navigation"
          className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-1 lg:gap-4"
        >
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
        </nav>

        <div className="mt-6 lg:mt-auto lg:pt-4">
          <form action={logoutAction}>
            <button
              className="w-full rounded-lg border border-white/30 py-2.5 text-sm transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/60"
              aria-label="Log out"
            >
              Log Out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}