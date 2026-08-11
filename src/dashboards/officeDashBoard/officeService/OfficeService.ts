import { supabase } from "@/lib/supabase";
import type { Database } from "../../../types/database.types.ts";

type ExamDayRow = Database["public"]["Tables"]["exam_days"]["Row"];
type ExamDayInsert = Database["public"]["Tables"]["exam_days"]["Insert"];
type ExamDayUpdate = Database["public"]["Tables"]["exam_days"]["Update"];

type ExamSlotRow = Database["public"]["Tables"]["exam_slots"]["Row"];
type ExamSlotInsert = Database["public"]["Tables"]["exam_slots"]["Insert"];
type ExamSlotUpdate = Database["public"]["Tables"]["exam_slots"]["Update"];

export type ExamDayWithSlots = ExamDayRow & {
  exam_slots: ExamSlotRow[];
};

// 1. Alle Prüfungsdaten ink. ihrer verknüpften Slots abrufen
export async function getExamDays() {
  const { data, error } = await supabase
    .from("exam_days")
    .select(`*, exam_slots(*)`)
    .order("exam_date", { ascending: true })
    .order("student_appointment", {
      referencedTable: "exam_slots",
      ascending: true,
    });
  if (error) {
    console.error("Fehler beim Laden der Prüfungen:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

// 2. Einen neuen Prüfungstermin erstellen
export async function createExamDay(payload: ExamDayInsert) {
  const { data, error } = await supabase
    .from("exam_days")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("Fehler beim Erstellen des Termins:", error);
    return { data: null, error };
  }

  await createDefaultExamSlots(data.id, data.slots);

  return { data, error: null };
}

// 3. Ein gesamtes Prüfungsdatum löschen
export async function deleteExamDay(dayId: string) {
  const { error } = await supabase.from("exam_days").delete().eq("id", dayId);

  if (error) {
    console.error("Fehler beim Löschen des Datums:", error);
    return { error };
  }

  return { error: null };
}

//4. Prüfungsdatum und Klassen updaten

export async function updateExamDate(dayId: string, payload: ExamDayUpdate) {
  const { data, error } = await supabase
    .from("exam_days")
    .update(payload)
    .eq("id", dayId)
    .select()
    .single();

  if (error) {
    console.error("Fehler beim Aktualisieren:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

// 5. Einen einzelnen Prüfungsslot aktualisieren. (Schüler, Flehrer, Klasse)

export async function updateExamSlot(id: string, payload: ExamSlotUpdate) {
  const { data, error } = await supabase
    .from("exam_slots")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Fehler beim Aktualisieren des Slots:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

// 6. Einzelnen Slot Löschen.

export async function deleteExamSlot(id: string) {
  const { error } = await supabase.from("exam_slots").delete().eq("id", id);

  if (error) {
    console.error("Fehler beim Löschen des Slots:", error);
    return { error };
  }
  return { error: null };
}

// 7. Standart Termine für einen neuen Tag generieren(im 55 Minuten Takt)

export async function createDefaultExamSlots(examDayId: string, slots: number) {
  const defaultTimes = [
    "08:00",
    "08:55",
    "09:50",
    "10:45",
    "11:40",
    "12:35",
    "13:30",
    "14:25",
  ];

  const slotsToInsert: ExamSlotInsert[] = [];

  for (let i = 0; i < slots; i++) {
    slotsToInsert.push({
      exam_day_id: examDayId,
      exam_time: defaultTimes[i],
      student_appointment: defaultTimes[i],
      student_name: null,
      instructor_name: null,
      license_class: "",
      status: "gray",
      student_id: null,
    });
  }

  const { data, error } = await supabase
    .from("exam_slots")
    .insert(slotsToInsert)
    .select();

  if (error) {
    console.log("Fehler beim Erstellen der Default-slots", error);
    return { data: null, error };
  }
  return { data, error: null };
}

// 8. Einen einzelnen Prüfungsslot neu anlegen (für neue Karten)
export async function createExamSlot(payload: ExamSlotInsert) {
  const { data, error } = await supabase
    .from("exam_slots")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("Fehler beim Erstellen des Slots:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

// 9. Status von StudentDataBox updaten
export async function updateExamSlotStatus(slotId: string, newStatus: string) {
  const { data, error } = await supabase
    .from("exam_slots")
    .update({ status: newStatus })
    .eq("id", slotId);

  return { data, error };
}
