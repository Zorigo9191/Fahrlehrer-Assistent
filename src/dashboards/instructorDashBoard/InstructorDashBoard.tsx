import { Button } from "@/components/button";
import Footer from "@/components/footer";

import {
  CalendarDays,
  User,
  Zap,
  Pencil,
  Trash2,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExamList from "../examLists/ExamList";

export default function InstructorDashBoard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const instructorDashBoard = (
    <div className="flex flex-col w-full gap-8 py-8 bg-white">
      <div className="flex gap-1 w-full h-full bg-blue-700 py-4 px-3 rounded-xl  text-white">
        <div className=" flex  items-center w-full justify-between">
          <h1 className="text-2xl text-white font-bold items-center flex gap-2 ">
            <GraduationCap size={32} />
            Fahrlehrer Dashboard
          </h1>
          <p className="py-4 px-3">Max MusterMann</p>
        </div>
      </div>

      <div className="flex w-full justify-end">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-3 text-blue-700  hover:bg-blue-100 font-bold border border-blue-700 transition"
        >
          <LogOut className="h-5 w-5 text-blue-700  hover:bg-blue-500 " />
          Abmelden
        </Button>
      </div>

      {/* Fahrstunde vergeben*/}
      <div className="rounded-xl border border-blue-700 p-6">
        <div className="flex items-center gap-3 mb-5">
          <Zap className="text-yellow-500" size={22} />
          <h2 className="text-xl font-bold text-blue-700">
            Fahrstunde zu vergeben
          </h2>
        </div>

        <div className="space-y-2 text-slate-700 p-5">
          <p className="font-bold">Montag • 25.07.2026</p>

          <p className="font-bold">14:00 - 15:30 Uhr</p>
        </div>

        <div className="flex flex-row gap-4 max-md:flex-col mt-6 p-5">
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-3 text-blue-700  hover:bg-blue-100 font-bold border border-blue-700 transition"
          >
            Terminanfrage senden
          </Button>

          <Button
            variant="ghost"
            className="flex items-center gap-2 px-3 text-blue-700  hover:bg-blue-100 font-bold border border-blue-700 transition"
          >
            <Pencil size={16} />
            Bearbeiten
          </Button>

          <Button
            variant="ghost"
            className="flex items-center gap-2 px-3  hover:bg-blue-100 font-bold border border-red-500 text-red-500 transition"
          >
            Abbrechen
          </Button>
        </div>
      </div>

      {/* Angenommene Fahrstunde */}
      <div className="flex flex-col  rounded-xl border border-blue-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <CalendarDays className="text-slate-700" size={22} />
          <h2 className="text-xl font-semibold text-blue-700">
            Angenommene Fahrstunde
          </h2>
        </div>

        <div className="rounded-lg p-5">
          <div className="flex items-center gap-3 mb-3 text-slate-700">
            <CalendarDays size={18} />
            <span>
              Vergebene Fahrstunde:
              <strong> 20.07.2026, 08:30 Uhr</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6 text-slate-700">
            <User size={18} />
            <span>
              Angenommen von:
              <strong> Thomas Bauer B197</strong>
            </span>
          </div>

          <div className="flex flex-row gap-4 max-md:flex-col ">
            <Button className="flex items-center gap-2 rounded-lg border border-blue-500 px-5 py-2 text-blue-600 hover:bg-blue-50 transition">
              <Pencil size={16} />
              Bearbeiten
            </Button>

            <Button className="flex items-center gap-2 rounded-lg border border-red-500 px-5 py-2 text-red-500 hover:bg-red-50 transition">
              <Trash2 size={16} />
              Löschen
            </Button>
          </div>
        </div>
      </div>
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
            {activeTab === "dashboard" && instructorDashBoard}

            {activeTab === "pruefungsliste" && <ExamList />}

            {activeTab === "schuelerliste" && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-700 mb-4">
                  Schülerliste
                </h2>
                <p className="text-slate-600">Hier kommen Schüler hin...</p>
              </div>
            )}
          </div>

          <div className="w-full mt-auto pt-4">
            <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </main>
      </div>
    </div>
  );
}
