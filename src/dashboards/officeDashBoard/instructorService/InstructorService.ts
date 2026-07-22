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

  // CORS-/Invocation-Fehler
  if (error) {
    console.error("Edge Function Invoke Fehler:", error);

    return {
      data: null,
      error,
    };
  }

  // Logischer Fehler aus der Edge Function selbst
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
