import { Button } from "@/components/button";
import {
  Users,
  Pencil,
  Trash2,
  Car,
  X,
  Plus,
  MessageSquareQuote,
  ExternalLink,
  Bike,
  Ban,
  Save,
  AlertTriangle,
  CircleCheck,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import StudentRegisterForm from "./StudentRegisterForm";
import FeedbackForm from "./FeedbackForm";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { supabase } from "../../lib/supabase.ts";
import type { Database } from "../../types/database.types.ts";
import FeedbackCards from "./FeedbackCards.tsx";
import {
  updateStudentsData,
  DeleteStudent,
} from "./sharedService/SharedService.ts";
import { toast } from "sonner";
import { AuthContext } from "../../context/AuthContext.tsx";

type StudentWithLicenses = {
  feedback_count: number;
  id: number;
  driving_students: {
    created_at: string | null;
    driving_classes: string | null;
    email: string;
    full_name: string;
    id: string;
    avatar_url: string | null;
    student_feedback: {
      created_at: string | null;
      feedback: string;
      id: number;
      instructor_id: string;
      license_class: string;
      read_at: boolean | null;
      student_id: string | null;
    }[];
    student_license_classes: {
      id: number;
      license_class: string;
      student_id: string | null;
    }[];
  };
};

type StudentListProps = {
  setActiveTab: (tab: string) => void;
  instructorName: string;
};

type DrivingStudentUpdate =
  Database["public"]["Tables"]["driving_students"]["Update"] & {
    bike_license?: string;
    car_license?: string;
  };

const bikeCategories = [
  { value: "AM", type: "bike" },
  { value: "A1", type: "bike" },
  { value: "A2", type: "bike" },
  { value: "A", type: "bike" },
];

const carCategories = [
  { value: "B197", type: "car" },
  { value: "B78", type: "car" },
  { value: "B", type: "car" },
  { value: "BE", type: "car" },
];

export default function StudentList({
  setActiveTab,
  instructorName,
}: StudentListProps) {
  const [showRegister, setShowRegister] = useState(false);
  const [feedbackGive, setFeedbackGive] = useState(false);
  const [feedbackView, setFeedbackView] = useState(false);
  const [students, setStudents] = useState<StudentWithLicenses[]>([]);
  const [studentId, setStudentId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  const [studentFormData, setStudentFormData] = useState<DrivingStudentUpdate>(
    {},
  );

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { session } = useContext(AuthContext);
  const instructorId = session?.user?.id;

  async function fetchStudents() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("student_instructors")
        .select(
          `
    id,
    driving_students(*, student_feedback(*), student_license_classes(*))
  `,
        )
        .eq("instructor_id", instructorId);

      console.log(data);

      if (error) {
        console.error("Fehler beim Laden:", error);
        toast.warning("Fehler beim Laden", {
          unstyled: true,
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
          classNames: {
            toast:
              "flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-4 shadow-md",
            title: "text-yellow-500 text-sm font-medium",
            icon: "flex items-center justify-center",
          },
        });
      } else if (data) {
        const studentsWithCount = data.map((student) => ({
          ...student,
          feedback_count:
            student.driving_students.student_feedback?.length ?? 0,
        }));
        setStudents(studentsWithCount);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStartEditStudent = (student: StudentWithLicenses) => {
    setEditingStudentId(student.driving_students.id);

    const bikeValues = bikeCategories.map((c) => c.value);
    const carValues = carCategories.map((c) => c.value);

    // Filtert die vorhandenen Klassen des Schülers heraus
    const currentBike =
      student.driving_students.student_license_classes?.find((l) =>
        bikeValues.includes(l.license_class),
      )?.license_class || "";

    const currentCar =
      student.driving_students.student_license_classes?.find((l) =>
        carValues.includes(l.license_class),
      )?.license_class || "";

    setStudentFormData({
      full_name: student.driving_students.full_name,
      email: student.driving_students.email,
      bike_license: currentBike,
      car_license: currentCar,
    });
  };

  const handleStudentChange = (
    field: keyof DrivingStudentUpdate,
    value: string,
  ) => {
    setStudentFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveStudent = async (id: string) => {
    setLoading(true);

    // Trennt die temporären Klassen-Felder von den echten Tabellenspalten ab
    const { bike_license, car_license, ...studentFieldsToUpdate } =
      studentFormData;

    // Stammdaten  in der Tabelle "driving_students" aktualisieren
    const { error: studentError } = await updateStudentsData(
      id,
      studentFieldsToUpdate,
    );

    if (studentError) {
      console.error("Fehler beim Speichern des Schülers:", studentError);

      toast.warning("Fehler beim Speichern des Schülers", {
        unstyled: true,
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-4 shadow-md",
          title: "text-yellow-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });

      setLoading(false);
      return;
    }

    //  Alte Klassen des Schülers in der Zwischentabelle löschen
    await supabase
      .from("student_license_classes")
      .delete()
      .eq("student_id", id);

    //  Neu ausgewählte Klassen in die Zwischentabelle eintragen
    const newClassesToInsert = [];
    if (bike_license) {
      newClassesToInsert.push({ student_id: id, license_class: bike_license });
    }
    if (car_license) {
      newClassesToInsert.push({ student_id: id, license_class: car_license });
    }

    if (newClassesToInsert.length > 0) {
      await supabase.from("student_license_classes").insert(newClassesToInsert);
    }

    // Bearbeitungsmodus beenden und Liste frisch von der Datenbank laden
    setEditingStudentId(null);
    await fetchStudents();
    setLoading(false);
  };

  const handleDeleteStudent = async (student: StudentWithLicenses) => {
    const { error } = await DeleteStudent(student.driving_students.id);

    if (error) {
      console.error("Fehler beim Löschen des Schülers:", error);

      toast.warning("Schüler konnte nicht gelöscht werden", {
        unstyled: true,
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-4 shadow-md",
          title: "text-yellow-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });

      return;
    }

    setStudents((prev) => prev.filter((s) => s.id !== student.id));

    toast.success("Schüler wurde erfolgreich gelöscht", {
      unstyled: true,
      icon: <CircleCheck className="h-5 w-5 text-red-400" />,
      classNames: {
        toast:
          "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
        title: "text-red-500 text-sm font-medium",
        icon: "flex items-center justify-center",
      },
    });

    setLoading(true);
  };

  return (
    <div className="flex flex-col w-full min-h-screen max-w-3xl mx-auto gap-6 py-6 bg-app-surface overflow-x-hidden">
      {/* Header */}
      <div className="flex gap-1 w-full bg-blue-700 py-2 px-3 rounded-xl text-white">
        <div className="flex items-center w-full justify-between gap-2">
          <h2 className="text-sm text-slate-200 font-bold flex items-center gap-2 p-3">
            <Users size={22} />
            Schülerliste
          </h2>
          <p className="text-sm font-semibold">Fahrlehrer - {instructorName}</p>
        </div>
      </div>

      <div className="flex justify-between gap-2">
        <Button
          variant="ghost"
          onClick={() => setShowRegister(true)}
          className="flex w-52 items-center gap-2 h-8 px-3 text-xs  text-blue-700 hover:bg-blue-700 hover:text-slate-200 font-bold border border-slate-200 transition"
        >
          <Plus />
          Schüler hinzufügen
        </Button>

        {showRegister && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="relative w-full max-w-md rounded-xl bg-app-elevated p-6 shadow-2xl">
              <Button
                variant="ghost"
                onClick={() => setShowRegister(false)}
                className="absolute cursor-pointer right-3 top-2 text-gray-500 hover:text-slate-200"
              >
                <X />
              </Button>

              <StudentRegisterForm
                onClose={() => {
                  setShowRegister(false);
                  setShowDeleteDialog(false);
                  fetchStudents();
                }}
              />
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center gap-2 h-8 px-3 text-xs  text-blue-700 hover:bg-blue-700 hover:text-slate-200 font-bold border border-slate-200 transition"
        >
          <X />
          schließen
        </Button>
      </div>

      {loading && <p className="text-center text-gray-500">Lade Schüler...</p>}

      {!loading && students.length === 0 && (
        <p className="text-center text-gray-500">Keine Schüler gefunden.</p>
      )}

      {/* Schüler Karten durchgehen und anzeigen */}
      {!loading &&
        students.map((student) => {
          const formattedDate = new Date(
            student.driving_students.created_at,
          ).toLocaleDateString("de-DE");

          // Prüft, ob genau DIESER Schüler gerade bearbeitet wird
          const isEditing = editingStudentId === student.driving_students.id;

          const licenseClassesText =
            student.driving_students.student_license_classes
              ?.map((l) => l.license_class)
              .join(", ") || "Keine Klasse";

          return (
            <div
              key={student.id}
              className="rounded-xl border border-blue-700 p-4"
            >
              {/* OBERER BEREICH */}
              <div className="flex items-start gap-4 mb-4 justify-between">
                <div className="flex gap-3 items-start w-full">
                  <Avatar className="h-20 w-20 border-2 border-gray-800 bg-gray-200 shrink-0">
                    <AvatarImage
                      src={student.driving_students.avatar_url || ""}
                    />
                    <AvatarFallback>
                      <Plus className="text-white" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-2 w-full">
                    {/* Name-Bereich */}
                    <div className="flex text-sm gap-2 text-slate-200  w-full">
                      <label className="text-xs text-blue-700">Name:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={studentFormData.full_name || ""}
                          onChange={(e) =>
                            handleStudentChange("full_name", e.target.value)
                          }
                          className="border p-1 rounded font-normal text-slate-200 text-xs w-60"
                        />
                      ) : (
                        <h3 className="text-xs  ">
                          {student.driving_students.full_name}
                        </h3>
                      )}
                    </div>

                    {/* E-Mail-Bereich */}
                    <div className="flex gap-2 text-blue-700 w-full">
                      <label className="text-xs">Email:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={studentFormData.email || ""}
                          onChange={(e) =>
                            handleStudentChange("email", e.target.value)
                          }
                          className="border p-1 rounded font-normal text-slate-200 text-xs w-60"
                        />
                      ) : (
                        <p className="text-xs text-slate-200 font-normal">
                          {student.driving_students.email}
                        </p>
                      )}
                    </div>

                    <span className="text-xs text-slate-200 mt-1">
                      wurde am <strong>{formattedDate}</strong> hinzugefügt.
                    </span>
                  </div>
                </div>

                {/* Feedback-Icon Button  */}
                <div className="flex flex-col items-end gap-1 shrink-0 ">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setFeedbackView(true);
                      setStudentId(student.driving_students.id);
                    }}
                    className="border border-blue-700 text-blue-700 hover:bg-blue-100 h-8 w-8 p-0"
                  >
                    <ExternalLink size={16} />
                  </Button>
                  <span className="text-xs text-slate-200 ">
                    Feedbacks: <strong>{student.feedback_count}</strong>
                  </span>
                </div>
              </div>

              {/* BEREICH: Führerscheinklassen  */}
              <div className="flex items-center justify-between text-sm text-slate-200 border-t pt-3 mt-3">
                {isEditing ? (
                  <div className="flex gap-4 items-center ">
                    {/* Bike Dropdown */}
                    <div className="flex items-center gap-2 ">
                      <Bike className="text-blue-700" size={16} />
                      <select
                        value={studentFormData.bike_license || ""}
                        onChange={(e) =>
                          handleStudentChange("bike_license", e.target.value)
                        }
                        className="rounded-sm w-16 border text-slate-200 border-slate-200 px-1 py-1 text-xs outline-none bg-app-surface "
                      >
                        <option value="">-</option>
                        {bikeCategories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.value}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Car Dropdown */}
                    <div className="flex items-center gap-2">
                      <Car className="text-blue-700" size={16} />
                      <select
                        value={studentFormData.car_license || ""}
                        onChange={(e) =>
                          handleStudentChange("car_license", e.target.value)
                        }
                        className="rounded-sm border text-slate-200 border-slate-200 px-2 py-1 text-xs outline-none bg-app-surface"
                      >
                        <option value="">-</option>
                        {carCategories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <Car size={16} className="text-blue-700" />
                    <Bike size={16} className="text-blue-700" />
                    <span className="flex gap-1 text-slate-200 text-xs ">
                      Klassen:
                      <p>{licenseClassesText}</p>
                    </span>
                  </div>
                )}
              </div>

              {/* BEREICH: Buttons  */}
              {isEditing ? (
                <div className="flex gap-2 mt-4 justify-start ">
                  <Button
                    variant="ghost"
                    onClick={() => setEditingStudentId(null)}
                    className="flex items-center gap-2 h-8 px-4 text-xs border border-slate-200 text-slate-200 hover:bg-slate-600 w-32"
                  >
                    <Ban size={14} /> Abbrechen
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleSaveStudent(student.driving_students.id);
                    }}
                    className="flex items-center justify-center gap-2 h-8 px-4 text-xs border border-slate-200 text-blue-700 hover:bg-blue-700 hover:text-slate-200 w-32"
                  >
                    <Save size={14} /> Speichern
                  </Button>
                </div>
              ) : (
                // Standard-Buttons im normalen Ansichtsmodus
                <div className="flex gap-2 mt-4 flex-wrap">
                  <Button
                    variant="ghost"
                    onClick={() => handleStartEditStudent(student)}
                    className="flex w-52 items-center gap-2 h-8 px-3 text-xs border border-slate-200 text-blue-700 hover:bg-blue-700 hover:text-slate-200"
                  >
                    <Pencil size={14} />
                    Bearbeiten
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setFeedbackGive(true);
                      setStudentId(student.driving_students.id);
                    }}
                    className="flex w-52 items-center gap-2 h-8 px-3 text-xs  border border-slate-200 text-blue-700 hover:bg-blue-700 hover:text-slate-200"
                  >
                    <MessageSquareQuote size={14} />
                    Feedback geben
                  </Button>

                  <Button
                    variant="ghost"
                    className="flex w-52 items-center gap-2 h-8 px-3 text-xs  border border-slate-200 text-red-500 hover:bg-red-500 hover:text-slate-200"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 size={14} />
                    Löschen
                  </Button>
                </div>
              )}
              {/* 
              Dialog Fenster für SchülerLöschung */}
              {showDeleteDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className=" rounded-xl shadow-lg p-6 w-80 bg-app-elevated">
                    <h2 className="text-sm flex justify-center text-blue-700 font-bold">
                      Schüler löschen?
                    </h2>

                    <p className="text-xs text-slate-200 mt-2">
                      Möchtest du diesen Schüler wirklich entfernen?
                    </p>
                    <div className="flex gap-3 mt-5">
                      <Button
                        variant="ghost"
                        onClick={() => setShowDeleteDialog(false)}
                        className="flex-1 border text-xs border-slate-200 text-slate-200 hover:bg-slate-600"
                      >
                        <Ban />
                        Abbrechen
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteStudent(student)}
                        className="flex-1 text-xs border border-slate-200 text-red-500 hover:bg-red-500 hover:text-slate-200"
                      >
                        <Trash2 size={14} />
                        Löschen
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

      {/*  Anzeigen von Feedbacks */}
      {feedbackView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 overflow-y-auto p-4 ">
          <div className="relative w-md min-h-15 max-h-[90vh] overflow-y-auto scrollbar-none rounded-xl bg-app-elevated p-6 shadow-2xl">
            <Button
              variant="ghost"
              onClick={() => setFeedbackView(false)}
              className=" absolute right-1 top-3 text-slate-200 hover:cursor-pointer"
            >
              <X />
            </Button>{" "}
            <FeedbackCards studentId={studentId} />
          </div>
        </div>
      )}

      {/*  das Erstellen eines Feedbacks */}
      {feedbackGive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 overflow-y-auto  p-4 ">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-none rounded-xl  bg-app-elevated p-6 shadow-2xl">
            <Button
              variant="ghost"
              onClick={() => setFeedbackGive(false)}
              className=" absolute right-4 top-3 text-slate-200 cursor-pointer p-1"
            >
              <X />
            </Button>

            <FeedbackForm
              studentId={studentId}
              onClose={() => {
                setFeedbackGive(false);
                fetchStudents();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
