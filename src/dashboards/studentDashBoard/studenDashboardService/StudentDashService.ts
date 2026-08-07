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
