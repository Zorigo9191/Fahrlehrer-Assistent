import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { Button } from "@/components/button";
import { AlertTriangle, User, X } from "lucide-react";
import { getExamSlots } from "./studenDashboardService/StudentDashService.ts";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import ExamCard from "../sharedExamLists/ExamCard.tsx";
import type { Database } from "../../types/database.types.ts";

type ExamSlots = Database["public"]["Tables"]["exam_slots"]["Row"];

type ExamAppointmentsProps = {
  setActiveTab: (tab: string) => void;
  studentId: number;
};

export default function ExamAppointment({
  setActiveTab,
  studentId,
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
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden">
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

      <div className="flex flex-col gap-4">
        {examSlot.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Keine Prüfungstermine vorhanden.
          </div>
        ) : (
          examSlot.map((exam) => (
            <ExamCard
              key={exam.id}
              role="student"
              exam={exam}
              onChanged={getExamSlotsForThisStudent}
            />
          ))
        )}
      </div>
    </div>
  );
}
