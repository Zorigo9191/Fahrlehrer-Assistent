import { supabase } from "@/lib/supabase";
import type { Database } from "../../../types/database.types.ts";
import { apiFetch } from "../../../lib/apiFetch.ts";

type ExamDayRow = Database["public"]["Tables"]["exam_days"]["Row"];
type ExamDayInsert = Database["public"]["Tables"]["exam_days"]["Insert"];
type ExamDayUpdate = Database["public"]["Tables"]["exam_days"]["Update"];

type ExamSlotRow = Database["public"]["Tables"]["exam_slots"]["Row"];
type ExamSlotInsert = Database["public"]["Tables"]["exam_slots"]["Insert"];
type ExamSlotUpdate = Database["public"]["Tables"]["exam_slots"]["Update"];

export type ExamDayWithSlots = ExamDayRow & {
  exam_slots: ExamSlotRow[];
};

const API_URL = "http://localhost:3000";

// 1. Alle Prüfungsdaten ink. ihrer verknüpften Slots abrufen
export async function getExamDays(role: "office" | "instructor") {
  const url =
    role === "office"
      ? `${API_URL}/office/exam-days`
      : `${API_URL}/instructor/exam-slots`;

  const res = await apiFetch(url, { method: "GET" });

  if (!res.ok) {
    return { data: null, error: `Fehler beim Laden (${res.status})` };
  }

  return { data: await res.json(), error: null };
}

// 2. Einen neuen PrüfungsTag erstellen
export async function createExamDay(payload: ExamDayInsert) {
  const res = await apiFetch(`${API_URL}/office/exam-days`, {
    method: "POST",
    body: JSON.stringify({
      exam_date: payload.exam_date,
      license_class: payload.license_class,
      slots: payload.slots,
    }),
  });

  if (!res.ok) {
    console.error("Fehler beim erstellen des Prüfungstages", res.status);
    return { data: null, error: `Status: ${res.status}` };
  }
  return { data: await res.json(), error: null };
}

// 3. Ein gesamtes Prüfungsdatum löschen
export async function deleteExamDay(dayId: string) {
  const res = await apiFetch(`${API_URL}/office/exam-days/${dayId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    console.error(
      "Der Prüfungstag konnte auf dem Server nicht gelöscht werden",
    );
  }

  return await res.json();
}

//4. Prüfungsdatum und Klassen updaten

export async function updateExamDate(dayId: string, payload: ExamDayUpdate) {
  const res = await apiFetch(`${API_URL}/office/exam-days/${dayId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      exam_date: payload.exam_date,
      license_class: payload.license_class,
      slots: payload.slots,
    }),
  });

  if (!res.ok) {
    console.error("Fehler beim updaten des Prüfungstages", res.status);
    return { data: null, error: `Status: ${res.status}` };
  }
  return { data: await res.json(), error: null };
}

// 5. Einen einzelnen Prüfungsslot aktualisieren. (Schüler, Flehrer, Klasse)

export async function updateExamSlot(
  slotId: string,
  payload: ExamSlotUpdate,
  role: "instructor" | "office",
) {
  const url =
    role === "office"
      ? `${API_URL}/office/exam-slots/${slotId}`
      : `${API_URL}/instructor/exam-slots/${slotId}`;

  const res = await apiFetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: payload.student_id,
      student_name: payload.student_name,
      student_appointment: payload.student_appointment,
      license_class: payload.license_class,
      instructor_name: payload.instructor_name,
      notes: payload.notes,
    }),
  });

  if (!res.ok) {
    console.error("Fehler beim updaten des Slots", res.status);
    return { data: null, error: `Status: ${res.status}` };
  }
  return { data: await res.json(), error: null };
}

// 6. Einzelnen Slot Löschen.

export async function deleteExamSlot(slotId: string) {
  console.log(slotId);
  const res = await apiFetch(
    `${API_URL}/office/exam-days/delete-slot/${slotId}`,
    {
      method: "DELETE",
    },
  );
  console.log(res);
  if (!res.ok) {
    console.error(
      "Der Prüfungsplatz konnte auf dem Server nicht gelöscht werden",
    );
  }

  return await res.json();
}

// 7. Einen einzelnen Prüfungsslot neu anlegen (für neue Karten)
export async function createExamSlot(payload: ExamSlotInsert) {
  const res = await apiFetch(`${API_URL}/office/exam-days/slot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("Fehler beim Hinzufügen des Slots", res.status);
    return { data: null, error: `Status: ${res.status}` };
  }
  return { data: await res.json(), error: null };
}

// 8. Status von StudentDataBox updaten
export async function updateExamSlotStatus(
  slotId: string,
  data: { status: string; notes?: string | null },
) {
  const res = await apiFetch(`${API_URL}/office/exam-slots/${slotId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.error("Fehler beim updaten des Slotstatuss", res.status);
    return { data: null, error: `Status: ${res.status}` };
  }
  return { data: await res.json(), error: null };
}
// 9. Schüleranzahl holen

export async function getStudentCount(instructorId: string) {
  const { data, error } = await supabase
    .from("student_instructors")
    .select("student_id")
    .eq("instructor_id", instructorId);

  if (error) {
    console.error("Fehler beim Laden der Schüler:", error);

    return {
      count: 0,
      error,
    };
  }

  const uniqueStudentIds = new Set(data.map((student) => student.student_id));

  return {
    count: uniqueStudentIds.size,
    error: null,
  };
}
