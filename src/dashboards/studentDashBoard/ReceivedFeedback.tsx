import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { Button } from "@/components/button";
import { ChevronRight, Lightbulb, User, X } from "lucide-react";
import { useState } from "react";

const feedbacks = [
  {
    id: 1,
    date: "12.05.2026",
    verkehrsbeobachtung:
      "Unzureichende VK Beobachtung sadsajdjasdjasjdasjdasjdjasjdajsdjasjdajsdjasjdajsjjsdja",
    geschwindigkeit: "Unzureichende Geschwindigkeit",
    fahrzeugpositionierung: "Falsche Positionierung",
    kommunikation: "Kommunikation verbessern",
    fahrzeugbedienung: "Bedienung unsicher",
    allgemein: "Insgesamt ordentlich gefahren.",
  },
  {
    id: 2,
    date: "20.05.2026",
    verkehrsbeobachtung: "Sehr gute Beobachtung",
    geschwindigkeit: "Geschwindigkeit passend",
    fahrzeugpositionierung: "Gut",
    kommunikation: "Gut",
    fahrzeugbedienung: "Sicher",
    allgemein: "Fortschritt erkennbar.",
  },

  {
    id: 3,
    date: "12.05.2026",
    verkehrsbeobachtung:
      "Unzureichende VK Beobachtung sadsajdjasdjasjdasjdasjdjasjdajsdjasjdajsdjasjdajsjjsdja",
    geschwindigkeit: "Unzureichende Geschwindigkeit",
    fahrzeugpositionierung: "Falsche Positionierung",
    kommunikation: "Kommunikation verbessern",
    fahrzeugbedienung: "Bedienung unsicher",
    allgemein: "Insgesamt ordentlich gefahren.",
  },

  {
    id: 4,
    date: "12.05.2026",
    verkehrsbeobachtung:
      "Unzureichende VK Beobachtung sadsajdjasdjasjdasjdasjdjasjdajsdjasjdajsdjasjdajsjjsdja",
    geschwindigkeit: "Unzureichende Geschwindigkeit",
    fahrzeugpositionierung: "Falsche Positionierung",
    kommunikation: "Kommunikation verbessern",
    fahrzeugbedienung: "Bedienung unsicher",
    allgemein: "Insgesamt ordentlich gefahren.",
  },
];

type Feedback = {
  id: number;
  date: string;
  verkehrsbeobachtung: string;
  geschwindigkeit: string;
  fahrzeugpositionierung: string;
  kommunikation: string;
  fahrzeugbedienung: string;
  allgemein: string;
};

type ReceivedFeedbackProps = {
  setActiveTab: (tab: string) => void;
};

export default function ReceivedFeedback({
  setActiveTab,
}: ReceivedFeedbackProps) {
  const [ratedFeedbacks, setRatedFeedbacks] = useState<number[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null,
  );

  return (
    <div className="flex  flex-col w-full max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden">
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
        <div className="grid grid-cols-3 gap-3 overflow-x-hidden">
          {feedbacks.map((feedback) => {
            const isRated = ratedFeedbacks.includes(feedback.id);

            return (
              <button
                key={feedback.id}
                onClick={() => setSelectedFeedback(feedback)}
                className=" border-2  border-green-700 rounded-xl p-2  hover:bg-green-200 transition overflow-x-hidden"
              >
                <strong className="flex items-center gap-10">
                  <ChevronRight className="h-5 w-5" />
                  Feedback vom <br />
                  {feedback.date}
                </strong>

                <Lightbulb
                  onClick={(e) => {
                    e.stopPropagation();
                    setRatedFeedbacks((prev) =>
                      isRated
                        ? prev.filter((id) => id !== feedback.id)
                        : [...prev, feedback.id],
                    );
                  }}
                  className={`absolute h-5 w-5 bg-gray-50 rounded-2xl cursor-pointer transition ${isRated ? "fill-yellow-400 text-yellow-500" : "text-gray-500"}`}
                />
              </button>
            );
          })}
        </div>

        {/* Feedback AnzeigeForm */}
        {selectedFeedback && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-3xl rounded-2xl p-4 max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl">
                  Feedback vom {selectedFeedback.date}
                </h2>

                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="text-red-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-y-auto max-h-[60vh] flex flex-col gap-3">
                <div className="border rounded-md bg-gray-300 p-2">
                  <h3 className="font-bold text-blue-700">
                    Verkehrsbeobachtung
                  </h3>
                  <p>{selectedFeedback.verkehrsbeobachtung}</p>
                </div>

                <div className="border rounded-md bg-gray-300 p-2">
                  <h3 className="font-bold text-blue-700">Geschwindigkeit</h3>
                  <p>{selectedFeedback.geschwindigkeit}</p>
                </div>

                <div className="border rounded-md bg-gray-300 p-2">
                  <h3 className="font-bold text-blue-700">
                    Fahrzeugpositionierung
                  </h3>
                  <p>{selectedFeedback.fahrzeugpositionierung}</p>
                </div>

                <div className="border rounded-md bg-gray-300 p-2">
                  <h3 className="font-bold text-blue-700">Kommunikation</h3>
                  <p>{selectedFeedback.kommunikation}</p>
                </div>

                <div className="border rounded-md bg-gray-300 p-2">
                  <h3 className="font-bold text-blue-700">Fahrzeugbedienung</h3>
                  <p>{selectedFeedback.fahrzeugbedienung}</p>
                </div>

                <div className="border rounded-md bg-blue-300 p-2">
                  <h3 className="font-bold">Allgemein</h3>
                  <p>{selectedFeedback.allgemein}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
