import { Button } from "@/components/button";
import { List, X } from "lucide-react";

type Role = "instructor" | "office";

type ExamListHeaderProps = {
  role: Role;
  className?: string;
  instructorName: string;
  setActiveTab: (tab: string) => void;
};

export default function ExamListHeader({
  role,
  className,
  instructorName,
  setActiveTab,
}: ExamListHeaderProps) {
  console.log("ExamListHeader instructorName:", JSON.stringify(instructorName));
  if (role === "instructor") {
    return (
      <div>
        <div
          className={`flex gap-1 w-full bg-blue-700 py-2 px-3 rounded-xl text-slate-200 ${className} `}
        >
          <div className="flex items-center w-full justify-between">
            <h2 className="text-sm font-bold flex items-center gap-2 p-3">
              <List size={22} />
              Prüfungsliste
            </h2>
            <p className="text-sm font-semibold">{instructorName}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center justify-end gap-2 h-8 px-3 text-xs text-slate-200 hover:bg-blue-700 font-bold border border-slate-200 transition mt-6 "
          >
            <X />
            schließen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-1 w-full h-full bg-gray-200 py-2 px-3 ">
      <div className="flex items-center w-full justify-between">
        <h2 className="text-xl text-orange-500 font-bold flex items-center gap-2">
          <List size={32} />
          Verwaltung aller Prüfungstermine
        </h2>
      </div>
    </div>
  );
}
