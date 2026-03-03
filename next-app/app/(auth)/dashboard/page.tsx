import Sidebar from "@/components/Sidebar";
import DashboardCard from "@/components/DashboardCard";

export default function DashboardPage() {
  const subjects = [
    { title: "ENGLISH", href: "/dashboard/category/english" },
    { title: "SCIENCE", href: "/dashboard/category/science" },
    { title: "MATHEMATICS", href: "/dashboard/category/mathematics" },
  ];

  return (
  <main className="min-h-screen bg-[#FFF1E5] text-[#592803]">
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div className="w-1/4 min-w-[280px] bg-[#d9d9d9] p-6">
        <Sidebar userName="John Doe" activeItem="Dashboard" />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-12 py-10 space-y-10">

        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        {/* Subjects Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold">Your Subjects</h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {subjects.map((s) => (
              <DashboardCard
                key={s.title}
                title={s.title}
                href={s.href}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  </main>
);
}