import { Card } from "@/components/card";
import { useDraggable } from "@dnd-kit/core";
import { Label } from "@radix-ui/react-label";
import { Pencil, MessageSquare } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";

type StudentDataBoxProps = {
  id: string;
  studentName: string | null;
  licenseClass: string | null;
  instructorName: string | null;
  examDate: string;
  studentAppointment: string | null;
  examTime: string;
  status: string | null;
  notes: string | null;

  onEdit?: () => void;
  onNote?: () => void;
};

export default function StudentDataBox(props: StudentDataBoxProps) {
  const {
    id,
    studentName,
    licenseClass,
    instructorName,
    examDate,
    studentAppointment,
    examTime,
    status,
    notes,
    onEdit,
    onNote,
  } = props;
  // attributes => Dies sind HTML-Attribute (z. B. role="button" , tabindex="0" ,
  // aria-pressed="false" )
  // =====================================================================================

  // ***listeners*** => Sie registrieren, wenn ein Nutzer das Element
  // mit der Maus anklickt oder auf dem Smartphone berührt,
  // um es zu ziehen
  // =====================================================================================

  // ***setNodeRef*** => Das ist eine Referenz (Ref). Ich übergebe sie an das HTML-Element,
  // das  gezogen werden soll. Dadurch weiß dnd-kit ganz genau,
  // welches echte DOM-Element auf der Seite bewegt wird.
  // =====================================================================================

  // transform: => Ein Objekt, das die aktuelle Position des Elements
  // während des Ziehens enthält
  // (z. B. wie viele Pixel es nach links/rechts oder oben/unten bewegt wurde:
  // { x: 10, y: 50 }).
  // =====================================================================================
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const styleObject = {
    transform: CSS.Translate.toString(transform),
  };

  const formattedDate = examDate
    ? new Date(examDate).toLocaleDateString("de-DE")
    : "-";

  const displayTime = studentAppointment || examTime || "00:00";

  return (
    <Card
      className="flex w-full flex-col p-2 overflow-hidden bg-app-surface border border-slate-200 border-2 cursor-grab active:cursor-grabbing select-none"
      ref={setNodeRef}
      style={styleObject}
      {...listeners}
      {...attributes}
    >
      <div className="flex gap-1 text-xs text-orange-600">
        <Label>
          <strong>Name -</strong>
        </Label>
        <p className="text-slate-200 text-xs">
          {studentName || "Kein Schüler zugewiesen"}
        </p>
      </div>
      <div className="flex gap-1 text-xs text-orange-600">
        <Label>
          <strong>Klasse -</strong>
        </Label>
        <p className="text-slate-200 text-xs">{licenseClass || "-"}</p>
        <Label>
          <strong>FL -</strong>
        </Label>
        <p className="text-slate-200 text-xs">{instructorName || "-"}</p>
      </div>

      <div className="flex gap-1 text-orange-600 text-xs">
        <Label>
          <strong>Prüfungstag:</strong>
        </Label>
        <p className="text-slate-200">{formattedDate}</p>
      </div>

      <div className="flex gap-1 text-orange-600 text-xs">
        <Label>
          <strong>Uhrzeit:</strong>
        </Label>
        <p className="text-slate-200">{displayTime}</p>
      </div>

      {notes && (
        <div className="flex gap-1 mt-1 text-orange-600 text-xs">
          <Label>
            <strong>Notiz:</strong>
          </Label>

          <p className="text-blue-600 break-words">{notes}</p>
        </div>
      )}

      {/* Verhindert, dass Klicks auf die Buttons das Drag-System auslösen */}
      <div
        className="flex gap-2 justify-end mt-2"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <Pencil
          className="cursor-pointer rounded-sm p-0.5 bg-orange-500 text-white hover:bg-orange-600 transition"
          size={18}
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
        />

        {status !== "green" && (
          <MessageSquare
            className="cursor-pointer rounded-sm p-0.5 bg-blue-500 text-white hover:bg-blue-600 transition"
            size={18}
            onClick={(e) => {
              e.stopPropagation();
              onNote?.();
            }}
          />
        )}
      </div>
    </Card>
  );
}
