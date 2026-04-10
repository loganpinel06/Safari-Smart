export type StudentClassWithAssignments = {
  id: string;
  name: string;
  assignments: any;
};

export type TeacherClassWithAssignments = {
  id: string;
  name: string;
  assignments: any;
};

export type ClassFullInfo = {
  id: string;
  name: string;
  teacher_id: string;
  join_code?: string | null;
  created_at?: string | null;
  teacher_name: string | null;
  student_names: string[];
  assignments: any;
  [key: string]: any;
};

export async function joinClassWithCode(joinCode: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!joinCode.trim()) {
    return { success: false, error: "Class code is required" };
  }

  try {
    const formData = new FormData();
    formData.append("join_code", joinCode.trim());

    const response = await fetch("/api/classes/join", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      return {
        success: false,
        error: data.error ?? "Failed to join class",
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Failed to join class" };
  }
}

export async function leaveClass(classId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!classId.trim()) {
    return { success: false, error: "Class is required" };
  }

  try {
    const formData = new FormData();
    formData.append("class_id", classId.trim());

    const response = await fetch("/api/classes/leave", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      return {
        success: false,
        error: data.error ?? "Failed to leave class",
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Failed to leave class" };
  }
}

export async function deleteClass(classId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!classId.trim()) {
    return { success: false, error: "Class is required" };
  }

  try {
    const formData = new FormData();
    formData.append("class_id", classId.trim());

    const response = await fetch("/api/classes/delete", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      return {
        success: false,
        error: data.error ?? "Failed to delete class",
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete class" };
  }
}

// gets all classes a student is enrolled in, with class name + assignments
export async function getStudentClassesWithAssignments(
  studentID: string,
  supabase: any,
): Promise<StudentClassWithAssignments[]> {
  if (!studentID) {
    return [];
  }

  const membershipsRes = await supabase
    .from("class_students")
    .select("class_id")
    .eq("student_id", studentID);

  if (membershipsRes.error) {
    console.error("Error fetching student class memberships:", membershipsRes.error);
    return [];
  }

  const classIds = (membershipsRes.data ?? [])
    .map((row: any) => row.class_id)
    .filter(Boolean);

  if (classIds.length === 0) {
    return [];
  }

  const classesRes = await supabase
    .from("classes")
    .select("id, name, assignments")
    .in("id", classIds);

  if (classesRes.error) {
    console.error("Error fetching classes for student:", classesRes.error);
    return [];
  }

  return (classesRes.data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    assignments: row.assignments ?? [],
  }));
}

// gets all classes a teacher owns, with class name + assignments
export async function getTeacherClassesWithAssignments(
  teacherID: string,
  supabase: any,
): Promise<TeacherClassWithAssignments[]> {
  if (!teacherID) {
    return [];
  }

  const classesRes = await supabase
    .from("classes")
    .select("id, name, assignments")
    .eq("teacher_id", teacherID);

  if (classesRes.error) {
    console.error("Error fetching classes for teacher:", classesRes.error);
    return [];
  }

  return (classesRes.data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    assignments: row.assignments ?? [],
  }));
}

// gets complete class info + teacher name + all student names + assignments
export async function getClassFullInfo(
  classID: string,
  supabase: any,
): Promise<ClassFullInfo | null> {
  if (!classID) {
    return null;
  }

  const classRes = await supabase
    .from("classes")
    .select("*")
    .eq("id", classID)
    .maybeSingle();

  if (classRes.error) {
    console.error("Error fetching class info:", classRes.error);
    return null;
  }

  if (!classRes.data) {
    return null;
  }

  const teacherId = classRes.data.teacher_id;

  const [teacherRes, membershipsRes] = await Promise.all([
    supabase.from("users").select("name").eq("id", teacherId).maybeSingle(),
    supabase.from("class_students").select("student_id").eq("class_id", classID),
  ]);

  if (teacherRes.error) {
    console.error("Error fetching class teacher info:", teacherRes.error);
  }

  if (membershipsRes.error) {
    console.error("Error fetching class students:", membershipsRes.error);
  }

  const studentIds = (membershipsRes.data ?? [])
    .map((row: any) => row.student_id)
    .filter(Boolean);

  let studentNames: string[] = [];
  if (studentIds.length > 0) {
    const studentsRes = await supabase
      .from("users")
      .select("id, name")
      .in("id", studentIds);

    if (studentsRes.error) {
      console.error("Error fetching student names:", studentsRes.error);
    } else {
      studentNames = (studentsRes.data ?? []).map((student: any) => student.name);
    }
  }

  return {
    ...classRes.data,
    teacher_name: teacherRes.data?.name ?? null,
    student_names: studentNames,
    assignments: classRes.data.assignments ?? [],
  };
}