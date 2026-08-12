import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { Button } from "@/components/button";
import {
  AlertTriangle,
  ChevronRight,
  Lightbulb,
  MessageSquare,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getFeedbacks } from "../sharedStudentComponents/sharedService/SharedService.ts";
import { toast } from "sonner";
import type { Database } from "../../types/database.types.ts";

type ReceivedFeedbackProps = {
  setActiveTab: (tab: string) => void;
  studentId: number;
};

type FeedbackContent = {
  verkehrsbeobachtung?: string;
  geschwindigkeit?: string;
  fahrzeugpositionierung?: string;
  kommunikation?: string;
  fahrzeugbedienung?: string;
  allgemein?: string;
};

type FeedbackWithInstructor =
  Database["public"]["Tables"]["student_feedback"]["Row"] & {
    instructors: {
      first_name: string;
    } | null;
    feedbackContent: FeedbackContent;
  };

export default function ReceivedFeedback({
  setActiveTab,
  studentId,
}: ReceivedFeedbackProps) {
  const [ratedFeedback, setRatedFeedback] = useState<FeedbackWithInstructor[]>(
    [],
  );
  const [ratedFeedbackIds, setRatedFeedbackIds] = useState<number[]>([]);
  const [selectedFeedback, setSelectedFeedback] =
    useState<FeedbackWithInstructor | null>(null);

  async function fetchFeedbacks() {
    const { data, error } = await getFeedbacks(studentId);

    if (error) {
      console.error("Fehler beim Laden des Feedbacks", error);
      toast.warning("Fehler beim Laden des Feedbacks", {
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
    if (data) {
      const formattedData: FeedbackWithInstructor[] = data.map((item) => ({
        ...item,
        feedbackContent: JSON.parse(item.feedback),
      }));

      setRatedFeedback(formattedData);
    }
  }

  useEffect(() => {
    fetchFeedbacks();
  }, [studentId]);

  return (
    <div className="flex min-h-screen  flex-col w-full max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden">
      {/* Header */}
      <div className="flex gap-1 w-full h-24 bg-green-700 py-2 px-3 rounded-xl text-white">
        <div className="flex items-center w-full justify-between">
          <h1 className="text-xl text-white font-bold flex items-center gap-2">
            <User size={28} />
            Feedback zu Fahrstunden
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-gray-800 bg-gray-200">
              <AvatarImage src="/profil1.png" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </div>

          <p className="text-sm font-semibold">Max Mustermann</p>
        </div>
      </div>
      <div className="flex justify-end gap-2 ">
        <Button
          variant="ghost"
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center gap-2 h-8 px-3 text-sm text-green-700 hover:bg-green-200 font-bold border border-green-700 transition"
        >
          <X />
          schließen
        </Button>
      </div>

      <div>
        {/* Kleine Feedback-Kästchen */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-3 overflow-x-hidden">
          {ratedFeedback.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-center text-sm text-slate-500 p-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <MessageSquare className="h-6 w-6 text-green-700" />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-700">
                Kein Feedback vorhanden
              </p>
            </div>
          ) : (
            ratedFeedback.map((feedback) => {
              const isRated = ratedFeedbackIds.includes(feedback.id);

              return (
                <button
                  key={feedback.id}
                  onClick={() => setSelectedFeedback(feedback)}
                  className=" border-2  border-green-700 rounded-xl p-2  hover:bg-green-200 transition overflow-x-hidden"
                >
                  <strong className="flex items-center gap-10">
                    <ChevronRight className="h-5 w-5" />
                    Feedback vom <br />
                    {new Date(feedback.created_at).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </strong>
                  <div className="flex w-full text-sm justify-between">
                    <div className="flex gap-1">
                      <label>F-lehrer:</label>
                      <p> {feedback.instructors.first_name || "Unbekannt"}</p>
                    </div>
                    <div className="flex gap-1">
                      <label>Kl:</label>
                      <p>{feedback.license_class}</p>
                    </div>
                  </div>

                  <Lightbulb
                    onClick={(e) => {
                      e.stopPropagation();
                      setRatedFeedbackIds((prev) =>
                        isRated
                          ? prev.filter((id) => id !== feedback.id)
                          : [...prev, feedback.id],
                      );
                    }}
                    className={`absolute h-5 w-5 bg-gray-50 rounded-2xl cursor-pointer transition ${isRated ? "fill-yellow-400 text-yellow-500" : "text-gray-500"}`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Feedback AnzeigeForm */}
        {selectedFeedback && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-3xl rounded-2xl p-4 max-h-[90vh] overflow-hidden">
              {/* Header  */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl flex gap-1">
                  <p>Feedback vom:</p>
                  {new Date(selectedFeedback.created_at).toLocaleDateString(
                    "de-DE",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    },
                  )}
                </h2>

                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="text-red-600 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-y-auto max-h-[60vh] flex flex-col gap-3">
                <div className="border rounded-md bg-gray-300 p-2">
                  <h3 className="font-bold text-blue-700">
                    Verkehrsbeobachtung
                  </h3>
                  <p>
                    {selectedFeedback.feedbackContent.verkehrsbeobachtung ||
                      "kein Eintrag"}
                  </p>
                </div>

                <div className="border rounded-md bg-gray-300 p-2">
                  <h3 className="font-bold text-blue-700">Geschwindigkeit</h3>
                  <p>
                    {" "}
                    {selectedFeedback.feedbackContent.geschwindigkeit ||
                      "kein Eintrag"}
                  </p>
                </div>

                <div className="border rounded-md bg-gray-300 p-2">
                  <h3 className="font-bold text-blue-700">
                    Fahrzeugpositionierung
                  </h3>
                  <p>
                    {selectedFeedback.feedbackContent.fahrzeugpositionierung ||
                      "kein Eintrag"}
                  </p>
                </div>

                <div className="border rounded-md bg-gray-300 p-2">
                  <h3 className="font-bold text-blue-700">Kommunikation</h3>
                  <p>
                    {" "}
                    {selectedFeedback.feedbackContent.kommunikation ||
                      "kein Eintrag"}
                  </p>
                </div>

                <div className="border rounded-md bg-gray-300 p-2">
                  <h3 className="font-bold text-blue-700">Fahrzeugbedienung</h3>
                  <p>
                    {" "}
                    {selectedFeedback.feedbackContent.fahrzeugbedienung ||
                      "kein Eintrag"}
                  </p>
                </div>

                <div className="border rounded-md bg-blue-300 p-2">
                  <h3 className="font-bold">Allgemein</h3>
                  <p>
                    {" "}
                    {selectedFeedback.feedbackContent.allgemein ||
                      "kein Eintrag"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
