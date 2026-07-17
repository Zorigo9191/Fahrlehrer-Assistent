import { Button } from "@/components/button";
import { Archive, Ban, CalendarDays, Pencil, Send, User } from "lucide-react";

type Role = "student" | "instructor";

type DrivingLessonAppointmentProps = {
  role: Role;
};

export default function AcceptedDrivingLesson({
  role,
}: DrivingLessonAppointmentProps) {
  let titleColor = "";
  let textColor = "";
  let borderColor = "";
  let buttonColor = "";

  switch (role) {
    case "student":
      titleColor = "text-green-700";
      textColor = "text-green-700";
      borderColor = "border-green-700";
      buttonColor = "bg-green-700 hover:bg-green-600";

      break;

    case "instructor":
      titleColor = "text-blue-700";
      textColor = "text-blue-700";
      borderColor = "border-blue-700";
      buttonColor = "bg-blue-700 hover:bg-blue-600";
      break;

    default:
      titleColor = "text-black";
      textColor = "text-black";
      borderColor = "border-black";
      buttonColor = "bg-slate-700 hover:bg-slate-600";
  }

  return (
    <div className={`rounded-xl border ${borderColor} p-4`}>
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="text-slate-700" size={20} />

        <h2 className={`text-lg font-bold ${titleColor}`}>
          Angenommene Fahrstunde
        </h2>
      </div>

      <div className="rounded-lg p-3">
        {role === "student" && (
          <>
            <div className="flex items-center gap-2 mb-3 text-slate-700 text-sm">
              <CalendarDays size={16} />

              <span>
                Fahrstunde:
                <strong> 20.07.2026, 08:30 Uhr</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 mb-5 text-slate-700 text-sm">
              <User size={16} />

              <span>
                Status:
                <strong> Gebucht</strong>
              </span>
            </div>
            <Button
              variant="ghost"
              className={`h-8 w-52 px-3 text-sm border border-green-700 text-green-700 hover:bg-blue-100`}
            >
              <Archive size={14} className="mr-2" />
              Verbergen
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
