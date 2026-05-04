import SectionCard from "@/components/SectionCard";
import TeacherClassCard from "@/components/TeacherClassCard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getTeacherClassesWithAssignments } from "@/utils/classes/util";
import CreateClassModal from "@/components/CreateClassModal";

type TeacherDashboardContentProps = {
  teacherName: string;
};

export default async function TeacherDashboardContent({
  teacherName,
}: TeacherDashboardContentProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { classes, distinctStudentCount } =
    await getTeacherClassesWithAssignments(user.id, supabase);

  const totalAssignments = classes.reduce(
    (sum, c: any) =>
      sum + (Array.isArray(c.assignments) ? c.assignments.length : 0),
    0,
  );

  return (
    <div className="space-y-8">
      <SectionCard className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
            Teacher Dashboard
          </p>
          <h2 className="text-2xl font-bold text-[#592803]">
            Welcome back, {teacherName}
          </h2>
          <p className="text-sm text-[#4B3A46]">
            Manage your classes, review student progress, and organize
            assignments.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 md:w-105">
          <div className="rounded-xl bg-[#FFF1B8] p-4 border border-[#4B3A46]/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
              Classes
            </p>
            <p className="mt-2 text-2xl font-extrabold text-[#592803]">
              {classes.length}
            </p>
          </div>

          <div className="rounded-xl bg-white/80 p-4 border border-[#4B3A46]/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
              Students
            </p>
            <p className="mt-2 text-2xl font-extrabold text-[#592803]">
              {distinctStudentCount}
            </p>
          </div>

          <div className="rounded-xl bg-white/80 p-4 border border-[#4B3A46]/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
              Assignments
            </p>
            <p className="mt-2 text-2xl font-extrabold text-[#592803]">
              {totalAssignments}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#592803]">Quick Actions</h2>
          <p className="text-sm text-[#4B3A46] mt-1">
            Common teacher tools and upcoming workflow areas.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
              Action
            </p>
            <h3 className="mt-2 text-xl font-bold text-[#592803]">
              Create New Class
            </h3>
            <p className="mt-2 text-sm text-[#4B3A46]">
              Set up a class and generate a code for students to join.
            </p>

            <div className="mt-4">
              <CreateClassModal />
            </div>
          </div>

          <div className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
              Action
            </p>
            <h3 className="mt-2 text-xl font-bold text-[#592803]">
              Manage Assignments
            </h3>
            <p className="mt-2 text-sm text-[#4B3A46]">
              Post lessons, quizzes, and exam practice for your students.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#592803]">My Classes</h2>
          <p className="text-sm text-[#4B3A46] mt-1">
            Your classes and quick access to class pages.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {classes.map((c: any) => (
            <Link key={c.id} href={`/class/${c.id}`} className="block">
              <TeacherClassCard
                name={c.name}
                code={c.join_code ?? c.id}
                studentCount={c.student_count ?? 0}
              />
            </Link>
          ))}

          {classes.length === 0 && (
            <p className="text-sm text-[#4B3A46]">No classes yet.</p>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
