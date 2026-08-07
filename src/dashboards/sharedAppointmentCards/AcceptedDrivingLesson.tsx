import { Button } from "@/components/button";
import {
  AlertTriangle,
  Archive,
  Bike,
  CalendarDays,
  Car,
  ChevronDown,
  GraduationCap,
  IdCard,
  Timer,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Database } from "../../types/database.types.ts";
import { AcceptedLessons } from "../studentDashBoard/studenDashboardService/StudentDashService.ts";

type AvailableLessonsRow =
  Database["public"]["Tables"]["available_lessons"]["Row"] & {
    instructors: Database["public"]["Tables"]["instructors"]["Row"];
  };

type Role = "student" | "instructor";
type Page = "default" | "hidden";

type DrivingLessonAppointmentProps = {
  role: Role;
  variant?: Page;
  studentId: number;
};

export default function AcceptedDrivingLesson({
  role,
  studentId,
  variant = "default",
}: DrivingLessonAppointmentProps) {
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});

  const [acceptedLessons, setAcceptedLessons] = useState<AvailableLessonsRow[]>(
    [],
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

  async function getAcceptedLessons(studentId: number) {
    const { data, error } = await AcceptedLessons(studentId);

    if (error) {
      console.error("Fehler beim Laden der angenommennen Fahrstuden!", error);
      toast.error("Fehler beim Laden der angenommennen Fahrstuden!", {
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

    setAcceptedLessons(data ?? []);
  }

  useEffect(() => {
    getAcceptedLessons(studentId);
  }, [studentId]);

  const toggleOpen = (id: number) => {
    setOpenStates((prev) => ({
      ...prev,
      [id]: !prev[id], // ! negiert einen Boolean.
    }));
  };

  return (
    <div className={`rounded-xl border ${borderColor} p-4 w-full`}>
      <div className="rounded-lg ">
        {acceptedLessons.map((lesson) => {
          const isOpen = !!openStates[lesson.id];

          return (
            <div
              key={lesson.id}
              className="mb-4 last:mb-0 border-b pb-4 last:border-none"
            >
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
                      Tag der Fahrstunde:
                      <strong>{lesson.lesson_date}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-5 text-slate-700 text-sm">
                    <User size={16} />

                    <span>
                      Status:
                      <strong> {lesson.status}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-5 text-slate-700 text-sm">
                    <IdCard size={20} className="text-green-700 " />

                    <span className="flex gap-2">
                      <strong> Klasse: {lesson.license_class} </strong>

                      {["AM", "A1", "A2", "A"].includes(
                        lesson.license_class,
                      ) ? (
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
                    <h4
                      className={`flex gap-2 text-sm font-bold ${titleColor}`}
                    >
                      <CalendarDays className="text-slate-700" size={20} />
                      Datum:{" "}
                      <span>
                        {lesson.lesson_date}, {lesson.lesson_time} Uhr
                      </span>
                    </h4>
                    <Button
                      onClick={() => toggleOpen(lesson.id)}
                      className="flex items-center gap-2"
                    >
                      <ChevronDown
                        className={`transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }   `}
                      />
                      Details ansehen
                    </Button>
                  </div>
                  {isOpen && (
                    <div className="mt-2 rounded bg-gray-300 p-4">
                      <div className="flex items-center gap-2 mb-3 text-slate-700 text-sm">
                        <CalendarDays className="text-green-700" size={16} />

                        <span>
                          Fahrstunde am:
                          <strong>
                            {" "}
                            {lesson.lesson_date}, {lesson.lesson_time} Uhr
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-5 text-slate-700 text-sm">
                        <User className="text-green-700" size={16} />

                        <span>
                          Status:
                          <strong> {lesson.status}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-5 text-slate-700 text-sm">
                        <GraduationCap className="text-green-700" size={16} />

                        <span>
                          Fahrlehrer:
                          <strong> {lesson.instructors.first_name}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-5 text-slate-700 text-sm">
                        <Timer className="text-green-700" size={16} />

                        <span>
                          Dauer:
                          <strong> {lesson.duration_minutes}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-5 text-slate-700 text-sm">
                        <IdCard className="text-green-700" size={16} />

                        <span className="flex gap-2">
                          {["AM", "A1", "A2", "A"].includes(
                            lesson.license_class,
                          ) ? (
                            <Bike className="text-green-700" size={18} />
                          ) : (
                            <Car className="text-green-700" size={18} />
                          )}
                          <span>
                            Kategorie:
                            <strong> {lesson.license_class}</strong>
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
