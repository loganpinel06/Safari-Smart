import Link from "next/link";

type ClassAssignment = {
  id: number;
  topic_id: number;
  topic_name: string | null;
  due_date: string;
};

type ClassCardProps = {
  id: string;
  name: string;
  assignments?: ClassAssignment[];
};

export default function ClassCard({ id, name, assignments = [] }: ClassCardProps) {
  const now = Date.now();
  const upcomingAssignments = assignments
    .filter((assignment) => {
      const dueTime = new Date(assignment.due_date).getTime();
      return Number.isFinite(dueTime) && dueTime >= now;
    })
    .sort(
      (a, b) =>
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
    )
    .slice(0, 2);

  return (
    <Link
      href={`/class/${id}`}
      className="block rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#592803]/30 hover:bg-white hover:shadow-md"
    >
      <h3 className="text-xl font-bold text-[#592803]">{name}</h3>
      <p className="mt-3 text-sm font-semibold text-[#4B3A46]">Assignments</p>
      <div className="mt-2 space-y-2">
        {upcomingAssignments.length > 0 ? (
          upcomingAssignments.map((assignment, index) => (
            <div
              key={assignment.id ?? `${assignment.topic_id}-${index}`}
              className="rounded-lg border border-[#4B3A46]/10 bg-white px-3 py-2"
            >
              <p className="text-sm font-semibold text-[#592803]">
                {assignment.topic_name ?? `Topic ${assignment.topic_id}`}
              </p>
              <p className="text-xs text-[#4B3A46]">
                Due: {new Date(assignment.due_date).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-xs text-[#4B3A46]">No upcoming assignments.</p>
        )}
      </div>
    </Link>
  );
}
