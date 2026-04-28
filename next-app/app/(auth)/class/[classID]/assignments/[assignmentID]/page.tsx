import Link from "next/link";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import SectionCard from "@/components/SectionCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createClient } from "@/utils/supabase/server";
import { getClassFullInfo } from "@/utils/classes/util";
import {
  getAssignmentDetailForClass,
  getClassStudentTopicProgress,
} from "@/utils/assignments/util";
import { getTopicDetails } from "@/utils/topic/util";
import EditAssignmentDueDateModal from "@/components/EditAssignmentDueDateModal";
import DeleteAssignmentButton from "@/components/DeleteAssignmentButton";

type PageProps = {
  params: Promise<{ classID: string; assignmentID: string }>;
};

export default async function ClassAssignmentDetailPage({ params }: PageProps) {
  const supabase = await createClient();
  const { classID, assignmentID } = await params;

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

  const assignment = await getAssignmentDetailForClass(classID, assignmentID, supabase);
  if (!assignment) {
    redirect(`/class/${classID}`);
  }

  const isTeacherRole =
    profile?.account_type === "Teacher" || profile?.account_type === "Admin";
  const isClassOwner = user.id === classInfo.teacher_id;

  const { data: membershipRow } = await supabase
    .from("class_students")
    .select("class_id")
    .eq("class_id", classID)
    .eq("student_id", user.id)
    .maybeSingle();

  const isStudentInClass =
    profile?.account_type === "Student" && Boolean(membershipRow);

  const canView =
    (isTeacherRole && isClassOwner) ||
    profile?.account_type === "Admin" ||
    isStudentInClass;

  if (!canView) {
    redirect(`/class/${classID}`);
  }

  const dueDateDisplay = assignment.due_date
    ? new Date(assignment.due_date).toLocaleDateString()
    : "No due date";

  const studentTopicContent = isStudentInClass
    ? await getTopicDetails(assignment.topic_id, supabase, user.id)
    : [];
  const studentCompletedItems = studentTopicContent.filter((item) => item.completed).length;
  const studentTotalItems = studentTopicContent.length;
  const studentProgressPercent =
    studentTotalItems > 0
      ? Math.round((studentCompletedItems / studentTotalItems) * 100)
      : 0;

  const classStudentProgress =
    isTeacherRole && isClassOwner
      ? await getClassStudentTopicProgress(classID, assignment.topic_id, supabase)
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
            <Breadcrumbs
              items={[
                { label: "Classes", href: "/class" },
                { label: classInfo.name ?? "Class", href: `/class/${classID}` },
                { label: assignment.topic_name ?? "Assignment" },
              ]}
            />

            <PageHeader
              title={assignment.topic_name ?? "Assignment"}
              subtitle={`Due: ${dueDateDisplay}`}
            />

            {isStudentInClass ? (
              <SectionCard className="bg-white/70">
                <div className="space-y-3">
                  <p className="text-sm text-[#4B3A46]">
                    Track your progress in this assigned topic.
                  </p>
                  <p className="text-base font-semibold text-[#592803]">
                    Current Progress: {studentCompletedItems}/{studentTotalItems} (
                    {studentProgressPercent}%)
                  </p>
                  <div className="pt-2">
                    <Link
                      href={`/topic/${assignment.topic_id}`}
                      className="inline-flex rounded-xl bg-[#592803] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4B3A46]"
                    >
                      Go To Topic
                    </Link>
                  </div>
                </div>
              </SectionCard>
            ) : (
              <SectionCard className="bg-white/70">
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-[#592803]">Teacher Actions</h2>
                      <p className="mt-1 text-sm text-[#4B3A46]">
                        Update or remove this assignment.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <EditAssignmentDueDateModal
                        assignmentId={assignment.id}
                        currentDueDate={assignment.due_date}
                      />
                      <DeleteAssignmentButton
                        assignmentId={assignment.id}
                        classId={classID}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <h2 className="text-xl font-bold text-[#592803]">Student Progress</h2>
                    <p className="mt-1 text-sm text-[#4B3A46]">
                      Class-wide completion percentages for this topic assignment.
                    </p>
                  </div>

                  {classStudentProgress.length > 0 ? (
                    <div className="space-y-3">
                      {classStudentProgress.map((student) => (
                        <div
                          key={student.student_id}
                          className="rounded-xl border border-[#4B3A46]/10 bg-white px-4 py-3 shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold text-[#592803]">{student.student_name}</p>
                            <p className="text-sm font-semibold text-[#4B3A46]">
                              {student.completed_items}/{student.total_items} (
                              {student.progress_percent}%)
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-[#4B3A46]/20 bg-white/60 px-4 py-6 text-center">
                      <p className="text-sm text-[#4B3A46]">
                        No students are enrolled in this class yet.
                      </p>
                    </div>
                  )}
                </div>
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
