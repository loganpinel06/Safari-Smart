import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import Sidebar from "@/components/Sidebar";
import ClassDetailActions from "@/components/ClassDetailActions";
import { createClient } from "@/utils/supabase/server";
import { getClassFullInfo } from "@/utils/classes/util";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ classID: string }>;
};

export default async function ClassDetailPage({ params }: PageProps) {
  const supabase = await createClient();
  const classID = (await params).classID;

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

  const classInfo = await getClassFullInfo(classID, supabase);
  if (!classInfo) {
    redirect("/class");
  }

  const isTeacherRole =
    profile?.account_type === "Teacher" || profile?.account_type === "Admin";
  const isTeacher = profile?.account_type === "Teacher";
  const isClassOwner = user.id === classInfo.teacher_id;

  const { data: membershipRow } = await supabase
    .from("class_students")
    .select("class_id")
    .eq("class_id", classID)
    .eq("student_id", user.id)
    .maybeSingle();

  const isEnrolledStudent =
    profile?.account_type === "Student" && !!membershipRow;

  const showLeaveClass = isEnrolledStudent || profile?.account_type === "Admin";
  const showDeleteClass = isTeacherRole && isClassOwner;

  const assignmentList = Array.isArray(classInfo.assignments)
    ? classInfo.assignments
    : [];

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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <PageHeader
                  title={classInfo.name ?? "Class"}
                  subtitle={`Teacher: ${classInfo.teacher_name ?? "Unknown Teacher"}`}
                />
                {isTeacher && classInfo.join_code && (
                  <p className="text-base text-[#4B3A46]">
                    Class Code: {classInfo.join_code}
                  </p>
                )}
              </div>
              <ClassDetailActions
                classId={classID}
                showLeave={showLeaveClass}
                showDelete={showDeleteClass}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
              <SectionCard className="bg-white/70">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-[#592803]">Assignments</h2>
                    <p className="mt-1 text-sm text-[#4B3A46]">
                      Track work posted for this class.
                    </p>
                  </div>
                  {isTeacherRole && isClassOwner && (
                    <button className="rounded-xl bg-[#FFF1B8] px-4 py-2 text-sm font-semibold text-[#592803] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#FFE78A] hover:shadow-md">
                      Create Assignment
                    </button>
                  )}
                </div>

                {assignmentList.length > 0 ? (
                  <div className="space-y-3">
                    {assignmentList.map((assignment: any, index: number) => (
                      <div
                        key={assignment?.id ?? `${assignment?.name ?? "assignment"}-${index}`}
                        className="rounded-xl border border-[#4B3A46]/10 bg-white px-4 py-3 shadow-sm"
                      >
                        <p className="font-semibold text-[#592803]">
                          {assignment?.name ?? `Assignment ${index + 1}`}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-[#4B3A46]/20 bg-white/60 px-4 py-8 text-center">
                    <p className="text-sm text-[#4B3A46]">No assignments yet.</p>
                  </div>
                )}
              </SectionCard>

              <SectionCard className="bg-white/75 md:sticky md:top-8 md:h-fit">
                <h2 className="text-xl font-bold text-[#592803]">Members</h2>
                <p className="mt-1 text-sm text-[#4B3A46]">
                  {1 + classInfo.student_names.length} total
                </p>

                <div className="mt-5 space-y-3">
                  <div className="rounded-xl border border-[#4B3A46]/10 bg-white px-4 py-3 shadow-sm">
                    <p className="font-semibold text-[#592803]">
                      {classInfo.teacher_name ?? "Unknown Teacher"}
                    </p>
                    <p className="text-sm text-[#4B3A46]">Teacher</p>
                  </div>

                  {classInfo.student_names.length > 0 ? (
                    classInfo.student_names.map((studentName) => (
                      <div
                        key={studentName}
                        className="rounded-xl border border-[#4B3A46]/10 bg-white px-4 py-3 shadow-sm"
                      >
                        <p className="font-semibold text-[#592803]">{studentName}</p>
                        <p className="text-sm text-[#4B3A46]">Student</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-[#4B3A46]/20 bg-white/60 px-4 py-4">
                      <p className="text-sm text-[#4B3A46]">No students enrolled yet.</p>
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
