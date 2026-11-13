import { supabase } from "@/lib/supabase";
import type { Database } from "../../../types/database.types.ts";
import { apiFetch } from "../../../lib/apiFetch.ts";

type AvailableLessonInsert =
  Database["public"]["Tables"]["available_lessons"]["Insert"];

type AvailableLessonRow =
  Database["public"]["Tables"]["available_lessons"]["Row"];

type AvailableLessonUpdate =
  Database["public"]["Tables"]["available_lessons"]["Update"];

type GetLessonParams = {
  instructorIds: string[];
  studentLicenseClass?: string[];
};

type UpdateLessonParams = {
  payload: AvailableLessonUpdate;
  lessonId: number;
};

const API_URL = "http://localhost:3000";

//////////// Schüler nimmt Fahrstunde an /////////////
export async function acceptLessonByStudent(lessonId: number) {
  const res = await apiFetch(`${API_URL}/student/lessons/${lessonId}/accept`, {
    method: "PATCH",
  });

  if (!res.ok) {
    return {
      data: null,
      error: new Error("Fehler beim Annehmen der Fahrstunde"),
    };
  }
  return { data: await res.json(), error: null };
}

// Update Terminanfrage

export async function updateAvailableLesson({
  lessonId,
  payload,
}: UpdateLessonParams) {
  const res = await apiFetch(`${API_URL}/instructor/lessons/${lessonId}`, {
    method: "PATCH",
    body: JSON.stringify({
      duration_minutes: Number(payload.duration_minutes),
      lesson_date: payload.lesson_date,
      lesson_time: payload.lesson_time,
      license_class: payload.license_class,
    }),
  });

  if (!res.ok) {
    return {
      data: null,
      error: new Error("Termin Anfrage konnte nicht updated werden."),
    };
  }

  const data = await res.json();
  return { data, error: null };
}

// Nur ausgewählte Daten auslesen

export async function getAvailableLesson({
  instructorIds,
  studentLicenseClass,
}: GetLessonParams): Promise<AvailableLessonRow[]> {
  if (!instructorIds || instructorIds.length === 0) {
    return [];
  }

  let query = supabase
    .from("available_lessons")
    .select("*")
    .in("instructor_id", instructorIds)
    .eq("status", "offen");

  if (studentLicenseClass) {
    query = query.in("license_class", studentLicenseClass);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getAvailableLesson:", error);
    throw error;
  }

  return data ?? [];
}

// Termin Anfrage in der DB Speichern

export async function createAvailableLesson(payload: AvailableLessonInsert) {
  const res = await apiFetch(`${API_URL}/instructor/lessons`, {
    method: "POST",
    body: JSON.stringify({
      duration_minutes: payload.duration_minutes,
      lesson_date: payload.lesson_date,
      lesson_time: payload.lesson_time,
      license_class: payload.license_class,
      status: payload.status,
    }),
  });

  if (!res.ok) {
    return {
      data: null,
      error: new Error("Termin Anfrage konnte nicht angelegt werden."),
    };
  }

  const data = await res.json();
  return { data, error: null };
}

export async function deleteLesson(lessonId: number) {
  const res = await apiFetch(`${API_URL}/instructor/lessons/${lessonId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    return {
      data: null,
      error: new Error("Termin konnte nicht gelöscht werden"),
    };
  }

  let data = null;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : { success: true };
  } catch (e) {
    data = { success: true };
  }

  return { data, error: null };
}
