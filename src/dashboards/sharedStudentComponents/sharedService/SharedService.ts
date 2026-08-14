import { supabase } from "../../../lib/supabase.ts";
import type { Database } from "../../../types/database.types.ts";

type DrivingStudentInsert =
  Database["public"]["Tables"]["driving_students"]["Insert"];

type LicenseClassInsert =
  Database["public"]["Tables"]["student_license_classes"]["Insert"];

type StudentFeedInsert =
  Database["public"]["Tables"]["student_feedback"]["Insert"];

type DrivingStudentUpdate =
  Database["public"]["Tables"]["driving_students"]["Update"];

export async function createStudentWithLicenseClasses(
  studentData: DrivingStudentInsert,
  licenseClasses: string[],
) {
  //1.Schüler erstellen
  const { data: newStudent, error: studentError } = await supabase
    .from("driving_students")
    .insert(studentData)
    .select()
    .single();

  if (studentError) {
    return { data: null, error: studentError };
  }

  // schüler und instructor in die student_instructors Tabelle hinzufügen
  const { error: insertError } = await supabase
    .from("student_instructors")
    .insert({
      instructor_id: "6128533f-d2b2-4933-93c5-84bc619a11d5",
      student_id: newStudent.id,
      license_class: licenseClasses.join(","),
    })
    .select()
    .single();

  if (insertError) {
    return { data: null, error: insertError };
  }

  // Die ausgewählten Führerscheinklassen bekommen die ID des neu erstellten Schülers
  const categoriesPayload: LicenseClassInsert[] = licenseClasses.map(
    (license) => ({
      student_id: newStudent.id,
      license_class: license,
    }),
  );

  if (licenseClasses.length > 0) {
    const { data: licenseData, error: licenseError } = await supabase
      .from("student_license_classes")
      .insert(categoriesPayload) // <-- vorbereitete Klassen mit Schüler-ID speichern
      .select();

    if (licenseError) {
      return { data: null, error: licenseError };
    }

    return {
      data: {
        student: newStudent,
        licenses: licenseData,
      },
      error: null,
    };
  }
}

//******* Feedback speichern*******

export async function createStudentFeedbacks(payload: StudentFeedInsert) {
  const { data, error } = await supabase
    .from("student_feedback")
    .insert(payload)

    .select();

  if (error) {
    console.error("Fehler beim Anlegen des Feedbacks:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

//******* Feedback laden*******

export async function getFeedbacks(studentId: number) {
  const { data, count, error } = await supabase
    .from("student_feedback")
    .select("*, instructors(*)", {
      count: "exact",
    })
    .eq("student_id", studentId);

  if (error) {
    console.error("Fehler beim Laden der Feedbacks:", error);
    return {
      data: null,
      count: 0,
      error,
    };
  }

  return {
    data,
    count: count ?? 0,
    error: null,
  };
}

//******* Feedback update*******

export async function updateStudentFeedback(
  id: number,
  feedbackJsonString: string,
) {
  const { data, error } = await supabase
    .from("student_feedback")
    .update({ feedback: feedbackJsonString })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Fehler beim Aktualisieren des Feedbacks:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

// students Update

export async function updateStudentsData(
  studentId: number,
  payload: DrivingStudentUpdate,
) {
  const { data, error } = await supabase
    .from("driving_students")
    .update(payload)
    .eq("id", studentId)
    .select();

  if (error) {
    console.error("Fehler beim Aktualisieren des Feedbacks:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

// Delete Student für Fahrlehrer

export async function DeleteStudent(studentId: number) {
  const { data, error } = await supabase
    .from("driving_students")
    .delete()
    .eq("id", studentId);

  if (error) {
    console.error("Fehler beim Löschen des Studenten:", error);
    return { data: null, error };
  }
  return { data, error: null };
}
