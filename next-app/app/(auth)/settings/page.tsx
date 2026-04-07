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
      <div className="flex min-h-screen">
        <div className="w-[320px] border-r border-[#4B3A46]/10">
          <Sidebar
            userName={profile?.name ?? "John Doe"}
            examTrack={profile?.exam_type ?? "BECE"}
            role={profile?.account_type ?? "Student"}
            activeItem="Settings"
            logoutAction={logout}
          />
        </div>

        <div className="flex-1 px-10 py-10">
          <div className="max-w-5xl space-y-8">
            <PageHeader
              title="Settings"
              subtitle="Control preferences and account options."
            />

            <SectionCard>
              <h2 className="text-2xl font-bold text-[#592803] mb-4">
                Notifications
              </h2>
              <p className="text-[#4B3A46]">
                Notification preferences coming soon.
              </p>
            </SectionCard>

            <SectionCard>
              <h2 className="text-2xl font-bold text-[#592803] mb-4">
                Account Settings
              </h2>
              <p className="text-[#4B3A46]">
                Password updates and account settings will be added here.
              </p>
            </SectionCard>

            <SectionCard>
              <h2 className="text-2xl font-bold text-[#592803] mb-4">
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