import { Button } from "@/components/button";
import { Ban, Briefcase, Plus, Save, X } from "lucide-react";
import StudentDataBox from "./StudentDataBox";
import { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import DropColumn from "./DropColumn";
import { toast } from "sonner";
import { getExamDays, updateExamSlot } from "./officeService/OfficeService.ts";

type StudentCheckProps = {
  setActiveTab: (tab: string) => void;
};

type ExamSlot = {
  id: string;
  student_name: string;
  license_class: string | null;
  instructor_name: string | null;
  exam_date: string;
  student_appointment: string | null;
  exam_time: string;
  status: string;
  notes: string | null;
};

type ColumnId = "check" | "blocked" | "missing" | "ready";

export default function StudentCheck({ setActiveTab }: StudentCheckProps) {
  const [columns, setColumns] = useState<{
    check: ExamSlot[];
    blocked: ExamSlot[];
    missing: ExamSlot[];
    ready: ExamSlot[];
  }>({
    check: [],
    blocked: [],
    missing: [],
    ready: [],
  });

  // Schüler der gerade bearbeitet wird
  const [editingStudentDataBox, setEditingStudentDataBox] =
    useState<ExamSlot | null>(null);

  // Notiz Bearbeitung
  const [editingNoteStudent, setEditingNoteStudent] = useState<ExamSlot | null>(
    null,
  );

  async function loadAndDistributeData() {
    const { data, error } = await getExamDays();

    if (error) {
      toast.error("Fehler beim Laden der Prüfungsdaten");
      return;
    }

    // nach Status verteilen
    if (data) {
      const newColumns = {
        check: [] as ExamSlot[],
        blocked: [] as ExamSlot[],
        missing: [] as ExamSlot[],
        ready: [] as ExamSlot[],
      };

      data.forEach((day) => {
        if (day.exam_slots && day.exam_slots.length > 0) {
          // Nur Slots filtern, bei denen ein Schüler eingetragen ist
          const filledSlots = day.exam_slots.filter(
            (slot: ExamSlot) =>
              slot.student_name && slot.student_name.trim() !== "",
          );

          filledSlots.forEach((slot: ExamSlot) => {
            const slotWithDate = {
              ...slot,
              exam_date: day.exam_date,
            };

            const currentStatus = slot.status || "check";
            if (currentStatus === "blocked" || currentStatus === "red") {
              newColumns.blocked.push(slotWithDate);
            } else if (
              currentStatus === "missing" ||
              currentStatus === "orange"
            ) {
              newColumns.missing.push(slotWithDate);
            } else if (currentStatus === "ready" || currentStatus === "green") {
              newColumns.ready.push(slotWithDate);
            } else {
              newColumns.check.push(slotWithDate); // Standard / Grau
            }
          });
        }
      });

      setColumns(newColumns);
    }
  }
  useEffect(() => {
    loadAndDistributeData();
  }, []);

  //  Drag & Drop Logik inklusive Speicherung in Supabase
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const studentId = active.id.toString();
    const newColumnId = over.id.toString() as ColumnId;

    // herausfinden, in welcher Spalte der Schüler vorher war
    let oldColumnId: ColumnId | null = null;
    Object.entries(columns).forEach(([colId, students]) => {
      if (students.some((s) => s.id === studentId)) {
        oldColumnId = colId as ColumnId;
      }
    });

    if (oldColumnId === newColumnId) {
      return;
    }
    // Record ist nur eine TypeScript-Typbeschreibung
    const statusMap: Record<ColumnId, string> = {
      check: "gray",
      blocked: "red",
      missing: "orange",
      ready: "green",
    };

    const newDbStatus = statusMap[newColumnId];

    // In Supabase speichern, damit es beim Neuladen erhalten bleibt
    const updateData =
      newDbStatus === "green"
        ? {
            status: newDbStatus,
            notes: null,
          }
        : {
            status: newDbStatus,
          };

    const { error } = await updateExamSlot(studentId, updateData);

    if (error) {
      toast.error("Fehler beim Speichern des Status!");
      return;
    }

    setColumns((prev) => {
      let movedStudent: any;

      const updatedColumns = Object.fromEntries(
        Object.entries(prev).map(([columnId, students]) => {
          const filtered = students.filter((student) => {
            if (student.id === studentId) {
              movedStudent = student;
              return false;
            }
            return true;
          });

          return [columnId, filtered];
        }),
      ) as typeof prev;

      if (movedStudent) {
        updatedColumns[newColumnId] = [
          ...updatedColumns[newColumnId],
          // { ...movedStudent, status: newDbStatus },

          {
            ...movedStudent,
            status: newDbStatus,
            notes: newDbStatus === "green" ? null : movedStudent.notes,
          },
        ];
      }
      return updatedColumns;
    });

    toast.success("Status erfolgreich aktualisiert", {
      unstyled: true,
      icon: <Save className="h-5 w-5 text-green-400" />,
      classNames: {
        toast:
          "flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-5 py-4 shadow-md",
        title: "text-green-500 text-sm font-medium",
        icon: "flex items-center justify-center",
      },
    });
  };

  const handleSaveStudent = async () => {
    if (!editingStudentDataBox) return;

    const { error } = await updateExamSlot(editingStudentDataBox.id, {
      student_name: editingStudentDataBox.student_name,
      license_class: editingStudentDataBox.license_class,
      instructor_name: editingStudentDataBox.instructor_name,
      student_appointment: editingStudentDataBox.student_appointment,
      exam_time: editingStudentDataBox.exam_time,
    });

    if (error) {
      toast.error("Fehler beim Aktualisieren");
      return;
    }

    toast.success("Schülerdaten gespeichert");

    // Fenster schließen
    setEditingStudentDataBox(null);

    // Daten neu laden
    loadAndDistributeData();
  };

  const handleSaveNote = async () => {
    if (!editingNoteStudent) return;

    const { error } = await updateExamSlot(editingNoteStudent.id, {
      notes: editingNoteStudent.notes,
    });

    if (error) {
      toast.error("Fehler beim Speichern der Notiz");
      return;
    }

    toast.success("Notiz gespeichert");

    setEditingNoteStudent(null);

    loadAndDistributeData();
  };

  return (
    <div className="flex flex-col w-full min-h-screen max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden text-sm ">
      {/* Header */}
      <div className="flex gap-1 w-full bg-orange-500 py-2 px-3 rounded-xl text-white">
        <div className="flex items-center w-full justify-between">
          <h1 className="text-xl text-white font-bold flex items-center gap-2">
            <Briefcase size={28} />
            Bearbeitung des Schülerstatus
          </h1>

          <p className="text-sm font-semibold">Max MusterMann</p>
        </div>
      </div>
      <div className="flex justify-end gap-2 ">
        <Button
          variant="ghost"
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center gap-2 h-8 px-3 text-sm text-orange-500 hover:bg-orange-200 font-bold border border-orange-500 transition"
        >
          <X />
          schließen
        </Button>
      </div>

      {/* Titels */}
      <div className="grid grid-cols-4 w-full gap-2 rounded-2xl text-white bg-orange-500 p-1 overflow-x-hidden break-all">
        <h2 className="border-r border-gray-300 w-full flex justify-center font-bold">
          Zum Überprüfen
        </h2>
        <h2 className="border-r border-gray-300 flex justify-center font-bold">
          Antritt nicht möglich
        </h2>
        <h2 className="border-r border-gray-300 flex justify-center font-bold">
          Einiges fehlt
        </h2>
        <h2 className="flex justify-center font-bold">Antritt möglich</h2>
      </div>

      {/* Columns */}
      <DndContext onDragEnd={handleDragEnd}>
        {/* Schüler update inputs für Studentdatabox */}
        {editingStudentDataBox && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-5 w-96 space-y-3">
              <h2 className="flex justify-center font-bold text-lg text-orange-500">
                Schüler bearbeiten
              </h2>

              <label className="text-orange-500 font-bold">Name:</label>
              <input
                className="border rounded p-2 w-full"
                value={editingStudentDataBox.student_name}
                onChange={(e) =>
                  setEditingStudentDataBox({
                    ...editingStudentDataBox,
                    student_name: e.target.value,
                  })
                }
              />
              <label className="text-orange-500 font-bold">Klasse:</label>
              <input
                className="border rounded p-2 w-full"
                value={editingStudentDataBox.license_class ?? ""}
                onChange={(e) =>
                  setEditingStudentDataBox({
                    ...editingStudentDataBox,
                    license_class: e.target.value,
                  })
                }
              />
              <label className="text-orange-500 font-bold">Fahrlehrer:</label>
              <input
                className="border rounded p-2 w-full"
                value={editingStudentDataBox.instructor_name ?? ""}
                onChange={(e) =>
                  setEditingStudentDataBox({
                    ...editingStudentDataBox,
                    instructor_name: e.target.value,
                  })
                }
              />

              <label className="text-orange-500 font-bold">Uhrzeit:</label>
              <input
                className="border rounded p-2 w-full"
                type="time"
                value={editingStudentDataBox.student_appointment ?? ""}
                onChange={(e) =>
                  setEditingStudentDataBox({
                    ...editingStudentDataBox,
                    student_appointment: e.target.value,
                  })
                }
              />

              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setEditingStudentDataBox(null)}
                  className="flex-1 text-gray-500 border border-gray-500 hover:bg-orange-200"
                >
                  <Ban className="text-red-500" />
                  Abbrechen
                </Button>

                <Button
                  onClick={handleSaveStudent}
                  className="flex-1 bg-green-300 hover:bg-green-400"
                >
                  <Save size={14} />
                  Speichern
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* // Notizen in StudentDataBox */}
        {editingNoteStudent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-5 w-80 space-y-3">
              <h2 className="text-center font-bold text-orange-500">
                Grund eingeben
              </h2>

              <textarea
                className="border rounded p-2 w-full h-24 resize-none"
                placeholder="Warum bekommt der Schüler diesen Status?"
                value={editingNoteStudent.notes ?? ""}
                onChange={(e) =>
                  setEditingNoteStudent({
                    ...editingNoteStudent,
                    notes: e.target.value,
                  })
                }
              />

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setEditingNoteStudent(null)}
                  className="flex-1 text-gray-500 border border-gray-500 hover:bg-orange-200"
                >
                  <Ban className="text-red-500" />
                  Abbrechen
                </Button>

                <Button
                  onClick={handleSaveNote}
                  className="flex-1 bg-green-300 hover:bg-green-400"
                >
                  <Save size={14} />
                  Speichern
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Spalten (Columns), denen die StudentDataBox zugewiesen wird */}
        <div className="grid grid-cols-4 w-full overflow-y-scroll gap-2 rounded-2xl bg-orange-50 p-1 ">
          {/* Spalte 1: Check */}
          <DropColumn
            id="check"
            className="border-r border-gray-300 flex flex-col gap-2 p-1 bg-gray-300 rounded-2xl"
          >
            <Button className="h-16 rounded-xl border-2 border-dashed border-black text-black flex items-center justify-center hover:bg-gray-200">
              <Plus />
            </Button>
            {columns.check.map((student) => (
              <StudentDataBox
                key={student.id}
                id={student.id}
                studentName={student.student_name}
                licenseClass={student.license_class}
                instructorName={student.instructor_name}
                examDate={student.exam_date}
                studentAppointment={student.student_appointment}
                examTime={student.exam_time}
                status={student.status}
                notes={student.notes}
                onEdit={() => setEditingStudentDataBox(student)}
                onNote={() => setEditingNoteStudent(student)}
              />
            ))}
          </DropColumn>

          {/* Spalte 2: Blocked */}
          <DropColumn
            id="blocked"
            className="border-r border-gray-300 flex flex-col gap-2 p-1 bg-red-400 rounded-2xl"
          >
            <Button className="h-16 rounded-xl border-2 border-dashed border-black text-black flex items-center justify-center hover:bg-gray-200">
              <Plus />
            </Button>
            {columns.blocked.map((student) => (
              <StudentDataBox
                key={student.id}
                id={student.id}
                studentName={student.student_name}
                licenseClass={student.license_class}
                instructorName={student.instructor_name}
                examDate={student.exam_date}
                studentAppointment={student.student_appointment}
                examTime={student.exam_time}
                status={student.status}
                notes={student.notes}
                onEdit={() => setEditingStudentDataBox(student)}
                onNote={() => setEditingNoteStudent(student)}
              />
            ))}
          </DropColumn>

          {/* Spalte 3: Missing */}
          <DropColumn
            id="missing"
            className="border-r border-gray-300 flex flex-col gap-2 p-1 bg-orange-400 rounded-2xl"
          >
            <Button className="h-16 rounded-xl border-2 border-dashed border-black text-black flex items-center justify-center hover:bg-gray-200">
              <Plus />
            </Button>
            {columns.missing.map((student) => (
              <StudentDataBox
                key={student.id}
                id={student.id}
                studentName={student.student_name}
                licenseClass={student.license_class}
                instructorName={student.instructor_name}
                examDate={student.exam_date}
                studentAppointment={student.student_appointment}
                examTime={student.exam_time}
                status={student.status}
                notes={student.notes}
                onEdit={() => setEditingStudentDataBox(student)}
                onNote={() => setEditingNoteStudent(student)}
              />
            ))}
          </DropColumn>

          {/* Spalte 4: Ready */}
          <DropColumn
            id="ready"
            className="border-r border-gray-300 flex flex-col gap-2 p-1 bg-green-400 rounded-2xl"
          >
            <Button className="h-16 rounded-xl border-2 border-dashed border-black text-black flex items-center justify-center hover:bg-gray-200">
              <Plus />
            </Button>
            {columns.ready.map((student) => (
              <StudentDataBox
                key={student.id}
                id={student.id}
                studentName={student.student_name}
                licenseClass={student.license_class}
                instructorName={student.instructor_name}
                examDate={student.exam_date}
                studentAppointment={student.student_appointment}
                examTime={student.exam_time}
                status={student.status}
                notes={student.notes}
                onEdit={() => setEditingStudentDataBox(student)}
                onNote={() => setEditingNoteStudent(student)}
              />
            ))}
          </DropColumn>
        </div>
      </DndContext>
    </div>
  );
}
