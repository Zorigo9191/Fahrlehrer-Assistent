import { supabase } from "@/lib/supabase";
import type { Database } from "../../../types/database.types.ts";

type AvailableLessonInsert =
  Database["public"]["Tables"]["available_lessons"]["Insert"];

type AvailableLessonRow =
  Database["public"]["Tables"]["available_lessons"]["Row"];

type AvailableLessonUpdate =
  Database["public"]["Tables"]["available_lessons"]["Update"];

type GetLessonParams = {
  instructorId: AvailableLessonRow["instructor_id"];
};

type UpdateLessonParams = {
  payload: AvailableLessonUpdate;
  lessonId: number;
};

// Update

export async function updateAvailableLesson({
  lessonId,
  payload,
}: UpdateLessonParams) {
  const { data, error } = await supabase
    .from("available_lessons")
    .update(payload)
    .select()
    .eq("id", lessonId);

  if (error) {
    throw error;
  }

  return data;
}

// Nur ausgewählte Daten auslesen

export async function getAvailableLesson({
  instructorId,
}: GetLessonParams): Promise<AvailableLessonRow[]> {
  const { data, error } = await supabase
    .from("available_lessons")
    .select("*")
    .eq("instructor_id", instructorId)
    .eq("status", "offen");

  if (error) {
    throw error;
  }

  return data;
}

// Termin Anfrage in der DB Speichern
export async function createAvailableLesson(payload: AvailableLessonInsert) {
  const { data, error } = await supabase
    .from("available_lessons")
    .insert([payload])
    .select();

  if (error) {
    console.error("Fehler beim Erstellen der Terminanfrage:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

// DeleteLesson

export async function deleteLesson(lessonId: number) {
  const { error } = await supabase
    .from("available_lessons")
    .delete()
    .eq("id", lessonId);

  if (error) {
    console.error("Fehler beim Löschen der Terminanfrage:", error);
    throw error;
  }

  return true;
}
