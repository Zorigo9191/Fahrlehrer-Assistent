import { supabase, tempAuthsupabase } from "../../../lib/supabase.ts";
import type { Database } from "../../../types/database.types.ts";

// type DrivingStudentInsert =
//   Database["public"]["Tables"]["driving_students"]["Insert"];

type LicenseClassInsert =
  Database["public"]["Tables"]["student_license_classes"]["Insert"];

type StudentFeedInsert =
  Database["public"]["Tables"]["student_feedback"]["Insert"];

type DrivingStudentUpdate =
  Database["public"]["Tables"]["driving_students"]["Update"];

// export async function createStudentWithLicenseClasses(student: {
//   studentData: DrivingStudentInsert;
//   licenseClasses: string[];
//   full_name: string;
//   email: string;
// }) {
// const { data: authStudent, error: authStudentError } = await supabase.auth.signUp({
//   email: student.email,
//   password: "ein-sicheres-passwort",
//   options: {
//     data: {
//       full_name: student.full_name,
//     }
//   }
// });
//   console.log(authStudent);
//   if (authStudentError) {
//     return {
//       data: null,
//       error: authStudentError,
//     };
//   }

//   const userId = authStudent.user?.id;

//   if (!userId) {
//     return {
//       data: null,
//       error: new Error("User ID wurde nicht erstellt"),
//     };
//   }

//   const { data: newStudent, error: studentError } = await supabase
//     .from("driving_students")
//     .insert({ id: userId, full_name: student.full_name, email: student.email })
//     .select()
//     .single();

//   if (studentError) {
//     return { data: null, error: studentError };
//   }

//   // schüler und instructor in die student_instructors Tabelle hinzufügen
//   const { error: insertError } = await supabase
//     .from("student_instructors")
//     .insert({
//       instructor_id: "6128533f-d2b2-4933-93c5-84bc619a11d5",
//       student_id: newStudent.id,
//       license_class: student.licenseClasses.join(","),
//     })
//     .select()
//     .single();

//   if (insertError) {
//     return { data: null, error: insertError };
//   }

//   // Die ausgewählten Führerscheinklassen bekommen die ID des neu erstellten Schülers
//   const categoriesPayload: LicenseClassInsert[] = student.licenseClasses.map(
//     (license) => ({
//       student_id: newStudent.id,
//       license_class: license,
//     }),
//   );

//   if (student.licenseClasses.length > 0) {
//     const { data: licenseData, error: licenseError } = await supabase
//       .from("student_license_classes")
//       .insert(categoriesPayload) // <-- vorbereitete Klassen mit Schüler-ID speichern
//       .select();

//     if (licenseError) {
//       return { data: null, error: licenseError };
//     }

//     return {
//       data: {
//         student: newStudent,
//         licenses: licenseData,
//       },
//       error: null,
//     };
//   }
// }

export async function createStudentWithLicenseClasses(
  student: {
    full_name: string;
    email: string;
    password: string;
    instructorId: string;
  },
  licenseClasses: string[],
) {
  const { instructorId } = student;
  // 1. Auth-User erstellen mit E-Mail und Passwort
  const { data: authStudent, error: authStudentError } =
    await tempAuthsupabase.auth.signUp({
      email: student.email,
      password: student.password,
      options: {
        data: {
          full_name: student.full_name,
        },
      },
    });

  if (authStudentError) {
    console.error("Supabase signUp Fehler:", {
      message: authStudentError.message,
      status: authStudentError.status,
      name: authStudentError.name,
    });

    return {
      data: null,
      error: authStudentError,
    };
  }

  const userId = authStudent.user?.id;

  if (!userId) {
    return {
      data: null,
      error: new Error("User ID wurde nicht erstellt"),
    };
  }

  // 2. In driving_students Tabelle einfügen
  const { data: newStudent, error: studentError } = await supabase
    .from("driving_students")
    .insert({
      id: userId,
      full_name: student.full_name,
      email: student.email,
    })
    .select();
  console.log(newStudent, studentError);
  if (studentError) {
    return { data: null, error: studentError };
  }

  // 3. Schüler und Instructor in student_instructors hinzufügen
  const { error: insertError } = await supabase
    .from("student_instructors")
    .insert({
      instructor_id: instructorId,
      student_id: newStudent?.[0]?.id,
      license_class: licenseClasses.join(","),
    });
  console.log(insertError);
  if (insertError) {
    return { data: null, error: insertError };
  }

  // 4. Führerscheinklassen speichern
  const categoriesPayload: LicenseClassInsert[] = licenseClasses.map(
    (license) => ({
      student_id: newStudent?.[0]?.id,
      license_class: license,
    }),
  );

  if (licenseClasses.length > 0) {
    const { data: licenseData, error: licenseError } = await supabase
      .from("student_license_classes")
      .insert(categoriesPayload)
      .select();
    console.log(licenseError);
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

  return {
    data: {
      student: newStudent,
      licenses: [],
    },
    error: null,
  };
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

export async function getFeedbacks(studentId: string) {
  if (!studentId) {
    return;
  }
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
  studentId: string,
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

export async function DeleteStudent(studentId: string) {
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
