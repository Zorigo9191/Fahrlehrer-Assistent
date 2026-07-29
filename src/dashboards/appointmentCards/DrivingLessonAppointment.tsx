import { Button } from "@/components/button";
import {
  Ban,
  Bike,
  CalendarDays,
  Car,
  Check,
  Clock,
  IdCard,
  Pencil,
  Send,
  Zap,
} from "lucide-react";
import { useState } from "react";

type Role = "student" | "instructor";

type DrivingLessonAppointmentProps = {
  role: Role;
};

export default function DrivingLessonAppointment({
  role,
}: DrivingLessonAppointmentProps) {
  let titleColor = "";
  let textColor = "";
  let borderColor = "";

  switch (role) {
    case "student":
      titleColor = "text-green-700";
      textColor = "text-green-700";
      borderColor = "border-green-700";
      break;

    case "instructor":
      titleColor = "text-blue-700";
      textColor = "text-blue-700";
      borderColor = "border-blue-700";
      break;

    default:
      titleColor = "text-black";
      textColor = "text-black";
      borderColor = "border-black";
  }

  const licenseClasses = [
    { value: "B197", type: "car", color: "text-blue-700" },
    { value: "B78", type: "car", color: "text-blue-700" },
    { value: "B", type: "car", color: "text-blue-700" },
    { value: "BE", type: "car", color: "text-blue-700" },
    { value: "AM", type: "bike", color: "text-blue-700" },
    { value: "A1", type: "bike", color: "text-blue-700" },
    { value: "A2", type: "bike", color: "text-blue-700" },
    { value: "A", type: "bike", color: "text-blue-700" },
  ];

  const [selectedClass] = useState("B");

  const selectedLicense = licenseClasses.find(
    (license) => license.value === selectedClass,
  );

  return (
    <div className={`rounded-xl border p-4 ${borderColor}`}>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="text-yellow-500" size={20} />

        <h2 className={`text-lg font-bold ${titleColor}`}>
          Anfrage für Fahrstunde
        </h2>
      </div>

      <div className="flex gap-4 space-y-2 text-slate-700 p-3">
        <div className="flex gap-2">
          <CalendarDays className={textColor} size={16} />
          <p className="text-sm font-semibold">Montag - 25.07.2026</p>
        </div>

        <div className="flex gap-1">
          <Clock className={`${textColor} size={18}`} />
          <p className="text-sm font-semibold">14:00 - 15:30 Uhr</p>
        </div>
        <div className="flex items-center gap-2 mb-5 text-slate-700 text-sm">
          <IdCard size={20} className={` ${textColor}  `} />

          <span className="flex gap-2">
            <strong> Klasse: {selectedClass} </strong>
            {selectedLicense?.type === "bike" ? (
              <Bike className={` ${textColor} `} size={18} />
            ) : (
              <Car className={` ${textColor} `} size={18} />
            )}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-5 flex-wrap">
        {role === "student" && (
          <>
            <Button
              variant="ghost"
              className="h-8 w-52 px-3 text-sm border border-green-700 text-green-700 hover:bg-green-100"
            >
              <Check size={14} className="mr-2" /> Annehmen
            </Button>

            <Button
              variant="ghost"
              className="h-8 w-52 px-3 text-sm border border-red-500 text-red-500 hover:bg-red-50"
            >
              <Ban size={14} />
              Ablehnen
            </Button>
          </>
        )}

        {role === "instructor" && (
          <>
            <Button
              variant="ghost"
              className="h-8 w-52 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100"
            >
              <Send className="mr-2 h-4 w-4" />
              Terminanfrage senden
            </Button>

            <Button
              variant="ghost"
              className="h-8 w-52 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100"
            >
              <Pencil size={14} />
              Bearbeiten
            </Button>

            <Button
              variant="ghost"
              className="flex w-52 items-center gap-2 h-8 px-3 text-sm border border-red-500 text-red-500 hover:bg-red-50"
            >
              <Ban size={14} />
              Abbrechen
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
