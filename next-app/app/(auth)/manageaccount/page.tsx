import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import JoinClassSection from "@/components/JoinClassSection";
import StudentClassCard from "@/components/StudentClassCard";
import TeacherClassCard from "@/components/TeacherClassCard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ManageAccountPage() {
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

  const isTeacher = profile?.account_type === "Teacher";
  const isParent = profile?.account_type === "Parent";

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
            activeItem="Manage Account"
            logoutAction={logout}
          />
        </div>

        <div className="flex-1 px-10 py-10">
          <div className="max-w-5xl space-y-8">
            <PageHeader
              title="Manage Account"
              subtitle="View and update your account information."
            />

            {/* PROFILE */}
            <SectionCard>
              <div className="space-y-4">
                <p><span className="font-semibold">Name:</span> {profile?.name ?? "N/A"}</p>
                <p><span className="font-semibold">Exam Track:</span> {profile?.exam_type ?? "N/A"}</p>
                <p><span className="font-semibold">Account Type:</span> {profile?.account_type ?? "N/A"}</p>
              </div>
            </SectionCard>

            {/* STUDENT */}
            {!isTeacher && !isParent && (
              <>
                <JoinClassSection />

                <SectionCard>
                  <h2 className="text-2xl font-bold text-[#592803] mb-4">
                    Your Classes
                  </h2>

                  <div className="grid gap-5 md:grid-cols-2">
                    <StudentClassCard
                      name="BECE English A"
                      code="ENG231"
                      teacherName="Mrs. Mensah"
                    />
                  </div>
                </SectionCard>
              </>
            )}

            {/* TEACHER */}
            {isTeacher && (
              <>
                <SectionCard>
                  <h2 className="text-2xl font-bold text-[#592803] mb-4">
                    Create Class
                  </h2>

                  <input
                    type="text"
                    placeholder="Class name"
                    className="w-full rounded-xl border px-4 py-3 mb-3"
                  />

                  <button className="w-full bg-[#FFF1B8] py-3 rounded-xl font-semibold">
                    Generate Class Code
                  </button>
                </SectionCard>

                <SectionCard>
                  <h2 className="text-2xl font-bold text-[#592803] mb-4">
                    Your Classes
                  </h2>

                  <div className="grid gap-5 md:grid-cols-2">
                    <TeacherClassCard
                      name="BECE English A"
                      code="ENG231"
                      studentCount={18}
                    />
                  </div>
                </SectionCard>
              </>
            )}

            {/* PARENT */}
            {isParent && (
              <SectionCard>
                <h2 className="text-2xl font-bold text-[#592803] mb-4">
                  Student Overview
                </h2>

                <p className="text-[#4B3A46]">
                  View student classes and progress here.
                </p>
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}