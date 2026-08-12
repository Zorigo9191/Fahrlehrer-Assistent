import { Button } from "@/components/button";
import Statuslight, { type Status } from "@/components/statusLights";
import {
  Zap,
  Pencil,
  Trash2,
  Clock,
  Car,
  Bike,
  Save,
  AlertTriangle,
  Ban,
  GraduationCap,
  UserRound,
  IdCard,
  MessageSquareText,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "../../components/input.tsx";
import {
  deleteExamSlot,
  updateExamSlot,
  createExamSlot,
} from "../officeDashBoard/officeService/OfficeService.ts";
import { toast } from "sonner";
import type { Database } from "@/types/database.types.ts";
import { getStudents } from "../studentDashBoard/studenDashboardService/StudentDashService.ts";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/command.tsx";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/popover.tsx";

type ExamSlots = Database["public"]["Tables"]["exam_slots"]["Row"];

const styles = {
  instructor: {
    text: "text-blue-700",
    border: "border-blue-700",
    hover: "hover:bg-blue-100",
  },
  office: {
    text: "text-orange-500",
    border: "border-orange-500",
    hover: "hover:bg-orange-100",
  },
  student: {
    text: "text-green-700",
    border: "border-green-700",
    hover: "hover:bg-green-100",
  },
};

type ExamCardProps = {
  role: "instructor" | "office" | "student";
  exam: ExamSlots;
  onChanged: () => void;
  date?: string;
};

type Student = {
  id: number;
  name: string;
};

const licenseClasses = [
  { value: "B197", type: "car" },
  { value: "B78", type: "car" },
  { value: "B", type: "car" },
  { value: "BE", type: "car" },
  { value: "AM", type: "bike" },
  { value: "A1", type: "bike" },
  { value: "A2", type: "bike" },
  { value: "A", type: "bike" },
];

export default function ExamCard({
  role,
  exam,
  onChanged,
  date,
}: ExamCardProps) {
  const [students, setStudents] = useState<Student[]>([]);

  // Der aktuell ausgewählte Schüler
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(
    exam.student_id && exam.student_name
      ? {
          id: exam.student_id,
          name: exam.student_name,
        }
      : null,
  );

  const [editing, setEditing] = useState(false);

  const [examAppointment, setExamAppointment] = useState(
    exam.exam_time ?? "08:00",
  );

  const [instructorName, setInstructorName] = useState(
    exam.instructor_name ?? "",
  );

  const [selectedClass, setSelectedClass] = useState(exam.license_class ?? "");

  const selectedLicense = licenseClasses.find(
    (license) => license.value === selectedClass,
  );

  // --------------------------------------------------
  // STUDENTS LADEN
  // --------------------------------------------------

  async function getStudentIdAndName() {
    const { data, error } = await getStudents();

    if (error) {
      console.error("Fehler beim Laden von Id und Name des Schülers", error);

      toast.warning("Fehler beim Laden von Id und Name des Schülers", {
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

    if (data) {
      setStudents(
        data.map((student) => ({
          id: student.student_id,
          name: student.student_name ?? "",
        })),
      );
    }
  }

  useEffect(() => {
    getStudentIdAndName();
  }, []);

  async function saveExam() {
    // ================================================
    // NEUEN PRÜFUNGSPLATZ ERSTELLEN
    // ================================================

    if (exam?.id?.startsWith("dummy-")) {
      const { error } = await createExamSlot({
        exam_day_id: exam.exam_day_id,
        exam_time: examAppointment || "08:00",
        student_appointment: examAppointment,
        student_id: selectedStudent?.id ?? null,
        student_name: selectedStudent?.name ?? "",
        instructor_name: instructorName,
        license_class: selectedClass,

        status: "gray",
      });

      if (error) {
        console.log("Fehler beim Erstellen des neuen Platzes:", error);

        toast.error("Fehler beim Erstellen des Prüfungsplatzes", {
          unstyled: true,
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          classNames: {
            toast:
              "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
            title: "text-red-500 text-sm font-medium",
            icon: "flex items-center justify-center",
          },
        });

        return;
      }

      toast.success("Prüfungsplatz erfolgreich erstellt", {
        unstyled: true,
        icon: <Save className="h-5 w-5 text-green-600" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-5 py-4 shadow-md",
          title: "text-green-600 text-sm font-medium",
        },
      });
    } else {
      if (!selectedStudent || !instructorName) {
        toast.warning("Bitte die Namen vollständig ausfüllen!", {
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

      // ================================================
      // BESTEHENDEN PRÜFUNGSPLATZ UPDATE
      // ================================================

      const { error } = await updateExamSlot(exam.id, {
        student_id: selectedStudent.id,
        student_appointment: examAppointment,
        student_name: selectedStudent.name,
        instructor_name: instructorName,
        license_class: selectedClass,
        status: "gray",
      });

      if (error) {
        console.error("Fehler beim Update:", error);

        toast.error("Fehler beim Speichern", {
          unstyled: true,
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          classNames: {
            toast:
              "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
            title: "text-red-500 text-sm font-medium",
            icon: "flex items-center justify-center",
          },
        });

        return;
      }

      toast.success("Erfolgreich gespeichert", {
        unstyled: true,
        icon: <Save className="h-5 w-5 text-green-600" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-5 py-4 shadow-md",
          title: "text-green-600 text-sm font-medium",
        },
      });
    }

    setEditing(false);
    onChanged();
  }

  // --------------------------------------------------
  // LÖSCHEN
  // --------------------------------------------------

  async function handleDelete() {
    if (exam?.id?.startsWith("dummy-")) {
      onChanged();
      return;
    }

    const { error } = await deleteExamSlot(exam.id);

    if (error) {
      console.error("Fehler beim Löschen:", error);

      toast.error("Fehler beim Löschen des Platzes", {
        unstyled: true,
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
          title: "text-red-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });

      return;
    }

    toast.success("Prüfungsplatz gelöscht", {
      unstyled: true,
      icon: <Trash2 className="h-5 w-5 text-red-600" />,
      classNames: {
        toast:
          "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
        title: "text-red-600 text-sm font-medium",
      },
    });

    onChanged();
  }

  // --------------------------------------------------
  // ABBRECHEN
  // --------------------------------------------------

  function handleCancel() {
    if (exam.id.startsWith("dummy-")) {
      onChanged();
      return;
    }

    setExamAppointment(exam.student_appointment ?? exam.exam_time ?? "08:00");

    setSelectedStudent(
      exam.student_id && exam.student_name
        ? {
            id: exam.student_id,
            name: exam.student_name,
          }
        : null,
    );

    setInstructorName(exam.instructor_name ?? "");

    setSelectedClass(exam.license_class ?? "B197");

    setEditing(false);
  }

  // --------------------------------------------------
  // JSX
  // --------------------------------------------------

  return (
    <div className="rounded-xl p-4 overflow-hidden bg-gray-100">
      {/* HEADER */}

      <div className="flex justify-between gap-2 mb-4">
        <div className="flex gap-2">
          <Zap className="text-yellow-500" size={20} />
          <h2 className={`text-lg font-bold ${styles[role].text}`}>Termin</h2>
          {/* Date kommt von examAppointment (getExamSlots) */}
          <span className="flex items-center text-lg font-bold">
            {new Date(date).toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
        <div>
          <Statuslight status={exam.status as Status} />
        </div>
      </div>

      {/* CONTENT */}

      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10 flex-wrap">
        {/* UHRZEIT + SCHÜLER */}

        <div className="flex flex-col md:flex-row md:items-center gap-4 font-bold">
          {/* UHRZEIT */}

          <div className="flex items-center gap-2">
            <label className={`${styles[role].text} text-sm font-bold`}>
              Uhr:
            </label>

            <Clock className={styles[role].text} size={18} />

            {editing ? (
              <Input
                value={examAppointment}
                onChange={(e) => setExamAppointment(e.target.value)}
                placeholder="Uhrzeit wählen"
                className="border rounded px-2 py-1 w-24 h-8"
              />
            ) : (
              <span>
                {exam.student_appointment || exam.exam_time || "08:00"}
              </span>
            )}
          </div>

          {/* SCHÜLER */}

          <div className="flex items-center gap-2 text-sm font-semibold">
            <UserRound className={styles[role].text} size={18} />

            <label className={styles[role].text}>Schüler:</label>

            {editing ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-52 justify-between h-8"
                  >
                    {selectedStudent?.name ?? "Schüler auswählen..."}

                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-52 p-0">
                  <Command>
                    <CommandInput placeholder="Schüler suchen..." />

                    <CommandList>
                      <CommandEmpty>Kein Schüler gefunden.</CommandEmpty>

                      <CommandGroup>
                        {students.map((student) => (
                          <CommandItem
                            key={student.id}
                            value={student.name}
                            onSelect={() => {
                              setSelectedStudent(student); // hier speichere den Schüler im State
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selectedStudent?.id === student.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />

                            {student.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            ) : (
              <span className="text-lg">{exam.student_name || "Frei"}</span>
            )}
          </div>
        </div>

        {/* FAHRLEHRER + KLASSE */}

        <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm font-semibold">
          {/* FAHRLEHRER */}

          <div className="flex items-center gap-2">
            <GraduationCap className={styles[role].text} size={18} />

            <label className={styles[role].text}>Fahrlehrer:</label>

            {editing ? (
              <Input
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                placeholder="FL-Kürzel"
                className="border rounded px-2 py-1 h-8 w-44"
              />
            ) : (
              <span className="flex gap-1 text-lg">
                {exam.instructor_name || "-"}
              </span>
            )}
          </div>

          {/* KLASSE */}

          <div className="flex items-center gap-2">
            <IdCard className={styles[role].text} size={18} />

            <label className={styles[role].text}>Klasse:</label>

            {editing ? (
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="rounded-md border border-slate-300 px-2 py-1 text-sm bg-white"
              >
                <option value="">-</option>

                {licenseClasses.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.value}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-lg">{exam.license_class || "-"}</span>
            )}

            {selectedLicense?.type === "bike" ? (
              <Bike className={styles[role].text} size={18} />
            ) : (
              <Car className={styles[role].text} size={18} />
            )}
          </div>
        </div>
      </div>

      {/* BUTTONS */}

      <div className="flex gap-2 mt-5 flex-wrap">
        {editing ? (
          <>
            <Button
              variant="ghost"
              onClick={saveExam}
              className={`h-8 w-52 px-3 text-sm border ${styles[role].border} ${styles[role].text} ${styles[role].hover}`}
            >
              <Save className="mr-2 h-4 w-4" />
              Speichern
            </Button>

            <Button
              variant="ghost"
              onClick={handleCancel}
              className="w-52 items-center gap-2 h-8 px-3 text-sm border border-red-500 text-red-500 hover:bg-red-100"
            >
              <Ban size={14} />
              Abbrechen
            </Button>
          </>
        ) : (
          role !== "student" && (
            <Button
              variant="ghost"
              onClick={() => setEditing(true)}
              className={`flex w-52 items-center gap-2 h-8 px-3 text-sm border ${styles[role].border} ${styles[role].text} ${styles[role].hover}`}
            >
              <Pencil size={14} />
              Bearbeiten
            </Button>
          )
        )}

        {role === "office" && (
          <Button
            variant="ghost"
            onClick={handleDelete}
            className="flex w-52 items-center gap-2 h-8 px-3 text-sm border border-red-500 text-red-600 hover:bg-red-200"
          >
            <Trash2 size={14} />
            Löschen
          </Button>
        )}
      </div>
      {/* BEMERKUNG */}

      <div className="flex gap-1">
        <MessageSquareText className={styles[role].text} size={18} />

        <label className={`${styles[role].text} text-sm font-bold`}>
          Bemerkung:
        </label>

        <span className="text-sm font-bold">
          {exam.notes || "......................."}
        </span>
      </div>
    </div>
  );
}
