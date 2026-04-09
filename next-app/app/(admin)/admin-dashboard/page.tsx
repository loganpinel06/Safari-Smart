import Sidebar from "@/components/Sidebar";
import DashboardCard from "@/components/DashboardCard";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import AdminCategoriesClient from "@/components/Admin/AdminCategoriesClient";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getSubjects } from "@/utils/categories/util";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { subjects } = await getSubjects(null, profile, supabase);
  const adminCategories = subjects.map((subject) => ({
    ...subject,
    href: subject.href.startsWith("/dashboard/")
      ? subject.href.replace("/dashboard/", "/admin-dashboard/")
      : subject.href,
  }));

  async function logout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/signin");
  }

  return (
    <main className="min-h-screen bg-[#FFF1E5] text-[#592803]">
      <div className="flex min-h-screen">
        <div className="w-[320px]">
          <Sidebar
            userName={profile?.name ?? "Admin"}
            examTrack={profile?.exam_type ?? "BECE"}
            activeItem="Admin Dashboard"
            logoutAction={logout}
            profile={profile}
          />
        </div>

        <div className="flex-1 px-10 py-10">
          <div className="max-w-6xl space-y-8">
            <PageHeader
              title="Admin Dashboard"
              subtitle={`Account Type: ${profile?.account_type ?? "Admin"}`}
            />

            <SectionCard className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
                  Welcome back
                </p>
                <h2 className="text-2xl font-bold text-[#592803]">
                  {profile?.name ?? "Admin"}
                </h2>
                <p className="text-sm text-[#4B3A46]">
                  Manage categories and learning content across the platform.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:w-[320px]">
                <div className="rounded-xl bg-[#FFF1B8] p-4 border border-[#4B3A46]/10">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                    Categories
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-[#592803]">
                    {adminCategories.length}
                  </p>
                </div>

                <div className="rounded-xl bg-white/80 p-4 border border-[#4B3A46]/10">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                    Role
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-[#592803]">
                    {profile?.account_type ?? "Admin"}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#592803]">
                    Categories
                  </h2>
                  <p className="text-sm text-[#4B3A46] mt-1">
                    Manage existing categories or create new ones.
                  </p>
                </div>
                <AdminCategoriesClient buttonLabel="+ Create Root Category" />
              </div>

              {adminCategories.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-[#4B3A46]/20 p-12 text-center">
                  <p className="text-[#4B3A46] mb-4">
                    No categories yet. Create one to get started!
                  </p>
                  <AdminCategoriesClient buttonLabel="+ Create Root Category" />
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {adminCategories.map((category) => (
                    <DashboardCard
                      key={category.title}
                      title={category.title}
                      href={category.href}
                    />
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}
