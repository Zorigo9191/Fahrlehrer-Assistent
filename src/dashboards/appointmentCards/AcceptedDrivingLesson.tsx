import { Button } from "@/components/button";
import {
  Archive,
  Ban,
  Bike,
  CalendarDays,
  Car,
  ChevronDown,
  GraduationCap,
  IdCard,
  Pencil,
  Send,
  User,
} from "lucide-react";
import { useState } from "react";

type Role = "student" | "instructor";
type Page = "default" | "hidden";

type DrivingLessonAppointmentProps = {
  role: Role;
  variant?: Page;
};

export default function AcceptedDrivingLesson({
  role,
  variant = "default",
}: DrivingLessonAppointmentProps) {
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

  const [open, setOpen] = useState(false);
  const [selectedClass] = useState("B197");

  const selectedLicense = licenseClasses.find(
    (license) => license.value === selectedClass,
  );

  let titleColor = "";
  let borderColor = "";

  switch (role) {
    case "student":
      titleColor = "text-green-700";
      borderColor = "border-green-700";

      break;

    case "instructor":
      titleColor = "text-blue-700";
      borderColor = "border-blue-700";

      break;

    default:
      titleColor = "text-black";
      borderColor = "border-black";
  }

  return (
    <div className={`rounded-xl border ${borderColor} p-4 w-full`}>
      <div className="rounded-lg ">
        {role === "student" && variant === "default" && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="text-slate-700" size={20} />

              <h2 className={`text-lg font-bold ${titleColor}`}>
                Angenommene Fahrstunde
              </h2>
            </div>
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
            <div className="flex items-center gap-2 mb-5 text-slate-700 text-sm">
              <IdCard size={20} className="text-green-700 " />

              <span className="flex gap-2">
                <strong> Klasse: {selectedClass} </strong>
                {selectedLicense?.type === "bike" ? (
                  <Bike className="text-green-700" size={18} />
                ) : (
                  <Car className="text-green-700" size={18} />
                )}
              </span>
            </div>
            <Button
              variant="ghost"
              className={`h-8 w-52 px-3 text-sm border border-green-700 text-green-700 hover:bg-green-100`}
            >
              <Archive size={14} className="mr-2" />
              Ausblenden
            </Button>
          </>
        )}

        {role === "student" && variant === "hidden" && (
          <>
            <div className="flex items-center gap-2 mb-4 justify-between">
              <h4 className={`flex gap-2 text-sm font-bold ${titleColor}`}>
                <CalendarDays className="text-slate-700" size={20} />
                Datum: <span>20.07.2026, 08:30 Uhr</span>
              </h4>
              <Button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2"
              >
                <ChevronDown
                  className={`transition-transform ${open ? "rotate-180" : ""}   `}
                />
                Details ansehen
              </Button>
            </div>
            {open && (
              <div className="mt-2 rounded bg-gray-300 p-4">
                <div className="flex items-center gap-2 mb-3 text-slate-700 text-sm">
                  <CalendarDays className="text-green-700" size={16} />

                  <span>
                    Fahrstunde am:
                    <strong> 20.07.2026, 08:30 Uhr</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-5 text-slate-700 text-sm">
                  <User className="text-green-700" size={16} />

                  <span>
                    Status:
                    <strong> Gebucht</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-5 text-slate-700 text-sm">
                  <GraduationCap className="text-green-700" size={16} />

                  <span>
                    Fahrlehrer:
                    <strong> Mathias</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-5 text-slate-700 text-sm">
                  <IdCard className="text-green-700" size={16} />

                  <span className="flex gap-2">
                    Klasse: <strong>{selectedClass}</strong>
                    {selectedLicense?.type === "bike" ? (
                      <Bike className="text-green-700" size={18} />
                    ) : (
                      <Car className="text-green-700" size={18} />
                    )}
                  </span>
                </div>
              </div>
            )}
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
