import { apiFetch } from "../../../lib/apiFetch.ts";
import { supabase } from "../../../lib/supabase.ts";
import type { Database } from "../../../types/database.types.ts";

type StudentFeedInsert = Pick<
  Database["public"]["Tables"]["student_feedback"]["Insert"],
  "feedback" | "license_class" | "student_id" | "created_at"
> & { student_id: string };

type FeedbackRow = Database["public"]["Tables"]["student_feedback"]["Row"] & {
  instructors: { id: string; first_name: string } | null;
};

///////// SchülerAcc neu erstellen und dem FL hinzufügen ////////////

export async function createStudentWithLicenseClasses(
  student: {
    full_name: string;
    email: string;
    password: string;
  },
  licenseClasses: string[],
) {
  const res = await apiFetch(`/students/createStudent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: student.full_name,
      email: student.email,
      password: student.password,
      license_classes: licenseClasses,
    }),
  });

  if (res.status === 409) {
    return {
      data: null,
      error: { code: "23505", message: "Schüler existiert bereits" },
    };
  }

  if (!res.ok) {
    return {
      data: null,
      error: new Error("Schüler konnte nicht angelegt werden"),
    };
  }

  const data = await res.json();
  return { data: { student: data, license: [] }, error: null };
}

//////// Feedback speichern //////////

export async function createStudentFeedbacks(payload: StudentFeedInsert) {
  const res = await apiFetch(`/student/${payload.student_id}/feedback`, {
    method: "POST",

    body: JSON.stringify({
      feedback: payload.feedback,
      license_class: payload.license_class,
      created_at: payload.created_at,
    }),
  });

  if (!res.ok) {
    return {
      data: null,
      error: new Error("Feedback konnte nicht angelegt werden"),
    };
  }

  return await res.json();
}

//////////// Instructor get feedbacks ///////////////

export async function getFeedbacks(studentId: string) {
  if (!studentId) {
    return {
      data: [],
      count: 0,
      error: null,
    };
  }

  const res = await apiFetch(`/student/${studentId}/feedback`);

  if (!res.ok) {
    console.error("Fehler beim Laden der Feedbacks: ", res.status);
    return {
      data: null,
      count: 0,
      error: new Error("Feedbacks konnte nicht geladen werden"),
    };
  }
  return await res.json();
}

///////// student get feedbacks ////////////

export async function studentGetFeedbacks(): Promise<{
  data: FeedbackRow[] | null;
  count: number;
  error: unknown;
}> {
  const res = await apiFetch(`/student/feedbacks`);

  if (!res.ok) {
    console.error("Fehler beim Laden der Feedbacks: ", res.status);
    return {
      data: null,
      count: 0,
      error: new Error("Deine Feedbacks konnte nicht geladen werden"),
    };
  }
  const data = await res.json();
  return { data, count: data.length, error: null };
}

/////////// Feedback update /////////////

export async function updateStudentFeedback(
  studentId: string,
  id: number,
  feedbackJsonString: string,
) {
  const res = await apiFetch(`/student/${studentId}/feedback/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ feedback: feedbackJsonString }),
  });

  if (!res.ok) {
    console.error("Fehler beim updaten des Feedbacks", res.status);
    return { data: null, error: `Status: ${res.status}` };
  }
  return { data: await res.json(), error: null };
}

export async function updateStudent(
  studentId: string,
  payload: {
    full_name?: string;
    email?: string;
    instructor_id?: string;
    license_classes?: string[];
  },
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { data: null, error: new Error("Nicht eingeloggt") };

  const res = await apiFetch(`/students/${studentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return {
      data: null,
      error: new Error(
        body?.message ?? "Schüler konnte nicht gespeichert werden",
      ),
    };
  }
  return { data: await res.json(), error: null };
}

///////////// Delete Student für Fahrlehrer ////////////////

export async function deleteStudent(studentId: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return { error: new Error("Nicht eingeloggt") };

  const res = await apiFetch(`/students/${studentId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session.access_token}` },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return {
      error: new Error(body?.message ?? "Schüler konnte nicht gelöscht werden"),
    };
  }
  return { error: null };
}
