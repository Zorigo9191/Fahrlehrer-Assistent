import { Button } from "@/components/button";
import Footer from "@/components/footer";

import {
  LogOut,
  Briefcase,
  Plus,
  House,
  User,
  X,
  ListCheck,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InstructoAccountItems from "./InstructorAccountItems";
import DateCreateForm from "./DateCreateFrom";
import ExamList from "../examLists/ExamList";
import StudentCheck from "./StudentCheck";

const footerItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: House,
    color: "text-blue-600 bg-transparent",
  },

  {
    id: "student_check",
    label: "Schüler überprüfen",
    icon: ListCheck,
    color: "text-blue-600 bg-transparent",
  },
  {
    id: "instructor_acc",
    label: "Fahrlehrer Konto",
    icon: User,
    color: "text-blue-600 bg-transparent",
  },
];

export default function OfficeDashBoard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [createDate, setCreateDate] = useState(false);

  const officeDashBoard = (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden">
      {/* Header */}
      <div className="flex gap-1 w-full bg-orange-500 py-2 px-3 rounded-xl text-white">
        <div className="flex items-center w-full justify-between">
          <h1 className="text-xl text-white font-bold flex items-center gap-2">
            <Briefcase size={28} />
            Büro Dashboard
          </h1>

          <p className="text-sm font-semibold">Max MusterMann</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 font-bold text-black">
        <Button
          onClick={() => setCreateDate(true)}
          className="border text-md text-orange-500 font-bold hover:bg-orange-500 hover:text-white"
        >
          <Plus />
          Prüfungsdatum hinzufügen
        </Button>
        {createDate && (
          <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="relative  w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
              <Button
                variant="ghost"
                onClick={() => setCreateDate(false)}
                className="absolute border right-4 top-3 text-gray-500 hover:text-black"
              >
                <X />
              </Button>

              <DateCreateForm
                onClose={() => {
                  setCreateDate(false);
                }}
              />
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 h-8 px-3 text-sm text-orange-500  hover:bg-orange-500 hover:text-white font-bold border border-orange-500 transition "
        >
          <LogOut size={16} />
          Abmelden
        </Button>
      </div>

      <ExamList
        setActiveTab={setActiveTab}
        showActions={true}
        role={"office"}
      />
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-slate-100 flex justify-center">
      <div
        className="
          w-full
          min-h-screen
          bg-white
          md:max-w-3xl
          md:my-8
          md:min-h-[calc(100vh-4rem)]
          md:rounded-2xl
          md:shadow-xl
          lg:max-w-5xl
          flex flex-col
          overflow-hidden
        "
      >
        <main className="flex-1 p-4 pb-8">
          <div className="flex-1">
            {activeTab === "dashboard" && officeDashBoard}
            {activeTab === "instructor_acc" && (
              <InstructoAccountItems setActiveTab={setActiveTab} />
            )}
            {activeTab === "student_check" && (
              <StudentCheck setActiveTab={setActiveTab} />
            )}
          </div>

          <div className="w-full mt-auto pt-4">
            <Footer
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              items={footerItems}
              color="text-orange-500"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
