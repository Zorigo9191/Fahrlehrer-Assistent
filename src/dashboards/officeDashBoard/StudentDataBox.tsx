import { Card } from "@/components/card";
import { useDraggable } from "@dnd-kit/core";
import { Label } from "@radix-ui/react-label";
import { Check, Pencil, Trash } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";

type StudentDataBoxProps = {
  id: string;
};

export default function StudentDataBox({ id }: StudentDataBoxProps) {
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

  const object = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Card
      className="flex w-full flex-col p-2 overflow-hidden  bg-gray-100 border border-gray-300"
      ref={setNodeRef}
      style={object}
      {...listeners}
      {...attributes}
    >
      <div className="flex gap-1">
        <Label>
          <strong>Name:</strong>
        </Label>
        <p className="text-orange-600">Mathias Stelzer</p>
      </div>
      <div className="flex gap-1">
        <Label>
          <strong>Klasse:</strong>
        </Label>
        <p className="text-orange-600">B197</p>
        <Label>
          <strong>FL:</strong>
        </Label>
        <p className="text-orange-600">Ts</p>
      </div>

      <div className="flex gap-1">
        <Label>
          <strong>Prüfung am:</strong>
        </Label>
        <p className="text-orange-600">02.05.2026</p>
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <Check
          className="cursor-pointer  rounded-sm p-0.5 bg-green-500 text-white"
          size={18}
        />

        <Pencil
          className="cursor-pointer  rounded-sm p-0.5 bg-orange-500 text-white"
          size={18}
        />

        <Trash
          className="cursor-pointer text-white bg-red-500 p-0.5 rounded-sm"
          size={18}
        />
      </div>
    </Card>
  );
}
