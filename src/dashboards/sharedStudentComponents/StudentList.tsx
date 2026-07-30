import { Button } from "@/components/button";
import {
  Users,
  Pencil,
  Trash2,
  Car,
  X,
  Plus,
  MessageSquareQuote,
  ExternalLink,
} from "lucide-react";
import { useEffect, useState } from "react";
import StudentRegisterForm from "./StudentRegisterForm";
import FeedbackForm from "./FeedbackForm";
import FeedbackOverview from "./FeedbackOverview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { supabase } from "../../lib/supabase.ts";
import type { Database } from "../../types/database.types.ts";

type DrivingStudentRow =
  Database["public"]["Tables"]["driving_students"]["Row"];

type StudentWithLicenses = DrivingStudentRow & {
  student_license_classes: { license_class: string }[];
};

type StudentListProps = {
  setActiveTab: (tab: string) => void;
};

export default function StudentList({ setActiveTab }: StudentListProps) {
  const [showRegister, setShowRegister] = useState(false);
  const [feedbackGive, setFeedbackGive] = useState(false);
  const [feedbackView, setFeedbackView] = useState(false);
  const [students, setStudents] = useState<StudentWithLicenses[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchStudents() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("driving_students").select(`
          id,
          full_name,
          email,
          created_at,
          student_license_classes (
          license_class
          )
        `);

      if (error) {
        console.error("Fehler beim Laden:", error);
      } else if (data) {
        setStudents(data as StudentWithLicenses[]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden">
      {/* Header */}
      <div className="flex gap-1 w-full bg-blue-700 py-2 px-3 rounded-xl text-white">
        <div className="flex items-center w-full">
          <h2 className="text-xl text-white font-bold flex items-center gap-2">
            <Users size={28} />
            Schülerliste
          </h2>
        </div>
      </div>

      <div className="flex justify-between gap-2">
        <Button
          variant="ghost"
          onClick={() => setShowRegister(true)}
          className="flex w-52 items-center gap-2 h-8 px-3 text-sm text-blue-700 hover:bg-blue-100 font-bold border border-blue-700 transition"
        >
          <Plus />
          Schüler hinzufügen
        </Button>

        {showRegister && (
          <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="relative  w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
              <Button
                variant="ghost"
                onClick={() => setShowRegister(false)}
                className="absolute border-2 right-4 top-3 text-gray-500 hover:text-black"
              >
                <X />
              </Button>

              <StudentRegisterForm
                onClose={() => {
                  setShowRegister(false);
                  fetchStudents();
                }}
              />
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center gap-2 h-8 px-3 text-sm text-blue-700 hover:bg-blue-100 font-bold border border-blue-700 transition"
        >
          <X />
          schließen
        </Button>
      </div>

      {loading && <p className="text-center text-gray-500">Lade Schüler...</p>}

      {!loading && students.length === 0 && (
        <p className="text-center text-gray-500">Keine Schüler gefunden.</p>
      )}

      {/* Schüler Karten */}

      {!loading &&
        students.map((student) => {
          const formattedDate = new Date(student.created_at).toLocaleDateString(
            "de-DE",
          );

          const licenseClassesText =
            student.student_license_classes
              ?.map((l) => l.license_class)
              .join(", ") || "Keine Klasse";

          return (
            <div
              key={student.id}
              className="rounded-xl border border-blue-700 p-4"
            >
              <div className="flex items-center gap-2 mb-4 justify-between">
                <div className="flex gap-2 items-center">
                  <Avatar className="h-20 w-20 border-2 border-gray-800 bg-gray-200">
                    <AvatarImage src="/profil1.png" />
                    <AvatarFallback>
                      <Plus className="text-white" />
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="text-lg font-bold text-blue-700">
                      {student.full_name}
                    </h3>
                    {student.email && (
                      <p className="text-xs text-gray-500">{student.email}</p>
                    )}
                    <span className="text-sm">
                      wurde am <strong>{formattedDate}</strong> hinzugefügt.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button onClick={() => setFeedbackView(true)}>
                    <ExternalLink />
                  </Button>
                  <span>
                    Feedbacks:
                    <strong> 0</strong>
                  </span>

                  {feedbackView && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 overflow-y-auto p-4">
                      <div className="relative max-w-md max-h-[90vh] overflow-y-auto scrollbar-none rounded-xl bg-white p-6 shadow-2xl">
                        <Button
                          variant="ghost"
                          onClick={() => setFeedbackView(false)}
                          className="border absolute right-4 top-3 text-gray-500 hover:text-black"
                        >
                          <X />
                        </Button>

                        <FeedbackOverview />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-700">
                <div className="flex gap-2 items-center">
                  <Car size={16} className="text-blue-700" />
                  <span>
                    Klassen:
                    <strong> {licenseClassesText}</strong>
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-5 flex-wrap">
                <Button
                  variant="ghost"
                  className="flex w-52 items-center gap-2 h-8 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100"
                >
                  <Pencil size={14} />
                  Bearbeiten
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setFeedbackGive(true)}
                  className="flex w-52 items-center gap-2 h-8 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100"
                >
                  <MessageSquareQuote size={14} />
                  Feedback geben
                </Button>

                {feedbackGive && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 overflow-y-auto p-4">
                    <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
                      <Button
                        variant="ghost"
                        onClick={() => setFeedbackGive(false)}
                        className="border absolute right-4 top-3 text-gray-500 hover:text-black"
                      >
                        <X />
                      </Button>

                      <FeedbackForm
                        onClose={() => {
                          setFeedbackGive(false);
                        }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  variant="ghost"
                  className="flex w-52 items-center gap-2 h-8 px-3 text-sm border border-red-500 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Löschen
                </Button>
              </div>
            </div>
          );
        })}
    </div>
  );
}
