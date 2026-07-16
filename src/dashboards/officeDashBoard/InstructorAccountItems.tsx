import { Briefcase, Plus, X } from "lucide-react";
import InstructorAccountCard from "./InstructorAccountCard";
import { Button } from "@/components/button";
import { useState } from "react";
import InstructorCreateForm from "./InstructorCreateForm";

const instructorItems = [
  {
    id: 1,
    name: "Tomas Stelzer",
    password: "as121231",
    klasse: "A,B,  BE , CE",
    telefon: "01767575752",
    created_at: "01.12.2018",
    student_count: "32",
  },
  {
    id: 2,
    name: "Tomas Stelzer",
    password: "as121231",
    klasse: "A,B,  BE , CE",
    telefon: "01767575752",
    created_at: "01.10.2020",
    student_count: "32",
  },
  {
    id: 3,
    name: "Tomas Stelzer",
    password: "as121231",
    klasse: "A,B,  BE , CE",
    telefon: "01767575752",
    created_at: "01.12.2023",
    student_count: "32",
  },
  {
    id: 3,
    name: "Tomas Stelzer",
    password: "as121231",
    klasse: "A,B,  BE , CE",
    telefon: "01767575752",
    created_at: "01.12.2023",
    student_count: "32",
  },
  {
    id: 3,
    name: "Tomas Stelzer",
    password: "as121231",
    klasse: "A,B,  BE , CE",
    telefon: "01767575752",
    created_at: "01.12.2023",
    student_count: "32",
  },
  {
    id: 3,
    name: "Tomas Stelzer",
    password: "as121231",
    klasse: "A,B,  BE , CE",
    telefon: "01767575752",
    created_at: "01.12.2023",
    student_count: "32",
  },
];

type InstructorAccountItemsProps = {
  setActiveTab: (tab: string) => void;
};

export default function InstructoAccountItems({
  setActiveTab,
}: InstructorAccountItemsProps) {
  const [createInstructor, setCreateInstructor] = useState(false);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden text-sm">
      <div className="flex gap-1 w-full bg-orange-500 py-2 px-3 rounded-xl text-white">
        <div className="flex items-center w-full justify-between">
          <h1 className="text-xl text-white font-bold flex items-center gap-2">
            <Briefcase size={28} />
            Fahrlehrer Konto
          </h1>

          <p className="text-sm font-semibold">Max MusterMann</p>
        </div>
      </div>
      <div className="flex  justify-between gap-2 ">
        <Button
          variant="ghost"
          onClick={() => setCreateInstructor(true)}
          className="flex w-52 items-center gap-2 h-8 px-3 text-sm text-orange-500 hover:bg-orange-200 font-bold border border-orange-500 transition"
        >
          <Plus />
          Fahrlehrer hinzufügen
        </Button>
        {createInstructor && (
          <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className=" relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
              <Button
                variant="ghost"
                onClick={() => setCreateInstructor(false)}
                className="absolute border right-4 top-3 text-gray-500 hover:text-black"
              >
                <X />
              </Button>

              <InstructorCreateForm
                onClose={() => {
                  setCreateInstructor(false);
                }}
              />
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center gap-2 h-8 px-3 text-sm text-orange-500 hover:bg-orange-200 font-bold border border-orange-500 transition"
        >
          <X />
          schließen
        </Button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 transition-all duration-900 ease-in-out">
        {instructorItems.map((instructor) => (
          <InstructorAccountCard key={instructor.id} instructor={instructor} />
        ))}
      </div>
    </div>
  );
}
