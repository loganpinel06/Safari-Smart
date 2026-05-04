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
              subtitle="Review your app preferences, account role, and accessibility options."
            />

            <SectionCard>
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
                  Account Preferences
                </p>
                <h2 className="text-2xl font-bold text-[#592803]">
                  Learning Setup
                </h2>
                <p className="text-sm text-[#4B3A46]">
                  Your current role is{" "}
                  <span className="font-semibold text-[#592803]">
                    {profile?.account_type ?? "Student"}
                  </span>
                  {profile?.account_type === "Student" && (
                    <>
                      {" "}
                      and your exam track is{" "}
                      <span className="font-semibold text-[#592803]">
                        {profile?.exam_type ?? "BECE"}
                      </span>
                      .
                    </>
                  )}
                </p>
              </div>
            </SectionCard>

            <div className="grid gap-5 md:grid-cols-2">
              <SectionCard>
                <h2 className="mb-3 text-xl font-bold text-[#592803]">
                  Notifications
                </h2>
                <p className="text-sm leading-6 text-[#4B3A46]">
                  Class updates, new assignments, quiz reminders, and teacher
                  feedback will appear here once notifications are enabled.
                </p>
              </SectionCard>

              <SectionCard>
                <h2 className="mb-3 text-xl font-bold text-[#592803]">
                  Security
                </h2>
                <p className="text-sm leading-6 text-[#4B3A46]">
                  Password and sign-in settings are managed through your account.
                  Always sign out when using a shared device.
                </p>
              </SectionCard>

              <SectionCard>
                <h2 className="mb-3 text-xl font-bold text-[#592803]">
                  Accessibility
                </h2>
                <p className="text-sm leading-6 text-[#4B3A46]">
                  Safari Smart is designed with readable spacing, keyboard focus
                  states, responsive layouts, and clear navigation to support
                  different users and devices.
                </p>
              </SectionCard>

              <SectionCard>
                <h2 className="mb-3 text-xl font-bold text-[#592803]">
                  Display
                </h2>
                <p className="text-sm leading-6 text-[#4B3A46]">
                  Pages automatically adjust for mobile, tablet, and desktop
                  screens so students can study from different devices.
                </p>
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}