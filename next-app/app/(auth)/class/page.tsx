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
    ? (await getTeacherClassesWithAssignments(user.id, supabase)).classes
    : await getStudentClassesWithAssignments(user.id, supabase);

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
          activeItem="Classes"
          logoutAction={logout}
          profile={profile}
        />

        <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-5xl space-y-6 lg:space-y-8">
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
              <h2 className="mb-4 text-2xl font-bold text-[#592803]">
                Your Classes
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {classes.map((classItem) => (
                  <ClassCard
                    key={classItem.id}
                    id={classItem.id}
                    name={classItem.name}
                    assignments={Array.isArray(classItem.assignments) ? classItem.assignments : []}
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