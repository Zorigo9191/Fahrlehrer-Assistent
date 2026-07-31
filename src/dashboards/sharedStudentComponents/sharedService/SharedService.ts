import { supabase } from "../../../lib/supabase.ts";
import type { Database } from "../../../types/database.types.ts";

// type DrivingStudentRow =
//   Database["public"]["Tables"]["driving_students"]["Row"];

type DrivingStudentInsert =
  Database["public"]["Tables"]["driving_students"]["Insert"];

// type DrivingStudentUpdate =
//   Database["public"]["Tables"]["driving_students"]["Update"];

type LicenseClassInsert =
  Database["public"]["Tables"]["student_license_classes"]["Insert"];

type StudentFeedInsert =
  Database["public"]["Tables"]["student_feedback"]["Insert"];

// ******* neue Schüler hinzufügen *******
// export async function createDrivingStudents(payload: DrivingStudentInsert) {
//   const { data, error } = await supabase
//     .from("driving_students")
//     .insert(payload)
//     .select()
//     .single();

//   if (error) {
//     console.error("Fehler beim Anlegen des Schülerkontos:", error);

//     if (error.code === "23505") {
//       return {
//         data: null,
//         error: "EMAIL_EXISTS",
//       };
//     }

//     return { data: null, error };
//   }

//   return { data, error: null };
// }

//******* FührerscheinKlasse holen *******
// export async function createStudentLicenseClass(payload: LicenseClassInsert[]) {
//   const { data, error } = await supabase
//     .from("student_license_classes")
//     .insert(payload)
//     .select();

//   if (error) {
//     console.error("Fehler beim Anlegen der Führerscheinklasse:", error);
//     return { data: null, error };
//   }
//   return { data, error: null };
// }

// Schüler erstellen mit Name und Führerscheinklassen

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

//******* Feedback speichern*******

// export async function createStudentFeedbacks(payload: StudentFeedInsert) {
//   const { data, error } = await supabase
//     .from("student_feedback")
//     .insert(payload)
//     .select();

//   if (error) {
//     console.error("Fehler beim Anlegen des Feedbacks:", error);
//     return { data: null, error };
//   }
//   return { data, error: null };
// }
