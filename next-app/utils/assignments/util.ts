import { getTopicCompletionPercent, getTopicDetails } from "@/utils/topic/util";

export type AssignmentDisplayRow = {
  id: number;
  class_id: number;
  topic_id: number;
  due_date: string;
  topic_name: string | null;
};

export type AssignmentWithProgress = AssignmentDisplayRow & {
  progress_percent: number;
  completed: boolean;
};

export type AssignmentDetailRow = AssignmentDisplayRow;

export type StudentTopicProgressRow = {
  student_id: string;
  student_name: string;
  completed_items: number;
  total_items: number;
  progress_percent: number;
};

export type StudentAssignmentsBuckets = {
  upcoming: AssignmentWithProgress[];
  overdueIncomplete: AssignmentWithProgress[];
};

async function postAssignmentRoute(
  route: "/api/classes/assignments/create" | "/api/classes/assignments/delete" | "/api/classes/assignments/edit",
  payload: Record<string, string>,
  fallbackError: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const formData = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      formData.append(key, value);
    }

    const response = await fetch(route, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      return {
        success: false,
        error: data.error ?? fallbackError,
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: fallbackError };
  }
}

function normalizeAssignments(rows: any[]): AssignmentDisplayRow[] {
  return rows
    .map((row) => ({
      id: Number(row.id),
      class_id: Number(row.class_id),
      topic_id: Number(row.topic_id),
      due_date: typeof row.due_date === "string" ? row.due_date : "",
      topic_name:
        typeof row.topic?.name === "string"
          ? row.topic.name
          : typeof row.topic_name === "string"
            ? row.topic_name
            : null,
    }))
    .filter(
      (row) =>
        Number.isFinite(row.id) &&
        Number.isFinite(row.class_id) &&
        Number.isFinite(row.topic_id) &&
        row.due_date.trim().length > 0,
    )
    .sort(
      (a, b) =>
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
    );
}

async function getAssignmentsByClassIds(
  classIds: number[],
  supabase: any,
): Promise<AssignmentDisplayRow[]> {
  if (classIds.length === 0) {
    return [];
  }

  const assignmentsRes = await supabase
    .from("class_assignments")
    .select("id, class_id, topic_id, due_date, topic:topic_id(name)")
    .in("class_id", classIds);

  if (assignmentsRes.error) {
    console.error("Error fetching assignments:", assignmentsRes.error);
    return [];
  }

  return normalizeAssignments(assignmentsRes.data ?? []);
}

async function addProgressAndSplitAssignments(
  assignments: AssignmentDisplayRow[],
  studentID: string,
  supabase: any,
): Promise<StudentAssignmentsBuckets> {
  if (!studentID.trim() || assignments.length === 0) {
    return { upcoming: [], overdueIncomplete: [] };
  }

  const uniqueTopicIds = Array.from(new Set(assignments.map((row) => row.topic_id)));
  const progressEntries = await Promise.all(
    uniqueTopicIds.map(async (topicId) => {
      const progressPercent = await getTopicCompletionPercent(
        topicId,
        studentID.trim(),
        supabase,
      );
      return [topicId, progressPercent] as const;
    }),
  );
  const progressByTopicId = new Map<number, number>(progressEntries);

  const now = Date.now();
  const upcoming: AssignmentWithProgress[] = [];
  const overdueIncomplete: AssignmentWithProgress[] = [];

  for (const assignment of assignments) {
    const progressPercent = progressByTopicId.get(assignment.topic_id) ?? 0;
    const completed = progressPercent >= 100;
    const dueTime = new Date(assignment.due_date).getTime();

    const row: AssignmentWithProgress = {
      ...assignment,
      progress_percent: progressPercent,
      completed,
    };

    const isOverdue = Number.isFinite(dueTime) ? dueTime < now : false;
    if (!isOverdue) {
      upcoming.push(row);
      continue;
    }

    if (!completed) {
      overdueIncomplete.push(row);
    }
  }

  return { upcoming, overdueIncomplete };
}

export async function createAssignment(input: {
  class_id: number;
  topic_id: number;
  due_date: string;
}): Promise<{ success: boolean; error?: string }> {
  const { class_id, topic_id, due_date } = input;

  if (
    !Number.isFinite(class_id) ||
    !Number.isFinite(topic_id) ||
    !due_date.trim()
  ) {
    return { success: false, error: "Missing or invalid required fields" };
  }

  return postAssignmentRoute(
    "/api/classes/assignments/create",
    {
      class_id: String(class_id),
      topic_id: String(topic_id),
      due_date: due_date.trim(),
    },
    "Failed to create assignment",
  );
}

export async function deleteAssignment(
  assignmentID: number,
): Promise<{ success: boolean; error?: string }> {
  if (!Number.isFinite(assignmentID)) {
    return { success: false, error: "Assignment is required" };
  }

  return postAssignmentRoute(
    "/api/classes/assignments/delete",
    { id: String(assignmentID) },
    "Failed to delete assignment",
  );
}

export async function editAssignment(input: {
  id: number;
  due_date: string;
}): Promise<{ success: boolean; error?: string }> {
  const { id, due_date } = input;

  if (!Number.isFinite(id) || !due_date.trim()) {
    return { success: false, error: "Missing or invalid required fields" };
  }

  return postAssignmentRoute(
    "/api/classes/assignments/edit",
    { id: String(id), due_date: due_date.trim() },
    "Failed to edit assignment",
  );
}

export async function getAssignmentsDisplay(
  classID: string | number,
  supabase: any,
): Promise<AssignmentDisplayRow[]> {
  const classIdNum =
    typeof classID === "string" ? Number.parseInt(classID, 10) : classID;
  if (!Number.isFinite(classIdNum)) {
    return [];
  }

  const assignments = await getAssignmentsByClassIds([classIdNum], supabase);
  return assignments;
}

export async function getAssignmentDetailForClass(
  classID: string | number,
  assignmentID: string | number,
  supabase: any,
): Promise<AssignmentDetailRow | null> {
  const classIdNum =
    typeof classID === "string" ? Number.parseInt(classID, 10) : classID;
  const assignmentIdNum =
    typeof assignmentID === "string"
      ? Number.parseInt(assignmentID, 10)
      : assignmentID;

  if (!Number.isFinite(classIdNum) || !Number.isFinite(assignmentIdNum)) {
    return null;
  }

  const res = await supabase
    .from("class_assignments")
    .select("id, class_id, topic_id, due_date, topic:topic_id(name)")
    .eq("class_id", classIdNum)
    .eq("id", assignmentIdNum)
    .maybeSingle();

  if (res.error) {
    console.error("Error fetching assignment detail:", res.error);
    return null;
  }

  if (!res.data) {
    return null;
  }

  const normalized = normalizeAssignments([res.data]);
  return normalized[0] ?? null;
}

export async function getClassStudentTopicProgress(
  classID: string | number,
  topicID: string | number,
  supabase: any,
): Promise<StudentTopicProgressRow[]> {
  const classIdNum =
    typeof classID === "string" ? Number.parseInt(classID, 10) : classID;
  const topicIdNum =
    typeof topicID === "string" ? Number.parseInt(topicID, 10) : topicID;

  if (!Number.isFinite(classIdNum) || !Number.isFinite(topicIdNum)) {
    return [];
  }

  const membershipsRes = await supabase
    .from("class_students")
    .select("student_id")
    .eq("class_id", classIdNum);

  if (membershipsRes.error) {
    console.error("Error fetching class students for progress:", membershipsRes.error);
    return [];
  }

  const studentIds = Array.from(
    new Set(
      (membershipsRes.data ?? [])
        .map((row: any) =>
          typeof row.student_id === "string" ? row.student_id : null,
        )
        .filter((id: string | null): id is string => Boolean(id)),
    ),
  );

  if (studentIds.length === 0) {
    return [];
  }

  const usersRes = await supabase
    .from("users")
    .select("id, name")
    .in("id", studentIds);

  if (usersRes.error) {
    console.error("Error fetching student names for progress:", usersRes.error);
    return [];
  }

  const progressRows = await Promise.all(
    (usersRes.data ?? []).map(async (row: any) => {
      const studentId = typeof row.id === "string" ? row.id : "";
      const studentName =
        typeof row.name === "string" && row.name.trim()
          ? row.name
          : "Unknown Student";
      const topicContent = studentId
        ? await getTopicDetails(topicIdNum, supabase, studentId)
        : [];
      const totalItems = topicContent.length;
      const completedItems = topicContent.filter((item) => item.completed).length;
      const progressPercent =
        totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

      return {
        student_id: studentId,
        student_name: studentName,
        completed_items: completedItems,
        total_items: totalItems,
        progress_percent: progressPercent,
      };
    }),
  );

  return progressRows
    .filter((row) => row.student_id.trim().length > 0)
    .sort((a, b) => b.progress_percent - a.progress_percent);
}

export async function getAssignmentsForClass(
  classID: string | number,
  studentID: string,
  supabase: any,
): Promise<StudentAssignmentsBuckets> {
  const classIdNum =
    typeof classID === "string" ? Number.parseInt(classID, 10) : classID;
  if (!Number.isFinite(classIdNum) || !studentID.trim()) {
    return { upcoming: [], overdueIncomplete: [] };
  }

  const assignments = await getAssignmentsByClassIds([classIdNum], supabase);
  return addProgressAndSplitAssignments(assignments, studentID, supabase);
}

export async function getAllAssignments(
  studentID: string,
  supabase: any,
): Promise<StudentAssignmentsBuckets> {
  if (!studentID.trim()) {
    return { upcoming: [], overdueIncomplete: [] };
  }

  const membershipsRes = await supabase
    .from("class_students")
    .select("class_id")
    .eq("student_id", studentID.trim());

  if (membershipsRes.error) {
    console.error(
      "Error fetching student class memberships for assignments:",
      membershipsRes.error,
    );
    return { upcoming: [], overdueIncomplete: [] };
  }

  const classIds: number[] = Array.from(
    new Set(
      (membershipsRes.data ?? [])
        .map((row: any) => Number(row.class_id))
        .filter((id: number) => Number.isFinite(id)),
    ),
  );

  const assignments = await getAssignmentsByClassIds(classIds, supabase);
  return addProgressAndSplitAssignments(assignments, studentID, supabase);
}