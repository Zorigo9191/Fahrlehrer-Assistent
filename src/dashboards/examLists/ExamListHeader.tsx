import { List } from "lucide-react";

type Role = "instructor" | "office";

type ExamListHeaderProps = {
  role: Role;
  className?: string;
};

export default function ExamListHeader({
  role,
  className,
}: ExamListHeaderProps) {
  if (role === "instructor") {
    return (
      <div
        className={`flex gap-1 w-full bg-blue-700 py-2 px-3 rounded-xl text-white ${className} `}
      >
        <div className="flex items-center w-full justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <List size={32} />
            Prüfungsliste
          </h2>
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
