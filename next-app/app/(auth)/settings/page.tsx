import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();

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

  return (
    <main className="min-h-screen bg-[#FFF1E5] text-[#592803]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar
          userName={profile?.name ?? "John Doe"}
          examTrack={profile?.exam_type ?? "BECE"}
          role={profile?.account_type ?? "Student"}
          activeItem="Settings"
          logoutAction={logout}
          profile={profile}
        />

        <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-5xl space-y-6 lg:space-y-8">
            <PageHeader
              title="Settings"
              subtitle="Control preferences and account options."
            />

            <SectionCard>
              <h2 className="mb-4 text-2xl font-bold text-[#592803]">
                Notifications
              </h2>
              <p className="text-[#4B3A46]">
                Notification preferences coming soon.
              </p>
            </SectionCard>

            <SectionCard>
              <h2 className="mb-4 text-2xl font-bold text-[#592803]">
                Account Settings
              </h2>
              <p className="text-[#4B3A46]">
                Password updates and account settings will be added here.
              </p>
            </SectionCard>

            <SectionCard>
              <h2 className="mb-4 text-2xl font-bold text-[#592803]">
                Accessibility Preferences
              </h2>
              <p className="text-[#4B3A46]">
                Adjust font size, contrast, and accessibility options.
              </p>
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}