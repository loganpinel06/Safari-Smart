import SectionCard from "@/components/SectionCard";

type ParentDashboardContentProps = {
  parentName: string;
};

export default function ParentDashboardContent({
  parentName,
}: ParentDashboardContentProps) {
  return (
    <div className="space-y-8">
      <SectionCard className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#4B3A46]">
            Parent Dashboard
          </p>
          <h2 className="text-2xl font-bold text-[#592803]">
            Welcome back, {parentName}
          </h2>
          <p className="text-sm text-[#4B3A46]">
            Monitor student progress, recent activity, and teacher updates.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 md:w-[420px]">
          <div className="rounded-xl bg-[#FFF1B8] p-4 border border-[#4B3A46]/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
              Students
            </p>
            <p className="mt-2 text-2xl font-extrabold text-[#592803]">1</p>
          </div>

          <div className="rounded-xl bg-white/80 p-4 border border-[#4B3A46]/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
              Subjects
            </p>
            <p className="mt-2 text-2xl font-extrabold text-[#592803]">3</p>
          </div>

          <div className="rounded-xl bg-white/80 p-4 border border-[#4B3A46]/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4B3A46]">
              Completed
            </p>
            <p className="mt-2 text-2xl font-extrabold text-[#592803]">12</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#592803]">Student Progress</h2>
          <p className="text-sm text-[#4B3A46] mt-1">
            Placeholder overview of student learning progress and performance.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-5 shadow-sm">
            <h3 className="text-xl font-bold text-[#592803]">English</h3>
            <p className="mt-2 text-sm text-[#4B3A46]">Progress: 70% complete</p>
            <p className="mt-1 text-sm text-[#4B3A46]">Latest quiz score: 8 / 10</p>
          </div>

          <div className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-5 shadow-sm">
            <h3 className="text-xl font-bold text-[#592803]">Science</h3>
            <p className="mt-2 text-sm text-[#4B3A46]">Progress: 55% complete</p>
            <p className="mt-1 text-sm text-[#4B3A46]">Latest quiz score: 6 / 10</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#592803]">Recent Activity</h2>
          <p className="text-sm text-[#4B3A46] mt-1">
            Example view of recent student work and updates.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#592803]">
              Essay Writing lesson marked complete
            </p>
            <p className="mt-1 text-sm text-[#4B3A46]">
              Completed today at 10:15 AM
            </p>
          </div>

          <div className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#592803]">
              Grammar quiz submitted
            </p>
            <p className="mt-1 text-sm text-[#4B3A46]">
              Score: 7 / 10
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#592803]">Teacher Updates</h2>
          <p className="text-sm text-[#4B3A46] mt-1">
            Placeholder space for teacher communication and class announcements.
          </p>
        </div>

        <div className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#592803]">
            New assignment posted for BECE English
          </p>
          <p className="mt-1 text-sm text-[#4B3A46]">
            Students should complete the review quiz by Friday.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}