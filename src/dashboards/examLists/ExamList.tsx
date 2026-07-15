import { Button } from "@/components/button";
import { List } from "lucide-react";
import ExamCard from "./ExamCard";
import { useState } from "react";
import ExamListHeader from "./ExamListHeader";

type ExamListProps = {
  setActiveTab: (tab: string) => void;
  role: Role;
};

type Role = "instructor" | "office";

export default function ExamList({ role }: ExamListProps) {
  let titleColor = "";
  let textColor = "";
  let borderColor = "";
  let buttonColor = "";
  let bgColor = "";
  let buttonHover = "";

  switch (role) {
    case "instructor":
      titleColor = "text-blue-700";
      textColor = "text-blue-700";
      borderColor = "border-blue-700";
      buttonColor = "bg-blue-700 hover:bg-blue-600";
      bgColor = "bg-blue-700";
      buttonHover = "bg-blue-100";
      break;

    case "office":
      titleColor = "text-orange-500";
      textColor = "text-orange-700";
      borderColor = "border-orange-500";
      buttonColor = "bg-orange-500 hover:bg-orange-400";
      bgColor = "bg-orange-500";
      buttonHover = "bg-orange-200";
      break;

    default:
      titleColor = "text-black";
      textColor = "text-black";
      borderColor = "border-black";
      buttonColor = "bg-slate-700 hover:bg-slate-600";
      bgColor = "bg-orange-500";
  }

  const examDates = ["25.04.2026", "04.05.2026 ", "17.05.2026", "03.06.2026"];
  const examAppointmenst = [
    { time: "08:55" },
    { time: "09:50" },
    { time: "10:45" },
    { time: "11:40" },
    { time: "12:30" },
    { time: "13:25" },
  ];
  const [activeDate, setActiveDate] = useState("Datum 1");

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden">
      {/* Header */}
      <ExamListHeader role={role} className="" />

      {/* Datum */}

      <div className="flex gap-2 flex-wrap">
        {examDates.map((date) => (
          <Button
            key={date}
            variant="ghost"
            onClick={() => setActiveDate(date)}
            className={`border
          
            ${
              activeDate === date
                ? `${bgColor} text-white ${buttonColor}`
                : `${textColor} hover:${buttonHover}`
            }
            `}
          >
            {date}
          </Button>
        ))}
      </div>
      <div
        className={`border flex flex-col gap-4 p-4 rounded-sm border: ${borderColor}`}
      >
        {/* PrüfungsKastchen*/}
        {examAppointmenst.map((appointment) => (
          <ExamCard
            color={role === "instructor" ? "instructor" : "office"}
            time={appointment.time}
          />
        ))}
      </div>
    </div>
  );
}
