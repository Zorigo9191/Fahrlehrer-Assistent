import ExamCard from "./ExamCard";
import { useState } from "react";
import ExamListHeader from "./ExamListHeader";
import { Check, Pencil, X } from "lucide-react";

type ExamListProps = {
  setActiveTab: (tab: string) => void;
  role: Role;
  showActions?: boolean;
};

type Role = "instructor" | "office";

export default function ExamList({
  role,
  showActions = false,
  setActiveTab,
}: ExamListProps) {
  let textColor = "";
  let borderColor = "";
  let bgColor = "";

  switch (role) {
    case "instructor":
      textColor = "text-blue-700";
      borderColor = "border-blue-700";
      bgColor = "bg-blue-700";
      break;

    case "office":
      textColor = "text-orange-700";
      borderColor = "border-orange-500";
      bgColor = "bg-orange-500";
      break;

    default:
      textColor = "text-black";
      borderColor = "border-black";
      bgColor = "bg-orange-500";
  }

  const [examDates, setExamDates] = useState([
    "25.04.2026",
    "04.05.2026 ",
    "17.05.2026",
    "03.06.2026",
  ]);

  const examAppointmenst = [
    { time: "08:55" },
    { time: "09:50" },
    { time: "10:45" },
    { time: "11:40" },
    { time: "12:30" },
    { time: "13:25" },
  ];
  const [activeDate, setActiveDate] = useState("");
  const [editingDate, setEditingDate] = useState<string | null>("");

  const updateDate = (oldDate: string, newDate: string) => {
    setExamDates((prev) =>
      prev.map((date) => (date === oldDate ? newDate : date)),
    );
  };

  const removeDate = (date: string) => {
    setExamDates((prev) => prev.filter((d) => d !== date));
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden">
      {/* Header */}
      <ExamListHeader role={role} setActiveTab={setActiveTab} />

      {/* Datum */}

      <div className="flex gap-2 flex-wrap">
        {examDates.map((date) => (
          <div
            key={date}
            className={`flex items-center gap-2 border px-3 py-2 rounded-md ${
              activeDate === date ? `${bgColor} text-white` : textColor
            }`}
          >
            {editingDate === date ? (
              <>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => updateDate(date, e.target.value)}
                  className="text-black rounded px-2"
                />

                <Check
                  size={18}
                  className="cursor-pointer"
                  onClick={() => setEditingDate(null)}
                />
              </>
            ) : (
              <>
                {showActions && (
                  <>
                    <Pencil
                      size={16}
                      className="cursor-pointer  hover:text-black "
                      onClick={() => setEditingDate(date)}
                    />

                    <X
                      size={20}
                      className="cursor-pointer hover:text-black "
                      onClick={() => removeDate(date)}
                    />
                  </>
                )}
                <button type="button" onClick={() => setActiveDate(date)}>
                  {new Date(date).toLocaleDateString("de-DE")}
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <div
        className={`border flex flex-col gap-4 p-4 rounded-sm border: ${borderColor}`}
      >
        {/* PrüfungsKastchen*/}
        {examAppointmenst.map((appointment) => (
          <ExamCard
            key={appointment.time}
            color={role === "instructor" ? "instructor" : "office"}
            time={appointment.time}
          />
        ))}
      </div>
    </div>
  );
}
