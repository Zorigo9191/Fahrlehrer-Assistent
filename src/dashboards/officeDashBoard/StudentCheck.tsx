import { Button } from "@/components/button";
import { Briefcase, Plus, X } from "lucide-react";
import StudentDataBox from "./StudentDataBox";
import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import DropColumn from "./DropColumn";

type StudentCheckProps = {
  setActiveTab: (tab: string) => void;
};

type ColumnId = "check" | "blocked" | "missing" | "ready";

export default function StudentCheck({ setActiveTab }: StudentCheckProps) {
  const [columns, setColumns] = useState({
    check: [{ id: "1" }, { id: "2" }, { id: "3" }],
    blocked: [{ id: "4" }, { id: "11" }, { id: "12" }],
    missing: [{ id: "5" }, { id: "6" }, { id: "7" }, { id: "22" }],
    ready: [{ id: "8" }, { id: "9" }],
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const StudentId = active.id.toString();
    const newColumn = over.id.toString() as ColumnId;

    setColumns((prev) => {
      let movedStudent;

      // Object.fromEntries = aus Objekt -> Array
      // Object.entries = aus Array -> Objekt

      const updatedColumns = Object.fromEntries(
        Object.entries(prev).map(([columnId, students]) => {
          const filtered = students.filter((student) => {
            if (student.id === StudentId) {
              movedStudent = student;
              return false; //   entfernt diese Karte aus der alten Spalte.
            }

            return true; // Alle anderen Karten bleiben in der Spalte.
          });

          return [columnId, filtered]; // Neue Version der aktuellen Spalte zurückgeben.
        }),
      ) as typeof prev;

      if (movedStudent) {
        updatedColumns[newColumn] = [
          ...updatedColumns[newColumn],
          movedStudent,
        ];
      }
      return updatedColumns;
    });
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden text-sm ">
      {/* Header */}
      <div className="flex gap-1 w-full bg-orange-500 py-2 px-3 rounded-xl text-white">
        <div className="flex items-center w-full justify-between">
          <h1 className="text-xl text-white font-bold flex items-center gap-2">
            <Briefcase size={28} />
            Schüler Überprüfung
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

        <h2 className="border-r border-gray-300  flex justify-center font-bold">
          Antritt nicht möglich
        </h2>
        <h2 className="border-r border-gray-300  flex justify-center font-bold">
          Einiges fehlt
        </h2>
        <h2 className="flex justify-center font-bold">Antritt möglich</h2>
      </div>

      {/* Columns  */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 w-full overflow-y-scroll gap-2 rounded-2xl bg-orange-50 p-1 ">
          <DropColumn
            id="check"
            className="border-r border-gray-300 flex flex-col gap-2 p-1 bg-gray-300 rounded-2xl"
          >
            <Button
              className="
                h-16 rounded-xl border-2 border-dashed 
                border-black text-black
                flex items-center justify-center
                hover:bg-gray-200
                "
            >
              <Plus />
            </Button>

            {columns.check.map((student) => (
              <StudentDataBox key={student.id} id={student.id} />
            ))}
          </DropColumn>

          <DropColumn
            id="blocked"
            className="border-r border-gray-300 flex flex-col gap-2 p-1 bg-red-400 rounded-2xl"
          >
            <Button
              className="
                h-16 rounded-xl border-2 border-dashed 
                border-black text-black
                flex items-center justify-center
                hover:bg-gray-200
                "
            >
              <Plus />
            </Button>

            {columns.blocked.map((student) => (
              <StudentDataBox key={student.id} id={student.id} />
            ))}
          </DropColumn>

          <DropColumn
            id="missing"
            className="border-r border-gray-300 flex flex-col gap-2 p-1 bg-orange-400 rounded-2xl"
          >
            <Button
              className="
                h-16 rounded-xl border-2 border-dashed 
                border-black text-black
                flex items-center justify-center
                hover:bg-gray-200
                "
            >
              <Plus />
            </Button>

            {columns.missing.map((student) => (
              <StudentDataBox key={student.id} id={student.id} />
            ))}
          </DropColumn>

          <DropColumn
            id="ready"
            className="border-r border-gray-300 flex flex-col gap-2 p-1 bg-green-400 rounded-2xl"
          >
            <Button
              className="
                h-16 rounded-xl border-2 border-dashed 
                border-black text-black
                flex items-center justify-center
                hover:bg-gray-200
                "
            >
              <Plus />
            </Button>

            {columns.ready.map((student) => (
              <StudentDataBox key={student.id} id={student.id} />
            ))}
          </DropColumn>
        </div>
      </DndContext>
    </div>
  );
}
