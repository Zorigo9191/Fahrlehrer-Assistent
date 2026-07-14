import { Button } from "@/components/button";
import { List, X } from "lucide-react";
import ExamCard from "./ExamCard";
import { useState } from "react";

type ExamListProps = {
  setActiveTab: (tab: string) => void;
};

export default function ExamList({ setActiveTab }: ExamListProps) {
  const examDates = ["25.04.2026", "04.05.2026 ", "17.05.2026", "03.06.2026"];

  const [activeDate, setActiveDate] = useState("Datum 1");

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden">
      {/* Header */}
      <div className="flex gap-1 w-full h-full bg-blue-700 py-2 px-3 rounded-xl text-white">
        <div className="flex items-center w-full justify-between">
          <h2 className="text-xl text-white font-bold flex items-center gap-2">
            <List size={32} />
            Prüfungsliste
          </h2>
        </div>
      </div>

      {/* Schließen */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center gap-2 h-8 px-3 text-sm text-blue-700 hover:bg-blue-100 font-bold border border-blue-700 transition"
        >
          <X />
          schließen
        </Button>
      </div>

      {/* Datum */}

      <div className="flex gap-2 flex-wrap">
        {examDates.map((date) => (
          <Button
            key={date}
            variant="ghost"
            onClick={() => setActiveDate(date)}
            className={`border
          >
            ${
              activeDate === date
                ? "bg-blue-700 text-white hover:bg-blue-800"
                : "text-blue-700 hover:bg-blue-100"
            }
            `}
          >
            {date}
          </Button>
        ))}
      </div>
      <div className="border flex flex-col gap-4 p-4 rounded-sm border-blue-700">
        {/* PrüfungsKastchen*/}
        <ExamCard />
        <ExamCard />
        <ExamCard />
        <ExamCard />
      </div>
    </div>
  );
}
