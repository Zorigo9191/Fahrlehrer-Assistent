import { Button } from "@/components/button";
import Footer from "@/components/footer";

import {
  User,
  Pencil,
  Trash2,
  LogOut,
  Bell,
  House,
  MessagesSquare,
  FileX,
  Plus,
  AlertTriangle,
  StickyNotes,
  Save,
  Ban,
} from "lucide-react";

import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import ExamAppointment from "./ExamAppointment.tsx";
import ReceivedFeedback from "./ReceivedFeedback";
import HiddenLessons from "./HiddenLessons";

import DrivingLessonAppointment from "../sharedAppointmentCards/DrivingLessonAppointment.tsx";
import { getFeedbacks } from "../sharedStudentComponents/sharedService/SharedService.ts";

import type { Database } from "../../types/database.types.ts";
import { toast } from "sonner";
import { AuthContext } from "../../context/AuthContext.tsx";
import { supabase } from "../../lib/supabase.ts";

type SavedFeedbacksRow =
  Database["public"]["Tables"]["student_feedback"]["Row"] & {
    instructors: {
      id: string;
      first_name: string;
    } | null;
  };

const footerItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: House,
    color: "",
  },

  {
    id: "feedbacks",
    label: "Rückmeldungen",
    icon: MessagesSquare,
    color: "",
  },

  {
    id: "exams",
    label: "Prüfungstermine",
    icon: FileX,
    color: "",
  },
];

export default function studentDashBoard() {
  const navigate = useNavigate();

  const [savedFeedbacks, setSavedFeedbacks] = useState<SavedFeedbacksRow[]>([]);

  const [activeTab, setActiveTab] = useState("dashboard");

  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);

  const { session } = useContext(AuthContext);
  const studentId = session?.user?.id;
  const [studentName, setStudentName] = useState<string>("Laden...");
  const [studentLicenseClass, setStudentLicenseClass] = useState<string[]>([]);

  const [instructorIds, setInstructorIds] = useState<string[]>([]);

  // States für das Profilbild
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  async function fetchInstructorIds() {
    if (!studentId) return;

    const { data, error } = await supabase
      .from("student_instructors")
      .select("*")
      .eq("student_id", studentId);

    if (error) {
      console.error(
        "Fehler beim Laden der SchülerId und der FahrlehrerId:",
        error,
      );

      return;
    }

    setInstructorIds(data?.map((row) => row.instructor_id) ?? []);
  }

  useEffect(() => {
    if (studentId) {
      fetchInstructorIds();
    }
  }, [studentId]);

  // Nur neue Feedbacks zählen
  const notificationCount = savedFeedbacks.filter(
    (feedback) => feedback.read_at === null,
  ).length;

  async function fetchStudentName() {
    if (!studentId) return;
    const { data, error } = await supabase
      .from("driving_students")
      .select("full_name, avatar_url, student_license_classes(license_class)")
      .eq("id", studentId)
      .single();
    console.log(data);

    if (error) {
      console.error("Fehler beim Laden des Fahrlehrernamens:", error);
      setStudentName("Schüler");
      return;
    }

    if (data) {
      setStudentName(data.full_name ?? "Schüler");
      if (data.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
      if (data.student_license_classes.length > 0) {
        setStudentLicenseClass(
          data.student_license_classes.map((entry) => entry.license_class),
        );
      }
    }
  }
  useEffect(() => {
    if (studentId) {
      fetchStudentName();
    }
  }, [studentId]);

  // ProfileBild update
  async function handleAvatarChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file || !studentId) {
      return;
    }

    try {
      setUploading(true);

      const fileExt = file.name.split(".").pop()?.toLowerCase();

      if (!fileExt) {
        toast.error("Ungültiges Bildformat!", {
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

      // Eindeutiger Dateiname
      const fileName = `${studentId}-${Date.now()}.${fileExt}`;

      console.log("Upload startet:", fileName);

      // Bild in Supabase Storage hochladen
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Storage Upload Error:", uploadError);

        toast.error("Storage Upload Error!", {
          unstyled: true,
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          classNames: {
            toast:
              "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
            title: "text-red-500 text-sm font-medium",
            icon: "flex items-center justify-center",
          },
        });

        throw uploadError;
      }

      console.log("Upload erfolgreich:", fileName);

      // Öffentliche URL des Bildes holen
      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      const newUrl = publicUrlData.publicUrl;

      console.log("Neue Bild-URL:", newUrl);

      // URL in driving_students speichern
      const { error: updateError } = await supabase
        .from("driving_students")
        .update({
          avatar_url: newUrl,
        })
        .eq("id", studentId);

      if (updateError) {
        console.error("Database Update Error:", updateError);

        toast.error("Database Update Error!", {
          unstyled: true,
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          classNames: {
            toast:
              "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
            title: "text-red-500 text-sm font-medium",
            icon: "flex items-center justify-center",
          },
        });

        throw updateError;
      }

      // das neue Bild SOFORT gerendert.
      setAvatarUrl(newUrl);

      toast.success("Profilbild erfolgreich aktualisiert!", {
        unstyled: true,
        icon: <Save className="h-5 w-5 text-green-400" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-5 py-4 shadow-md",
          title: "text-green-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });
    } catch (error) {
      console.error("Fehler beim Hochladen:", error);

      toast.error("Fehler beim Hochladen des Bildes!", {
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
      setUploading(false);

      // Datei-Input zurücksetzen
      event.target.value = "";
    }
  }

  async function loadSavedFeedbacks() {
    const { data, error } = await getFeedbacks(studentId);

    if (error) {
      console.error("Fehler beim Laden der gespeicherten Feedbacks", error);

      toast.error("Fehler beim Laden der Feedbacks!", {
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

    setSavedFeedbacks(data ?? []);
  }

  useEffect(() => {
    loadSavedFeedbacks();
  }, [studentId]);

  // FeedbackGlocke schließt, wenn außerhalb geklickt wird
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const studentDashBoard = (
    <div className="flex min-h-screen w-full max-w-3xl mx-auto flex-col gap-6 overflow-x-hidden bg-app-surface py-6">
      {/* Header */}
      <div className="flex h-24 w-full gap-1 rounded-xl bg-green-700 px-3 py-2  text-slate-200">
        <div className="flex w-full items-center justify-between">
          <h1 className="flex items-center gap-2 text-sm font-bold">
            <User size={22} />
            <strong>Schüler Dashboard</strong>
          </h1>

          {/* Profilbild */}
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold ">Schüler(in): {studentName}</p>
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
              <Avatar className="h-20 w-20 border-2 border-gray-800 bg-gray-200">
                <AvatarImage src={avatarUrl || ""} />

                <AvatarFallback>
                  <Plus className="text-white" />
                </AvatarFallback>
              </Avatar>

              <div className="absolute -bottom-2 -right-1 flex gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="h-6 w-6 cursor-pointer rounded-full bg-white text-blue-500 hover:text-blue-600"
                >
                  <Pencil size={14} />
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="h-6 w-6 cursor-pointer rounded-full bg-white text-red-500 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </Button>

                {showDeleteConfirm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-sm rounded-xl bg-app-elevated border border-app-border p-5 shadow-xl text-app-text overflow-x-hidden">
                      <div className="mb-4 flex  justify-center items-center gap-3">
                        <h2 className="text-sm  font-bold text-green-700">
                          Profilbild löschen?
                        </h2>
                      </div>

                      <p className="mb-5 text-xs flex justify-center text-slate-200">
                        Möchtest du dein aktuelles Profilbild wirklich löschen?
                      </p>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="border border-slate-200 text-xs hover:bg-slate-600"
                        >
                          <Ban />
                          Abbrechen
                        </Button>

                        <Button
                          onClick={async () => {
                            const { error } = await supabase
                              .from("driving_students")
                              .update({ avatar_url: null })
                              .eq("id", studentId);

                            if (error) {
                              console.error("Fehler beim Löschen:", error);

                              toast.error(
                                "Profilbild konnte nicht gelöscht werden!",
                                {
                                  unstyled: true,
                                  icon: (
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                  ),
                                  classNames: {
                                    toast:
                                      "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
                                    title: "text-red-500 text-sm font-medium",
                                    icon: "flex items-center justify-center",
                                  },
                                },
                              );

                              return;
                            }

                            setAvatarUrl(null);
                            setShowDeleteConfirm(false);

                            toast.success("Profilbild gelöscht!", {
                              unstyled: true,
                              icon: <Trash2 className="h-5 w-5 text-red-500" />,
                              classNames: {
                                toast:
                                  "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
                                title: "text-red-500 text-sm font-medium",
                                icon: "flex items-center justify-center",
                              },
                            });
                          }}
                          className="border border-slate-200 text-red-500 hover:text-slate-200 hover:bg-red-500"
                        >
                          <Trash2 />
                          Löschen
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedbacks + Abmelden */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <StickyNotes size={22} />

          <strong className="text-sm">Feedbacks</strong>

          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative flex cursor-pointer items-center justify-center p-1"
            >
              <Bell className="text-yellow-500" size={20} />

              {notificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotifications && (
              <div className="absolute -left-28 top-9 z-50 w-80 rounded-lg border border-app-border bg-green-700 p-3 shadow-xl">
                <p className="mb-3 text-xs font-bold text-slate-200">
                  Feedbacks
                </p>

                <div className="flex max-h-80 flex-col gap-2 overflow-y-auto ">
                  {savedFeedbacks.map((feedback) => {
                    const isNew = feedback.read_at === null;

                    return (
                      <div
                        key={feedback.id}
                        className={`rounded-lg border p-2 ${
                          isNew
                            ? "border-gray-300 bg-app-surface text-slate-200"
                            : "border-gray-200 bg-gray-100 text-gray-400"
                        }`}
                      >
                        <div className="text-xs font-semibold">
                          {new Date(feedback.created_at).toLocaleDateString(
                            "de-DE",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )}
                        </div>

                        <div className="text-xs">
                          Fahrlehrer:{" "}
                          {feedback.instructors?.first_name ?? "Unbekannt"}
                        </div>

                        <div className="text-xs">
                          Klasse: {feedback.license_class ?? "Unbekannt"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Abmelden */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="flex h-8 items-center gap-2 border border-slate-200 px-3 text-xs font-bold hover:text-slate-200 transition text-green-700 hover:bg-green-700"
        >
          <LogOut size={14} />
          Abmelden
        </Button>
      </div>

      {/* Fahrstunde vergeben */}
      <DrivingLessonAppointment
        role="student"
        instructorIds={instructorIds}
        refreshKey={refreshKey}
        setRefreshKey={setRefreshKey}
        studentId={studentId}
        studentLicenseClass={studentLicenseClass}
      />

      {/* Angenommene Fahrstunde */}
      <HiddenLessons studentId={studentId} refreshKey={refreshKey} />
    </div>
  );

  return (
    <div className="flex min-h-screen w-full justify-center bg-app-bg text-app-text">
      <div
        className="
          flex
          min-h-screen
          w-full
          flex-col
          overflow-hidden
          bg-app-surface
          md:my-8
          md:min-h-[calc(100vh-4rem)]
          md:max-w-3xl
          md:rounded-2xl
          md:shadow-xl
          lg:max-w-5xl
        
        "
      >
        <main className="flex-1 p-4 pb-8   bg-app-surface">
          <div className="flex-1">
            {activeTab === "dashboard" && studentDashBoard}

            {activeTab === "feedbacks" && (
              <ReceivedFeedback
                studentName={studentName}
                setActiveTab={setActiveTab}
                studentId={studentId}
                avatarUrl={avatarUrl}
              />
            )}

            {activeTab === "exams" && (
              <ExamAppointment
                studentName={studentName}
                setActiveTab={setActiveTab}
                studentId={studentId}
                avatarUrl={avatarUrl}
              />
            )}
          </div>

          <div className="mt-auto w-full pt-4  ">
            <Footer
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              items={footerItems}
              color="text-green-700"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
