import { supabase } from "@/lib/supabase";

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
export async function createInstructor(instructor: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  teaching_classes: string[];
  role: string;
}) {
  // 1. Auth User erstellen
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: instructor.email,
    password: instructor.password,
    options: {
      data: {
        first_name: instructor.first_name,
        last_name: instructor.last_name,
        phone_number: instructor.phone_number,
        role: instructor.role,
      },
    },
  });

  if (authError) {
    return {
      data: null,
      error: authError,
    };
  }

  const userId = authData.user?.id;

  if (!userId) {
    return {
      data: null,
      error: new Error("User ID wurde nicht erstellt"),
    };
  }

  // Profil in instructors speichern
  const { data, error } = await supabase
    .from("instructors")
    .insert({
      id: userId,
      first_name: instructor.first_name,
      last_name: instructor.last_name,
      phone_number: instructor.phone_number,
      teaching_classes: instructor.teaching_classes,
      student_count: 0,
      role: instructor.role,
    })
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error,
    };
  }

  return {
    data,
    error: null,
  };
}

// Instructor bearbeiten (Update)
export async function updateInstructor(
  id: string,
  instructor: {
    first_name: string;
    last_name: string;
    phone_number: string | null;
    teaching_classes: string[];
  },
) {
  const { data, error } = await supabase
    .from("instructors")
    .update(instructor)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      data: null,
      error,
    };
  }

  return {
    data,
    error: null,
  };
}

// Instructor löschen
export async function deleteInstructor(id: string) {
  const { data, error } = await supabase.functions.invoke("delete-instructor", {
    body: {
      instructorId: id,
    },
  });

  if (error) {
    console.error("Edge Function Invoke Fehler:", error);

    return {
      data: null,
      error,
    };
  }

  if (data?.error) {
    console.error("Edge Function Logik-Fehler:", data.error);

    return {
      data: null,
      error: new Error(data.error),
    };
  }

  return {
    data,
    error: null,
  };
}

// Angenommene Fahrstunde

export async function getAcceptedLessonsByStudent(instructorId: string) {
  const { data, error } = await supabase
    .from("available_lessons")
    .select("*, driving_students(full_name)")
    .eq("instructor_id", instructorId)
    .eq("status", "vergeben");
  console.log(data);
  if (error) {
    console.error("Fehler beim Laden der Feedbacks:", error);
    return { data: null, error };
  }
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
  const { data, error } = await supabase
    .from("available_lessons")
    .update({
      lesson_date: lessonDate,
      lesson_time: lessonTime,
      duration_minutes: durationMinutes,
      license_class: licenseClass,
    })
    .eq("id", lessonId)
    .select("*, driving_students(*)")
    .single();

  if (error) {
    console.error("Fehler beim Bearbeiten der Fahrstunde:", error);
    return { data: null, error };
  }

  return { data, error: null };
}
