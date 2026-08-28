import { supabase, tempAuthsupabase } from "../../../lib/supabase.ts";
import type { Database } from "../../../types/database.types.ts";

type LicenseClassInsert =
  Database["public"]["Tables"]["student_license_classes"]["Insert"];

type StudentFeedInsert =
  Database["public"]["Tables"]["student_feedback"]["Insert"];

type DrivingStudentUpdate =
  Database["public"]["Tables"]["driving_students"]["Update"];

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
  if (!instructorId)
    return { data: null, error: new Error("Keine Instructor-ID vorhanden") };
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

    if (authStudentError.message === "User already registered") {
      const { data: existingStudent, error: studentError } = await supabase
        .from("driving_students")
        .select("id, email")
        .eq("email", student.email)
        .maybeSingle();

      if (studentError) {
        console.error(
          "Fehler beim Suchen des bestehenden Schülers:",
          studentError,
        );
        return {
          data: null,
          error: studentError,
        };
      }

      if (!existingStudent) {
        console.error(
          "Auth-User existiert, aber kein driving_student gefunden.",
        );

        return {
          data: null,
          error: new Error(
            "User existiert bereits, aber kein Schüler-Datensatz wurde gefunden.",
          ),
        };
      }

      const studentId = existingStudent.id;

      const { error: instructorError } = await supabase
        .from("student_instructors")
        .insert({
          instructor_id: instructorId,
          student_id: studentId,
          license_class: licenseClasses.join(","),
        });

      if (instructorError) {
        console.error(
          "Fehler beim Eintragen des Schülers in student_instructors:",
          instructorError,
        );

        return {
          data: null,
          error: instructorError,
        };
      }

      return {
        data: {
          student: existingStudent,
        },
        error: null,
      };
    }

    return {
      data: null,
      error: authStudentError,
    };
  }
  // Suche anhand von email in driving student den Studen und die ID

  // Füge zu student_instructors einen neue Zeile hinzu mit instructor ID und gesuchter student id

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
    return {
      data: [],
      count: 0,
      error: null,
    };
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
