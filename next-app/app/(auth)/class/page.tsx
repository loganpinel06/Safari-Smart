import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import JoinClassSection from "@/components/JoinClassSection";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  getStudentClassesWithAssignments,
  getTeacherClassesWithAssignments,
} from "@/utils/classes/util";
import CreateClassModal from "@/components/CreateClassModal";
import ClassCard from "@/components/ClassCard";

export default async function ClassPage() {
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
  const classes = isTeacher
    ? await getTeacherClassesWithAssignments(user.id, supabase)
    : await getStudentClassesWithAssignments(user.id, supabase);

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
            activeItem="Classes"
            logoutAction={logout}
            profile={profile}
          />
        </div>

        <div className="flex-1 px-10 py-10">
          <div className="max-w-5xl space-y-8">
            <PageHeader
              title="Classes"
              subtitle={
                isTeacher
                  ? "Create classes and manage class content."
                  : "Join a class and view the classes you are enrolled in."
              }
            />

            {isTeacher ? (
              <SectionCard>
                <CreateClassModal />
              </SectionCard>
            ) : (
              <JoinClassSection />
            )}

            <SectionCard>
              <h2 className="text-2xl font-bold text-[#592803] mb-4">
                Your Classes
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                {classes.map((classItem) => (
                  <ClassCard
                    key={classItem.id}
                    id={classItem.id}
                    name={classItem.name}
                  />
                ))}
              </div>
              {classes.length === 0 && (
                <p className="text-sm text-[#4B3A46]">No classes yet.</p>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}
