import { Button } from "@/components/button";
import {
  Users,
  User,
  Pencil,
  Trash2,
  Car,
  X,
  Bike,
  Plus,
  MessageSquareQuote,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import StudentRegisterForm from "./StudentRegisterForm";
import FeedbackForm from "./FeedbackForm";
import FeedbackOverview from "./FeedbackOverview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";

type StudentListProps = {
  setActiveTab: (tab: string) => void;
};

const students = [
  {
    name: "Thomas Bauer",
    license: "B197",
    type: "car",
    feedbacks: "12",
    created_at: "27.05.2026",
  },
  {
    name: "Anna Müller",
    license: "B",
    type: "car",
    feedbacks: "8",
    created_at: "02.05.2026",
  },
  {
    name: "Max Schmidt",
    license: "A1",
    type: "bike",
    feedbacks: "15",
    created_at: "02.02.2026",
  },
];

export default function StudentList({ setActiveTab }: StudentListProps) {
  const [showRegister, setShowRegister] = useState(false);
  const [feedbackGive, setFeedbackGive] = useState(false);
  const [feedbackView, setFeedbackView] = useState(false);

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
                className="absolute border right-4 top-3 text-gray-500 hover:text-black"
              >
                <X />
              </Button>

              <StudentRegisterForm
                onClose={() => {
                  setShowRegister(false);
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

      {/* Schüler Karten */}
      {students.map((student) => (
        <div
          key={student.name}
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

              <h3 className="text-lg font-bold text-blue-700">
                {student.name}
              </h3>
              <span>
                wurde am
                <strong> {student.created_at} </strong>
                hinzugefügt.
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button onClick={() => setFeedbackView(true)}>
                <ExternalLink />
              </Button>
              <span>
                Feedbacks:
                <strong> {student.feedbacks}</strong>
              </span>

              {feedbackView && (
                <div className="fixed  inset-0 z-50 flex items-center justify-center bg-black/30 overflow-y-auto p-4">
                  <div className="relative  max-w-md max-h-[90vh] overflow-y-auto scrollbar-none rounded-xl bg-white p-6 shadow-2xl">
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
            <div className="flex gap-2">
              {student.type === "bike" ? (
                <Bike size={16} className="text-blue-700" />
              ) : (
                <Car size={16} className="text-blue-700" />
              )}

              <span>
                Klasse:
                <strong> {student.license}</strong>
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

            {/* Feedback geben Button
               Feedback wird in einem Fenster angezeigt */}
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
                <div className="relative w-full max-w-md max-h-[90vh]  overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
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
      ))}
    </div>
  );
}
