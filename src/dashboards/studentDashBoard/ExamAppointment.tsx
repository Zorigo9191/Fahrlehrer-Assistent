import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { Button } from "@/components/button";
import { AlertTriangle, CalendarCheck, User, X } from "lucide-react";
import { getExamSlots } from "./studenDashboardService/StudentDashService.ts";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import ExamCard from "../sharedExamLists/ExamCard.tsx";
import type { Database } from "../../types/database.types.ts";

type ExamSlots = Database["public"]["Tables"]["exam_slots"]["Row"] & {
  exam_days: { exam_date: string };
};

type ExamAppointmentsProps = {
  setActiveTab: (tab: string) => void;
  studentId: string;
  avatarUrl: string | null;
  studentName: string;
};

export default function ExamAppointment({
  setActiveTab,
  studentId,
  avatarUrl,
  studentName,
}: ExamAppointmentsProps) {
  const [examSlot, setExamSlot] = useState<ExamSlots[]>([]);

  async function getExamSlotsForThisStudent() {
    const { data, error } = await getExamSlots(studentId);

    if (error) {
      console.error("Fehler beim laden der Prüfungstermine!", error);
      toast.error("Fehler beim Aktualisieren des Tages!", {
        unstyled: true,
        icon: <AlertTriangle className="h-5 w-5 text-gray-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-5 py-4 shadow-md",
          title: "text-gray-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });
      return;
    }
    if (data) {
      setExamSlot(data ?? []);
    }
  }

  useEffect(() => {
    getExamSlotsForThisStudent();
  }, [studentId]);

  return (
    <div className="flex flex-col min-h-screen w-full max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden">
      {/* Header */}
      <div className="flex gap-1 w-full h-24 bg-green-700 py-2 px-3 rounded-xl text-white">
        <div className="flex items-center w-full justify-between">
          <h1 className="text-xl text-white font-bold flex items-center gap-2">
            <User size={28} />
            Prüfungstermine
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-gray-800 bg-gray-200">
              <AvatarImage src={avatarUrl || ""} />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </div>

          <p className="text-sm font-semibold">{studentName}</p>
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

      <div className="flex flex-col gap-4 min-h-90">
        {examSlot.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-slate-500 p-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CalendarCheck className="h-6 w-6 text-green-700" />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-700">
              Keine Prüfungstermine vorhanden.
            </p>
          </div>
        ) : (
          examSlot.map((exam) => (
            <ExamCard
              key={exam.id}
              role="student"
              exam={exam}
              date={exam.exam_days.exam_date}
              onChanged={getExamSlotsForThisStudent}
            />
          ))
        )}
      </div>
    </div>
  );
}
