import { Button } from "@/components/button";
import {
  AlertTriangle,
  Ban,
  Bike,
  CalendarDays,
  Car,
  Check,
  Clock,
  Dot,
  IdCard,
  Pencil,
  Route,
  Save,
  Timer,
  Trash2,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import {
  deleteLesson,
  getAvailableLesson,
  updateAvailableLesson,
} from "../instructorDashBoard/instructorDashBoardItem/AppointmentService.ts";
import type { Database } from "../../types/database.types.ts";

type Role = "student" | "instructor";

type DrivingLessonAppointmentProps = {
  role: Role;
  instructorIds: string[];
  refreshKey: number;
  studentId: string;
  studentLicenseClass: string[];
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
};

type AvailableLessonRow =
  Database["public"]["Tables"]["available_lessons"]["Row"];

type AvailableLessonUpdate =
  Database["public"]["Tables"]["available_lessons"]["Update"];

export default function DrivingLessonAppointment({
  role,
  instructorIds,
  refreshKey,
  studentId,
  studentLicenseClass,
  setRefreshKey,
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

  const [lessons, setLessons] = useState<AvailableLessonRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [activeDeleteId, setActiveDeleteId] = useState<number | null>(null);
  const [activeAcceptId, setActiveAcceptId] = useState<number | null>(null);
  const [editingFormData, setEditingFormData] =
    useState<AvailableLessonRow | null>(null);

  const student = studentId;

  async function fetchLessons() {
    if (!instructorIds || instructorIds.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getAvailableLesson({
        instructorIds,
        studentLicenseClass:
          role === "student" ? studentLicenseClass : undefined,
      });

      if (data) {
        setLessons(data);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Terminanfrage!", error);
      toast.error("Fehler beim Laden der Terminanfrage!", {
        unstyled: true,
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
          title: "text-red-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchLessons();
  }, [instructorIds, refreshKey, studentLicenseClass]);

  const handleStartEditLesson = (editLessonId: number) => {
    const lessonToEdit = lessons.find((lesson) => lesson.id === editLessonId);

    if (lessonToEdit) {
      setEditingItemId(lessonToEdit.id);
      setEditingFormData(lessonToEdit);
    }
  };

  const handleLessonChange = (
    field: keyof AvailableLessonUpdate,
    value: string,
  ) => {
    setEditingFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  };
  const handleSaveLesson = async () => {
    if (!editingFormData || !editingItemId) return;
    setLoading(true);
    try {
      await updateAvailableLesson({
        lessonId: editingItemId,
        payload: {
          lesson_date: editingFormData.lesson_date,
          lesson_time: editingFormData.lesson_time,
          duration_minutes: editingFormData.duration_minutes,
          license_class: editingFormData.license_class,
        },
      });

      toast.success("Terminanfrage erfolgreich aktualisiert!", {
        unstyled: true,
        icon: <Check className="h-5 w-5 text-green-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-5 py-4 shadow-md",
          title: "text-green-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });

      setEditingItemId(null);
      setEditingFormData(null);
      setRefreshKey((prev) => prev + 1);
      fetchLessons();
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      toast.warning("Fehler beim Speichern", {
        unstyled: true,
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-4 shadow-md",
          title: "text-yellow-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  //  zum Annehmen der Terminanfrage durch den Schüler
  const handleAcceptLesson = async (lessonId: number) => {
    try {
      await updateAvailableLesson({
        lessonId: lessonId,
        payload: {
          status: "vergeben",
          student_id: student,
        },
      });

      toast.success("Terminanfrage erfolgreich angenommen!", {
        unstyled: true,
        icon: <Check className="h-5 w-5 text-green-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-5 py-4 shadow-md",
          title: "text-green-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });

      setActiveAcceptId(null);
      setRefreshKey((prev) => prev + 1);
      fetchLessons();
    } catch (error) {
      console.error("Fehler beim Annehmen:", error);
      toast.warning("Fehler beim Annehmen des Termins", {
        unstyled: true,
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-4 shadow-md",
          title: "text-yellow-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    try {
      await deleteLesson(lessonId);
      setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId));
      setRefreshKey((prev) => prev + 1);
      toast.success("Termin Anfrage wurde gelöscht", {
        unstyled: true,
        icon: <Trash2 className="h-5 w-5 text-red-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
          title: "text-red-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      toast.warning("Fehler beim Löschen", {
        unstyled: true,
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-4 shadow-md",
          title: "text-yellow-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });
    }

    setActiveDeleteId(null);
  };

  if (loading) {
    return <div className="p-4 text-slate-500">Lade Termineanfrage...</div>;
  }

  return (
    <div className={`rounded-xl border p-4 ${borderColor}  `}>
      {loading && <p className="text-center text-gray-500">Lade Anfragen...</p>}

      {lessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-slate-500 p-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              role === "student" ? "bg-green-100" : "bg-blue-100"
            }`}
          >
            <Route className={`h-6 w-6 ${textColor}`} />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-100">
            Keine Fahrstundenanfrage.
          </p>
        </div>
      ) : (
        lessons.map((lesson) => {
          const lessonDate = lesson.lesson_date
            ? new Date(lesson.lesson_date)
            : null;

          const formattedLessonDate = lessonDate
            ? lessonDate.toLocaleDateString("de-DE", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Datum n.v.";

          const lessonTime = lesson.lesson_time
            ? lesson.lesson_time.slice(0, 5)
            : null;
          const duration = lesson.duration_minutes
            ? lesson.duration_minutes
            : null;
          let lessonStatus = "Verfügbar";
          if (lesson.status === "vergeben") {
            if (role === "student" && lesson.student_id === studentId) {
              lessonStatus = "Bereits gebucht";
            } else {
              lessonStatus = "Vergeben";
            }
          }
          const formattedTime = lessonTime
            ? `${lessonTime} Uhr`
            : "Uhrzeit n.v.";

          const currentClass = lesson.license_class || "B";

          const selectedLicense = licenseClasses.find(
            (license) => license.value === currentClass,
          );

          const lessonEditing = editingItemId === lesson.id;

          return (
            <div key={lesson.id} className="mb-4 border-b pb-4 last:border-b-0">
              {/* header für Anfrage */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="text-yellow-500" size={20} />

                  <h2 className={`text-sm font-bold ${titleColor}`}>
                    Anfrage für Fahrstunde
                  </h2>
                </div>
                <div className="flex items-center gap-0.5 ">
                  <Dot size={14} className={`${textColor}`} />
                  <Dot className={`${textColor}`} />
                  <p className="text-xs font-semibold text-slate-200">
                    {lessonStatus}
                  </p>
                  <Dot className={`${textColor}`} />
                  <Dot size={14} className={`${textColor}`} />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-3 text-slate-200 p-3">
                {/* Datum */}
                <div className="flex items-center gap-2">
                  <CalendarDays className={textColor} size={16} />
                  {lessonEditing ? (
                    <input
                      type="date"
                      value={editingFormData?.lesson_date || ""}
                      onChange={(e) =>
                        handleLessonChange("lesson_date", e.target.value)
                      }
                      className="border border-blue-700 h-7 px-2 rounded font-normal text-slate-200 text-xs w-full
                      [&::-webkit-calendar-picker-indicator]:invert
                      [&::-webkit-calendar-picker-indicator]:opacity-80
                      "
                    />
                  ) : (
                    <p className="text-xs font-semibold">
                      {formattedLessonDate}
                    </p>
                  )}
                </div>

                {/* Uhrzeit */}
                <div className="flex items-center gap-2">
                  <Clock className={`${textColor} size={18}`} />
                  {lessonEditing ? (
                    <input
                      type="time"
                      value={editingFormData?.lesson_time || ""}
                      onChange={(e) =>
                        handleLessonChange("lesson_time", e.target.value)
                      }
                      className="border border-blue-700 h-7 px-2 rounded font-normal text-slate-200 text-xs w-full 
                      [&::-webkit-calendar-picker-indicator]:invert
                      [&::-webkit-calendar-picker-indicator]:opacity-80"
                    />
                  ) : (
                    <p className="text-xs font-semibold">{formattedTime}</p>
                  )}
                </div>

                {/* Dauer */}
                <div className="flex items-center gap-2">
                  <Timer className={`${textColor} size={18}`} />
                  {lessonEditing ? (
                    <input
                      type="text"
                      value={editingFormData?.duration_minutes || ""}
                      onChange={(e) =>
                        handleLessonChange("duration_minutes", e.target.value)
                      }
                      className="border border-blue-700 h-7 px-2 rounded font-normal text-slate-200 text-xs w-20"
                    />
                  ) : (
                    <p className="text-xs font-semibold">{duration} min</p>
                  )}
                </div>

                {/* Klasse ändern */}
                <div className="flex items-center gap-2 text-slate-200 text-sm">
                  <IdCard size={20} className={` ${textColor} `} />
                  <span className="flex text-xs items-center gap-2">
                    {!lessonEditing && <strong>Klasse:</strong>}
                    {lessonEditing ? (
                      <select
                        value={editingFormData?.license_class || "B"}
                        onChange={(e) =>
                          handleLessonChange("license_class", e.target.value)
                        }
                        className="border border-blue-700 h-7 px-2 rounded font-normal text-slate-200 w-22 bg-app-elevated"
                      >
                        {licenseClasses.map((license) => (
                          <option key={license.value} value={license.value}>
                            {license.value}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-1 ">
                        <span>{currentClass}</span>
                        {selectedLicense?.type === "bike" ? (
                          <Bike className={` ${textColor} `} size={18} />
                        ) : (
                          <Car className={` ${textColor} `} size={18} />
                        )}
                      </div>
                    )}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-5 flex-wrap px-3">
                {role === "student" && (
                  <>
                    <Button
                      variant="ghost"
                      disabled={lesson.status === "vergeben"}
                      className="h-8 w-52 px-3 text-xs border border-slate-200 text-slate-200 hover:bg-green-700"
                      onClick={() => setActiveAcceptId(lesson.id)}
                    >
                      <Check size={14} className="mr-2 border-slate-200" />
                      {lesson.status === "vergeben"
                        ? "Bereits gebucht!"
                        : "Annehmen"}
                    </Button>
                  </>
                )}

                {activeAcceptId === lesson.id && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className=" rounded-xl shadow-lg p-6 w-80 bg-app-elevated">
                      <h2 className="flex justify-center text-green-700 text-sm font-bold">
                        Terminanfrage Annehmen?
                      </h2>

                      <p className="text-xs  text-center text-slate-200 mt-2">
                        Möchtest du diese Terminanfrage wirklich annehmen?
                      </p>
                      <div className="flex gap-3 mt-5">
                        <Button
                          variant="ghost"
                          className="flex-1 border text-xs border-slate-200 text-slate-200 hover:bg-slate-600"
                          onClick={() => setActiveAcceptId(null)}
                        >
                          <Ban size={14} />
                          Abbrechen
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={() => handleAcceptLesson(lesson.id)}
                          className="flex-1 border border-slate-200 text-green-700 hover:bg-green-700 hover:text-slate-200 text-xs"
                        >
                          <Check />
                          Bestätigen
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {role === "instructor" && (
                  <>
                    {lessonEditing ? (
                      <div className="flex gap-2 justify-start">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setEditingItemId(null);
                            setEditingFormData(null);
                          }}
                          className="flex items-center gap-2 h-8 px-4 text-xs border border-slate-200 text-slate-200 hover:bg-slate-600 w-42"
                        >
                          <Ban size={14} /> Abbrechen
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            handleSaveLesson();
                          }}
                          className="flex items-center justify-center gap-2 h-8 px-4 text-xs border border-slate-200 text-blue-700 hover:bg-blue-700 hover:text-slate-200 w-42"
                        >
                          <Save size={14} /> Speichern
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant="ghost"
                          className="h-8 w-52 px-3 text-xs border border-slate-200 text-blue-700 hover:bg-blue-700 hover:text-slate-200 transition"
                          onClick={() => handleStartEditLesson(lesson.id)}
                        >
                          <Pencil size={14} />
                          Bearbeiten
                        </Button>
                        <Button
                          variant="ghost"
                          className="flex w-52 items-center gap-2 h-8 px-3 text-xs border border-slate-200 text-red-500 hover:bg-red-500 hover:text-slate-200 transition"
                          onClick={() => setActiveDeleteId(lesson.id)}
                        >
                          <Trash2 size={14} />
                          Löschen
                        </Button>
                      </div>
                    )}

                    {activeDeleteId === lesson.id && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-app-elevated rounded-xl shadow-lg p-6 w-80">
                          <h2 className="text-sm text-blue-700 font-bold">
                            Terminanfrage löschen?
                          </h2>

                          <p className="text-xs text-slate-200 mt-2">
                            Möchtest du diese Terminanfrage wirklich entfernen?
                          </p>
                          <div className="flex gap-3 mt-5">
                            <Button
                              variant="ghost"
                              onClick={() => setActiveDeleteId(null)}
                              className="flex-1 border border-slate-200 text-slate-200 text-xs hover:bg-slate-600"
                            >
                              <Ban />
                              Abbrechen
                            </Button>

                            <Button
                              variant="ghost"
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="flex-1 text-red-500 border border-slate-200 hover:bg-red-500 hover:text-slate-200 text-xs"
                            >
                              <Trash2 size={14} />
                              Löschen
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
