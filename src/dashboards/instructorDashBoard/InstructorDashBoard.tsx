import { Button } from "@/components/button";
import Footer from "@/components/footer";

import {
  CalendarDays,
  User,
  Pencil,
  Trash2,
  LogOut,
  GraduationCap,
  Bell,
  ClipboardList,
  House,
  Users,
  CalendarPlus,
  AlertTriangle,
  Save,
  Timer,
  CalendarClock,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentList from "../sharedStudentComponents/StudentList.tsx";

import ExamList from "../sharedExamLists/ExamList.tsx";

import AppointmentDialog from "./instructorDashBoardItem/AppointmentDialog.tsx";
import DrivingLessonAppointment from "../sharedAppointmentCards/DrivingLessonAppointment.tsx";
import {
  getAcceptedLessonsByStudent,
  updateAcceptedLesson,
} from "../officeDashBoard/instructorService/InstructorService.ts";
import { toast } from "sonner";
import type { Database } from "../../types/database.types.ts";
import { supabase } from "../../lib/supabase.ts";
import { deleteLesson } from "./instructorDashBoardItem/AppointmentService.ts";
import { AuthContext } from "../../context/AuthContext.tsx";

const footerItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: House,
  },
  {
    id: "pruefungsliste",
    label: "Prüfungsliste",
    icon: ClipboardList,
  },
  {
    id: "schuelerliste",
    label: "Schülerliste",
    icon: Users,
  },
];

type AcceptedlessonRow =
  Database["public"]["Tables"]["available_lessons"]["Row"] & {
    driving_students: {
      full_name: string;
      student_id: string;
    } | null;
  };

export default function InstructorDashBoard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [acceptedLesson, setAcceptedLessons] = useState<AcceptedlessonRow[]>(
    [],
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [activeDeleteId, setActiveDeleteId] = useState<number | null>(null);

  const { session } = useContext(AuthContext);
  const instructorId = session?.user?.id;

  const [editForm, setEditForm] = useState({
    lesson_date: "",
    lesson_time: "",
    duration_minutes: "",
    license_class: "",
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [instructorName, setInstructorName] = useState<string>("Laden...");
  const studentId = acceptedLesson[0]?.student_id ?? null;
  // Nur neue acceptedLesson zählen
  const notificationCount = acceptedLesson.filter(
    (lesson) => lesson.read_at === null,
  ).length;

  // instructor Name holen
  async function fetchInstructorName() {
    if (!instructorId) return;
    const { data, error } = await supabase
      .from("instructors")
      .select("first_name")
      .eq("id", instructorId)
      .single();

    if (error) {
      console.error("Fehler beim Laden des Fahrlehrernamens:", error);
      setInstructorName("Fahrlehrer");
      return;
    }

    if (data) {
      setInstructorName(data.first_name ?? "Fahrlehrer");
    }
  }

  useEffect(() => {
    if (instructorId) {
      fetchInstructorName();
    }
  }, [instructorId]);

  async function acceptedLessonsByStudent() {
    const { data, error } = await getAcceptedLessonsByStudent(instructorId);

    if (error) {
      console.error("Fehler beim Laden von angennomenen Fahrstuden!", error);
      toast.warning("Fehler beim Laden von angennomenen Fahrstuden!", {
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
    acceptedLessonsByStudent();

    const channel = supabase
      .channel("accepted-lessons")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "available_lessons",
        },
        (payload) => {
          console.log(" REALTIME EVENT:", payload);
          acceptedLessonsByStudent();
        },
      )
      .subscribe((status) => {
        console.log("Realtime Status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [instructorId]);

  const handleUpdate = async (lesson: AcceptedlessonRow) => {
    const { data, error } = await updateAcceptedLesson(
      lesson.id,
      editForm.lesson_date,
      editForm.lesson_time,
      Number(editForm.duration_minutes),
      editForm.license_class,
    );

    if (error) {
      console.error("Fehler beim Aktualisieren:", error);

      toast.error("Fahrstunde konnte nicht aktualisiert werden!", {
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

    if (data) {
      console.log("Erfolgreich aktualisiert:", data);

      setAcceptedLessons((prev) =>
        prev.map((item) => (item.id === lesson.id ? data : item)),
      );

      setEditingLessonId(null);

      toast.success("Angenommene Fahrstunde wurde aktualisiert!", {
        unstyled: true,
        icon: <Save className="h-5 w-5 text-green-400" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-5 py-4 shadow-md",
          title: "text-green-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });
    }
  };

  const handleStartEdit = (lesson: AcceptedlessonRow) => {
    setEditingLessonId(lesson.id);

    setEditForm({
      lesson_date: lesson.lesson_date ?? "",
      lesson_time: lesson.lesson_time?.slice(0, 5) ?? "",
      duration_minutes: lesson.duration_minutes?.toString() ?? "",
      license_class: lesson.license_class ?? "",
    });
  };

  const handleCancelEdit = () => {
    setEditingLessonId(null);

    setEditForm({
      lesson_date: "",
      lesson_time: "",
      duration_minutes: "",
      license_class: "",
    });
  };

  const handleDeleteLesson = async (lessonId: number) => {
    try {
      await deleteLesson(lessonId);
      setAcceptedLessons((prev) =>
        prev.filter((lesson) => lesson.id !== lessonId),
      );

      toast.success("angenommene Fahrstunde wurde gelöscht", {
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
    } finally {
      setActiveDeleteId(null);
    }
  };

  // Außerhalb Click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const instructorDashBoard = (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden">
      {/* Header */}
      <div className="flex gap-1 w-full bg-blue-700 py-2 px-3 rounded-xl text-white">
        <div className="flex items-center w-full justify-between">
          <h1 className="text-xl text-white font-bold flex items-center gap-2">
            <GraduationCap size={28} />
            Fahrlehrer Dashboard
          </h1>

          <p className="text-sm font-semibold">{instructorName}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        {/* Prüfungsliste & Benachrichtigungen */}
        <div className="flex gap-2 items-center">
          <ClipboardList size={22} /> Angenommene Fahrstunden
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative flex cursor-pointer items-center justify-center p-1"
            >
              <Bell className="text-yellow-500" size={20} />

              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotifications && (
              <div className="absolute -left-30 top-9 z-50 w-80 rounded-lg border border-gray-200 bg-white p-3 shadow-xl">
                <h3 className="mb-3 text-sm font-bold text-gray-800">
                  Angenommen von
                </h3>

                <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
                  {acceptedLesson.map((lesson) => {
                    const isNew = lesson.read_at === null;

                    return (
                      <div
                        key={lesson.id}
                        className={`rounded-lg border p-2 ${
                          isNew
                            ? "border-gray-300 bg-white text-black"
                            : "border-gray-200 bg-gray-100 text-gray-400"
                        }`}
                      >
                        <div className="text-xs font-semibold">
                          {new Date(lesson.lesson_date).toLocaleDateString(
                            "de-DE",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )}
                        </div>

                        <div className="text-xs">
                          Schüler:{" "}
                          {lesson.driving_students?.full_name ?? "Unbekannt"}
                        </div>

                        <div className="text-xs">
                          Klasse: {lesson.license_class ?? "Unbekannt"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Anfrage erstellen + Abmelden */}
        <div className="flex flex-col md:flex-row w-full md:w-auto justify-end gap-3">
          <div className="w-full md:w-auto">
            <Button
              variant="ghost"
              onClick={() => setAppointmentDialog(true)}
              className="flex items-center justify-center w-full md:w-auto gap-2 h-8 px-3 text-sm text-blue-700 hover:bg-blue-100 font-bold border border-blue-700 transition"
            >
              <CalendarPlus size={16} />
              Anfrage erstellen
            </Button>

            {/* Formular Modal */}
            <AppointmentDialog
              appointmentDialog={appointmentDialog}
              setAppointmentDialog={setAppointmentDialog}
              instructorId={instructorId}
              onSave={() => setRefreshKey((prev) => prev + 1)}
            />
          </div>

          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center justify-center w-full md:w-auto gap-2 h-8 px-3 text-sm text-blue-700 hover:bg-blue-100 font-bold border border-blue-700 transition"
          >
            <LogOut size={16} />
            Abmelden
          </Button>
        </div>
      </div>

      <DrivingLessonAppointment
        role={"instructor"}
        instructorIds={instructorId ? [instructorId] : []}
        refreshKey={refreshKey}
        setRefreshKey={setRefreshKey}
        studentId={studentId}
        studentLicenseClass={[]}
      />

      {/* Angenommene Fahrstunde */}
      <h2 className="flex gap-1 w-full justify-center bg-blue-700 py-2 px-3 rounded-xl text-white">
        Angenommene Fahrstunde
      </h2>
      <div className="rounded-xl min-h-90 border border-blue-700 p-4">
        {acceptedLesson.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-slate-500 p-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full 
                bg-blue-100"
            >
              <CalendarDays className="h-6 w-6 text-blue-700" />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-700">
              Keine Fahrstundenanfrage.
            </p>
          </div>
        ) : (
          acceptedLesson.map((lesson) => {
            const isEditing = editingLessonId === lesson.id;

            return (
              <div key={lesson.id} className="p-3 border-b border-b-blue-700">
                {isEditing ? (
                  <>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-3 text-slate-700 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        <input
                          type="date"
                          value={editForm.lesson_date}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              lesson_date: e.target.value,
                            })
                          }
                          className="border border-blue-700 rounded px-2 py-1 w-full"
                        />
                      </div>
                      <CalendarClock size={16} />
                      <input
                        type="time"
                        value={editForm.lesson_time}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            lesson_time: e.target.value,
                          })
                        }
                        className="border border-blue-700 rounded px-2 py-1 w-full md:w-auto"
                      />
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-5 text-slate-700 text-sm">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <input
                          type="text"
                          value={editForm.license_class}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              license_class: e.target.value,
                            })
                          }
                          className="border border-blue-700 rounded px-2 py-1 w-full"
                        />
                      </div>
                      <Timer size={16} />
                      <input
                        type="number"
                        value={editForm.duration_minutes}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            duration_minutes: e.target.value,
                          })
                        }
                        className="border border-blue-700 rounded px-2 py-1 w-full md:w-auto"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-3 text-slate-700 text-sm">
                      <CalendarDays size={16} />

                      <span className="gap-1 flex">
                        Vergebene Fahrstunde:
                        <strong>
                          am{" "}
                          {new Date(lesson.lesson_date).toLocaleDateString(
                            "de-De",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )}{" "}
                          - {lesson.lesson_time?.slice(0, 5)} Uhr
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-5 text-slate-700 text-sm">
                      <User size={16} />

                      <span className="gap-1 flex">
                        Angenommen von:
                        <strong>
                          {lesson.driving_students?.full_name} -{" "}
                          {lesson.license_class}
                        </strong>
                      </span>
                      <span className="gap-1 flex">
                        Dauer:
                        <strong>{lesson.duration_minutes}</strong>
                      </span>
                    </div>
                  </>
                )}

                <div className="flex gap-2 flex-wrap">
                  {isEditing ? (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => handleUpdate(lesson)}
                        className="flex w-52 items-center gap-2 h-8 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-50"
                      >
                        <Save size={14} />
                        Speichern
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={handleCancelEdit}
                        className="flex w-52 items-center gap-2 h-8 px-3 text-sm border border-red-500 text-red-500 hover:bg-red-50"
                      >
                        Abbrechen
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => handleStartEdit(lesson)}
                        className="flex w-52 items-center gap-2 h-8 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100"
                      >
                        <Pencil size={14} />
                        Bearbeiten
                      </Button>

                      <Button
                        variant="ghost"
                        className="flex w-52 items-center gap-2 h-8 px-3 text-sm border border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => setActiveDeleteId(lesson.id)}
                      >
                        <Trash2 size={14} />
                        Löschen
                      </Button>
                    </>
                  )}

                  {activeDeleteId === lesson.id && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                      <div className="bg-white rounded-xl shadow-lg p-6 w-80">
                        <h2 className="text-lg font-bold">
                          Angenommene Fahrstunde löschen?
                        </h2>

                        <p className="text-sm text-gray-600 mt-2">
                          Möchtest du diese angenommene Fahrstunde wirklich
                          entfernen?
                        </p>
                        <div className="flex gap-3 mt-5">
                          <Button
                            variant="ghost"
                            onClick={() => setActiveDeleteId(null)}
                            className="flex-1 border border-blue-700 hover:bg-blue-200"
                          >
                            Abbrechen
                          </Button>

                          <Button
                            variant="ghost"
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="flex-1 border-red-500 text-black bg-red-300 hover:bg-red-400"
                          >
                            <Trash2 size={14} />
                            Löschen
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-slate-100 flex justify-center">
      <div
        className="
          w-full
          min-h-screen
          bg-white
          md:max-w-3xl
          md:my-8
          md:min-h-[calc(100vh-4rem)]
          md:rounded-2xl
          md:shadow-xl
          lg:max-w-5xl
          flex flex-col
          overflow-hidden
        "
      >
        <main className="flex-1 p-4 pb-8 flex flex-col">
          <div className="flex-1">
            {activeTab === "dashboard" && instructorDashBoard}
            {activeTab === "pruefungsliste" && (
              <>
                {console.log(
                  "InstructorDashBoard instructorName vor ExamList:",
                  JSON.stringify(instructorName),
                )}
                <ExamList
                  role="instructor"
                  setActiveTab={setActiveTab}
                  instructorName={instructorName}
                />
              </>
            )}
            {activeTab === "schuelerliste" && (
              <StudentList
                setActiveTab={setActiveTab}
                instructorName={instructorName}
              />
            )}
          </div>

          <div className="w-full mt-auto pt-4">
            <Footer
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              items={footerItems}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
