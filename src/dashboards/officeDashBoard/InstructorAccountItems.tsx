import { Briefcase, Plus, X } from "lucide-react";
import InstructorAccountCard from "./InstructorAccountCard";
import { Button } from "@/components/button";
import { useEffect, useState } from "react";
import InstructorCreateForm from "./InstructorCreateForm";
import { getInstructors } from "./instructorService/InstructorService";

type InstructorAccountItemsProps = {
  setActiveTab: (tab: string) => void;
  officeName: string;
};

type Instructor = {
  created_at: string;
  first_name: string;
  id: string;
  last_name: string;
  phone_number: string | null;
  student_count: number;
  teaching_classes: string[];
};

export default function InstructoAccountItems({
  setActiveTab,
  officeName,
}: InstructorAccountItemsProps) {
  const [createInstructor, setCreateInstructor] = useState(false);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  const loadInstructors = async () => {
    const { data: instructorData, error: instructorError } =
      await getInstructors();

    if (instructorError) {
      console.error(instructorError);
      return;
    }
    setInstructors(instructorData ?? []);
  };

  useEffect(() => {
    loadInstructors();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen max-w-3xl mx-auto gap-6 py-6 bg-app-surface overflow-x-hidden text-sm">
      <div className="flex gap-1 w-full bg-orange-500 py-2 px-3 rounded-xl text-white">
        <div className="flex items-center w-full justify-between p-3">
          <h1 className="text-sm text-slate-200 font-bold flex items-center gap-2 ">
            <Briefcase size={22} />
            Fahrlehrer Konto
          </h1>

          <p className="text-sm font-semibold text-slate-200">
            Mitarbeiter - {officeName}
          </p>
        </div>
      </div>
      <div className="flex  justify-between gap-2 ">
        <Button
          variant="ghost"
          onClick={() => setCreateInstructor(true)}
          className="flex w-52 items-center gap-2 h-8 px-3 text-xs text-orange-600 hover:bg-orange-500  hover:text-slate-200 font-bold border border-slate-200 transition"
        >
          <Plus />
          Fahrlehrer hinzufügen
        </Button>
        {createInstructor && (
          <div className=" fixed overflow-y-auto inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="relative w-full  max-w-md rounded-xl bg-app-elevated p-6 shadow-2xl ">
              <Button
                variant="ghost"
                onClick={() => setCreateInstructor(false)}
                className="absolute cursor-pointer right-3 top-2 text-gray-500 hover:text-slate-200"
              >
                <X />
              </Button>

              <InstructorCreateForm
                onClose={() => {
                  setCreateInstructor(false);
                  loadInstructors();
                }}
              />
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={() => setActiveTab("dashboard")}
          className="flex text-xs items-center gap-2 h-8 px-3  text-orange-500 hover:bg-orange-500 hover:text-slate-200 font-bold border border-slate-200 transition"
        >
          <X />
          schließen
        </Button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 transition-all duration-900 ease-in-out">
        {instructors.map((instructor) => (
          <InstructorAccountCard
            key={instructor.id}
            instructor={instructor}
            refresh={loadInstructors}
          />
        ))}
      </div>
    </div>
  );
}
