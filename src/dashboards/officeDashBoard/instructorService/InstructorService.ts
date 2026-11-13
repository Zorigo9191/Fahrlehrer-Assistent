import { supabase } from "@/lib/supabase";
import { apiFetch } from "../../../lib/apiFetch.ts";

import { getErrorMessage } from "../utils/getErrorMessage.ts";

const API_URL = "http://localhost:3000";

// Daten für Instructor holen
export async function getInstructors() {
  const { data, error } = await supabase
    .from("instructors")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error };
  }

  return {
    data,
    error: null,
  };
}

// Instructor erstellen
export type CreateInstructorInput = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  teaching_classes: string[];
};

export async function createInstructor(instructor: CreateInstructorInput) {
  const res = await apiFetch(`${API_URL}/office/instructor-account`, {
    method: "POST",
    body: JSON.stringify(instructor),
  });

  const body = await res.json().catch(() => null);
  // .catch(() => null): Versuche, das JSON zu lesen. Wenn dabei ein Fehler  auftritt, brich nicht ab, sondern gib stattdessen einfach null zurück.

  if (!res.ok) {
    const message = Array.isArray(body?.message) // Array.isArray prüft, ob der Wert in Klammern ein Array ist
      ? body.message.join(" ,")
      : (body?.message ?? `Fehler (${res.status})`);

    return { data: null, error: message as string };
  }

  return { data: body, error: null };
}

// Instructor bearbeiten (Update)
export type UpdateInstructorInput = {
  first_name: string;
  last_name: string;
  phone_number: string;
  teaching_classes: string[];
};

export async function updateInstructor(
  instructorId: string,
  instructor: UpdateInstructorInput,
) {
  const res = await apiFetch(
    `${API_URL}/office/instructor-account/${instructorId}`,
    {
      method: "PATCH",
      body: JSON.stringify(instructor),
    },
  );

  if (!res.ok) return { data: null, error: await getErrorMessage(res) };

  return { data: await res.json(), error: null };
}

// Instructor löschen
export async function deleteInstructor(instructorId: string) {
  const res = await apiFetch(
    `${API_URL}/office/instructor-account/${instructorId}`,
    {
      method: "DELETE",
    },
  );

  if (!res.ok) return { data: null, error: await getErrorMessage(res) };

  return { data: await res.json(), error: null };
}

// Angenommene Fahrstunde

export async function getAcceptedLessonsByStudent() {
  const res = await apiFetch(`${API_URL}/instructor/acceptedlesson`);

  if (!res.ok) {
    console.error("Fehler beim Laden der Termine:", res.status);
    return {
      data: null,
      error: new Error("angenommene Termine konnten nicht geladen werden"),
    };
  }

  const data = await res.json();
  return { data, error: null };
}

// angenommene Fahrstunde bearbeiten
export async function updateAcceptedLesson(
  lessonId: number,
  lessonDate: string,
  lessonTime: string,
  durationMinutes: number,
  licenseClass: string,
) {
  const res = await apiFetch(
    `${API_URL}/instructor/acceptedlesson/${lessonId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lesson_date: lessonDate,
        lesson_time: lessonTime,
        duration_minutes: durationMinutes,
        license_class: licenseClass,
      }),
    },
  );

  if (!res.ok) {
    console.error("Fehler beim Update der angenommenen Fahrstunde");
    return { data: null, error: `Status: ${res.status}` };
  }

  return { data: await res.json(), error: null };
}
