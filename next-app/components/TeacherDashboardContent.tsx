import SectionCard from "@/components/SectionCard";

type TeacherDashboardContentProps = {
  teacherName: string;
};

export default function TeacherDashboardContent({
  teacherName,
}: TeacherDashboardContentProps) {
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
            Manage your classes, review student progress, and organize assignments.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 md:w-[420px]">
          <div className="rounded-xl bg-[#FFF1B8] p-4 border border-[#4B3A46]/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
              Classes
            </p>
            <p className="mt-2 text-2xl font-extrabold text-[#592803]">3</p>
          </div>

          <div className="rounded-xl bg-white/80 p-4 border border-[#4B3A46]/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
              Students
            </p>
            <p className="mt-2 text-2xl font-extrabold text-[#592803]">42</p>
          </div>

          <div className="rounded-xl bg-white/80 p-4 border border-[#4B3A46]/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
              Assignments
            </p>
            <p className="mt-2 text-2xl font-extrabold text-[#592803]">8</p>
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
          <div className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
              Action
            </p>
            <h3 className="mt-2 text-xl font-bold text-[#592803]">
              Create New Class
            </h3>
            <p className="mt-2 text-sm text-[#4B3A46]">
              Set up a class and generate a code for students to join.
            </p>
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
            Placeholder overview of teacher classes and class codes.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-5 shadow-sm">
            <h3 className="text-xl font-bold text-[#592803]">BECE English A</h3>
            <p className="mt-2 text-sm text-[#4B3A46]">Class Code: ENG231</p>
            <p className="mt-1 text-sm text-[#4B3A46]">18 students enrolled</p>
          </div>

          <div className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-5 shadow-sm">
            <h3 className="text-xl font-bold text-[#592803]">WASSCE Writing Prep</h3>
            <p className="mt-2 text-sm text-[#4B3A46]">Class Code: WRT482</p>
            <p className="mt-1 text-sm text-[#4B3A46]">24 students enrolled</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}