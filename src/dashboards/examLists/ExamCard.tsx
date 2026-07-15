import { Button } from "@/components/button";
import Statuslight, { type Status } from "@/components/statusLights";

import { Zap, Pencil, Trash2, Clock, Car, Bike, Save } from "lucide-react";
import { useState } from "react";

const styles = {
  instructor: {
    text: "text-blue-700",
    border: "border-blue-700",
    hover: "hover:bg-blue-100",
  },
  office: {
    text: "text-orange-500",
    border: "border-orange-500",
    hover: "hover:bg-orange-100",
  },
};

type ExamCardProps = {
  color: "instructor" | "office";
  time: string;
};

const licenseClasses = [
  { value: "B197", type: "car" },
  { value: "B78", type: "car" },
  { value: "B", type: "car" },
  { value: "BE", type: "car" },
  { value: "AM", type: "bike" },
  { value: "A1", type: "bike" },
  { value: "A2", type: "bike" },
  { value: "A", type: "bike" },
];

export default function ExamCard({ color, time }: ExamCardProps) {
  const [selectedClass, setSelectedClass] = useState("B197");
  const [status] = useState<Status>("red");

  const selectedLicense = licenseClasses.find(
    (license) => license.value === selectedClass,
  );

  return (
    <div className="rounded-xl p-4 overflow-hidden bg-gray-100 ">
      <div className="flex items-center gap-4 mb-4">
        <Zap className="text-yellow-500" size={20} />

        <h2 className={`text-lg font-bold  ${styles[color].text}`}>
          Prüfungsplatz
        </h2>
        <Statuslight status={status} />
      </div>

      <div className="flex items-center gap-10 flex-wrap">
        <div className="flex items-center gap-2">
          <Clock className={styles[color].text} size={18} />
          <span className="text-sm font-semibold">{time}</span>
        </div>

        <div className="flex gap-3 items-center text-sm font-semibold">
          Thomas Bauer
          <div className="flex items-center gap-2">
            {selectedLicense?.type === "bike" ? (
              <Bike className={styles[color].text} size={18} />
            ) : (
              <Car className={styles[color].text} size={18} />
            )}

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm"
            >
              {licenseClasses.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.value}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-5 flex-wrap">
        <Button
          variant="ghost"
          className={`h-8 w-52 px-3 text-sm border ${styles[color].border} ${styles[color].text} ${styles[color].hover}`}
        >
          <Save className="mr-2 h-4 w-4" />
          Speichern
        </Button>

        <Button
          variant="ghost"
          className={`flex w-52 items-center gap-2 h-8 px-3 text-sm border ${styles[color].border} ${styles[color].text} ${styles[color].hover}`}
        >
          <Pencil size={14} />
          Bearbeiten
        </Button>

        <Button
          variant="ghost"
          className="flex w-52 items-center gap-2 h-8 px-3 text-sm border border-red-500 text-red-600 hover:bg-red-200"
        >
          <Trash2 size={14} />
          Löschen
        </Button>
      </div>
    </div>
  );
}
