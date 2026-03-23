import Sidebar from "@/components/Sidebar";
import DashboardCard from "@/components/dashboardcard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ categoryID: string }>;
}) {
  const supabase = await createClient();
  const categoryID = (await params).categoryID;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  async function logout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/signin");
  }

  const categoryRes = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/category?parent_id=${categoryID}`,
    {
      headers: {
        Cookie: (await cookies()).toString(),
      },
    },
  );

  if (!categoryRes.ok) {
    throw new Error(`API request failed: ${categoryRes.status}`);
  }

  const { categories, isCategory } = await categoryRes.json();

  const subjects = [];
  for (const category of categories) {
    subjects.push({
      title: category.name,
      href: isCategory ? "/dashboard/" + category.id : "/topic/" + category.id,
    });
  }

  return (
    <main className="min-h-screen bg-[#FFF1E5] text-[#592803]">
      <div className="flex min-h-screen">
        <div className="w-1/4 min-w-70 bg-[#d9d9d9] p-6">
          <Sidebar
            userName={profile?.name ?? "John Doe"}
            examTrack={profile?.exam_type ?? "BECE"}
            activeItem="Dashboard"
            logoutAction={logout}
          />
        </div>

        <div className="flex-1 px-12 py-10 space-y-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-sm text-[#4B3A46] mt-2">
                Account Type: {profile?.account_type ?? "Student"}
              </p>
            </div>
          </div>

          <section className="space-y-6">
            <h2 className="text-xl font-bold">Your Subjects</h2>

            <div className="grid sm:grid-cols-3 gap-6">
              {subjects.map((s) => (
                <DashboardCard key={s.title} title={s.title} href={s.href} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
