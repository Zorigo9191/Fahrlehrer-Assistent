import { supabase } from "@/lib/supabase";

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
  });

  if (authError) {
    return {
      error: authError,
    };
  }

  const userId = authData.user?.id;

  if (!userId) {
    return {
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

  console.log("Insert data:", data);
  console.log("Insert error:", error);

  return {
    data,
    error,
  };
}
