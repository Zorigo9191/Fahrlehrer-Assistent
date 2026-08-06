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
} from "lucide-react";
import { useState } from "react";

import { Input } from "../../components/input.tsx";
import {
  deleteExamSlot,
  updateExamSlot,
  createExamSlot,
} from "../officeDashBoard/officeService/OfficeService.ts";
import { toast } from "sonner";
import type { Database } from "@/types/database.types.ts";

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
};

type ExamCardProps = {
  color: "instructor" | "office";
  exam: ExamSlots;
  onChanged: () => void;
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

export default function ExamCard({ color, exam, onChanged }: ExamCardProps) {
  console.log(exam);
  const [editing, setEditing] = useState(false);
  const [examAppointment, setExamAppointment] = useState(
    exam.exam_time ?? "08:00",
  );
  const [studentName, setStudentName] = useState(exam.student_name ?? "");
  const [instructorName, setInstructorName] = useState(
    exam.instructor_name ?? "",
  );
  const [selectedClass, setSelectedClass] = useState(
    exam.license_class ?? "B197",
  );

  const selectedLicense = licenseClasses.find(
    (license) => license.value === selectedClass,
  );

  async function saveExam() {
    if (exam?.id?.startsWith("dummy-")) {
      const { error } = await createExamSlot({
        exam_day_id: exam.exam_day_id,
        exam_time: examAppointment || "08:00",
        student_appointment: examAppointment,
        student_name: studentName,
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
      const { error } = await updateExamSlot(exam.id, {
        student_appointment: examAppointment,
        student_name: studentName,
        instructor_name: instructorName,
        license_class: selectedClass,
        status: exam.status,
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

  function handleCancel() {
    if (exam.id.startsWith("dummy-")) {
      // Parent entfernt den Dummy
      onChanged();
      return;
    }

    setExamAppointment(exam.student_appointment ?? exam.exam_time ?? "08:00");
    setStudentName(exam.student_name ?? "");
    setInstructorName(exam.instructor_name ?? "");
    setSelectedClass(exam.license_class ?? "B197");

    setEditing(false);
  }

  return (
    <div className="rounded-xl p-4 overflow-hidden bg-gray-100">
      <div className="flex items-center gap-4 mb-4">
        <Zap className="text-yellow-500" size={20} />
        <h2 className={`text-lg font-bold ${styles[color].text}`}>
          Prüfungsplatz
        </h2>
        <Statuslight status={exam.status as Status} />
      </div>

      <div className="flex items-center gap-10 flex-wrap">
        <div className="flex items-center gap-2 font-bold">
          <Clock className={styles[color].text} size={18} />
          {editing ? (
            <Input
              value={examAppointment}
              onChange={(e) => setExamAppointment(e.target.value)}
              placeholder="Uhrzeit wählen"
              className="border rounded px-2 py-1 w-24"
            />
          ) : (
            <span>{exam.student_appointment || exam.exam_time || "08:00"}</span>
          )}
        </div>

        <div className="flex gap-8 items-center text-sm font-semibold ">
          {editing ? (
            <Input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Schülername ..."
              className="border rounded px-2 py-1"
            />
          ) : (
            <span>
              <label className={styles[color].text}>Schüler: </label>
              {exam.student_name || "Frei"}
            </span>
          )}

          {editing ? (
            <Input
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              placeholder="FL-Kürzel"
              className="border rounded px-2 py-1 w-25 "
            />
          ) : (
            <span className="flex gap-1">
              <label className={styles[color].text}>Fahrlehrer: </label>
              {exam.instructor_name || "-"}
            </span>
          )}

          <div className="flex items-center gap-2">
            {editing ? (
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="rounded-md border border-slate-300 px-2 py-1 text-sm bg-white"
              >
                {licenseClasses.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.value}
                  </option>
                ))}
              </select>
            ) : (
              <span>
                <label className={styles[color].text}>Klasse: </label>
                {exam.license_class || "-"}
              </span>
            )}
            {selectedLicense?.type === "bike" ? (
              <Bike className={styles[color].text} size={18} />
            ) : (
              <Car className={styles[color].text} size={18} />
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-5 flex-wrap">
        {editing ? (
          <>
            <Button
              variant="ghost"
              onClick={saveExam}
              className={`h-8 w-52 px-3 text-sm border ${styles[color].border} ${styles[color].text} ${styles[color].hover}`}
            >
              <Save className="mr-2 h-4 w-4" />
              Speichern
            </Button>

            <Button
              variant="ghost"
              onClick={handleCancel}
              className={`flex w-52 items-center gap-2 h-8 px-3 text-sm border ${styles[color].border} ${styles[color].text} ${styles[color].hover}`}
            >
              <Ban size={14} />
              Abbrechen
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setEditing(true)}
            className={`flex w-52 items-center gap-2 h-8 px-3 text-sm border ${styles[color].border} ${styles[color].text} ${styles[color].hover}`}
          >
            <Pencil size={14} />
            Bearbeiten
          </Button>
        )}
        {color === "office" && (
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
    </div>
  );
}
