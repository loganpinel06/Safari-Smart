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
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-12 gap-6">
        <div className="col-span-12 sm:col-span-3">
          <Sidebar userName="John Doe" activeItem="Dashboard" />
        </div>

        <section className="col-span-12 sm:col-span-9 space-y-4">
          <h1 className="font-bold">Dashboard</h1>

          <div className="grid sm:grid-cols-3 gap-4">
            {subjects.map((s) => (
              <DashboardCard key={s.title} title={s.title} href={s.href} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}