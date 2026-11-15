import { apiFetch } from "../../../lib/apiFetch.ts";
import { supabase } from "../../../lib/supabase.ts";

// Angenommene Fahstuden holen
export async function AcceptedLessons(studentId: string) {
  const { data, error } = await supabase
    .from("available_lessons")
    .select("*, instructors(*)")
    .eq("student_id", studentId)
    .eq("status", "vergeben");

  if (error) {
    console.error("Fehler beim Laden der Feedbacks:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

// ExamSlots holen

export async function getExamAppointments() {
  const res = await apiFetch(`/student/exam-appointments`, {
    method: "GET",
  });

  if (!res.ok) {
    return {
      data: null,
      error: new Error("Prüfungstermine können nicht geladen werden"),
    };
  }

  const data = await res.json();
  return { data, error: null };
}

// nur studenten holen
export async function getStudents(): Promise<{
  data: {
    id: string;
    full_name: string;
  }[];
  error: any;
}> {
  const { data, error } = await supabase
    .from("driving_students")
    .select("id, full_name");

  if (error) {
    console.error("Fehler beim Laden der Schüler:", error);
    return { data: [], error };
  }

  return { data, error: null };
}
