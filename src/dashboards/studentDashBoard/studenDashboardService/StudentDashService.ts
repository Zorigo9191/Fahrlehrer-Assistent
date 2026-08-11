import { supabase } from "../../../lib/supabase.ts";

// Angenommene Fahstuden holen
export async function AcceptedLessons(studentId: number) {
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

export async function getExamSlots(studentId: number) {
  const { data, error } = await supabase
    .from("exam_slots")
    .select("*")
    .eq("student_id", studentId);

  if (error) {
    console.error("Fehler beim Laden der Feedbacks:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

// nur studenten holen
export async function getStudents() {
  const { data, error } = await supabase
    .from("exam_slots")
    .select("student_id, student_name");

  if (error) {
    console.error("Fehler beim Laden der Schüler:", error);
    return { data: null, error };
  }

  return { data, error: null };
}
