import Sidebar from "@/components/Sidebar";
import DashboardCard from "@/components/dashboardcard";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import AdminCategoriesClient from "@/components/Admin/AdminCategoriesClient";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getSubjects } from "@/utils/categories/util";

export default async function AdminDashboardCategoryPage({
  params,
}: {
  params: Promise<{ categoryID: string }>;
}) {
  const supabase = await createClient();
  const categoryID = (await params).categoryID;
  const categoryIdNumber = Number.parseInt(categoryID, 10);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user!.id)
    .single();

  if (profile?.account_type !== "Admin") {
    redirect("/dashboard");
  }

  const items = await getSubjects(
    Number.isFinite(categoryIdNumber) ? categoryIdNumber : null,
    profile,
    supabase,
  );

  const adminItems = items.map((item) => ({
    ...item,
    href: item.href.startsWith("/dashboard/")
      ? item.href.replace("/dashboard/", "/admin-dashboard/")
      : item.href,
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
            activeItem="Dashboard"
            logoutAction={logout}
          />
        </div>

        <div className="flex-1 px-10 py-10">
          <div className="max-w-6xl space-y-8">
            <PageHeader
              title="Admin Category"
              subtitle="Manage nested categories and content."
            />

            <SectionCard className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
                  Current Level
                </p>
                <h2 className="text-2xl font-bold text-[#592803]">
                  Category {categoryID}
                </h2>
                <p className="text-sm text-[#4B3A46]">
                  Create a child category for this level or open an existing
                  one.
                </p>
              </div>

              <div className="rounded-xl bg-[#FFF1B8] p-4 border border-[#4B3A46]/10 w-full md:w-45">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
                  Items
                </p>
                <p className="mt-2 text-2xl font-extrabold text-[#592803]">
                  {adminItems.length}
                </p>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#592803]">
                    Available Items
                  </h2>
                  <p className="text-sm text-[#4B3A46] mt-1">
                    Open a child category/topic or add a new child category
                    here.
                  </p>
                </div>
                <AdminCategoriesClient
                  parentId={
                    Number.isFinite(categoryIdNumber) ? categoryIdNumber : null
                  }
                  buttonLabel="+ Create Child Category"
                />
              </div>

              {adminItems.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-[#4B3A46]/20 p-12 text-center">
                  <p className="text-[#4B3A46] mb-4">
                    No items yet. Add a child category for this level.
                  </p>
                  <AdminCategoriesClient
                    parentId={
                      Number.isFinite(categoryIdNumber)
                        ? categoryIdNumber
                        : null
                    }
                    buttonLabel="+ Create Child Category"
                  />
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {adminItems.map((item) => (
                    <DashboardCard
                      key={item.title}
                      title={item.title}
                      href={item.href}
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
