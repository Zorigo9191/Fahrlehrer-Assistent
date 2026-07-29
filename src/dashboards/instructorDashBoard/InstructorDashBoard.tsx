import { Button } from "@/components/button";
import Footer from "@/components/footer";

import {
  CalendarDays,
  User,
  Pencil,
  Trash2,
  LogOut,
  GraduationCap,
  Bell,
  ClipboardList,
  House,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentList from "../sharedStudentComponents/StudentList.tsx";
import DrivingLessonAppointment from "../appointmentCards/drivingLessonAppointment.tsx";

import ExamList from "../sharedExamLists/ExamList.tsx";

const footerItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: House,
  },
  {
    id: "pruefungsliste",
    label: "Prüfungsliste",
    icon: ClipboardList,
  },
  {
    id: "schuelerliste",
    label: "Schülerliste",
    icon: Users,
  },
];

export default function InstructorDashBoard() {
  const navigate = useNavigate();
  const notificationCount = 12;
  const [activeTab, setActiveTab] = useState("dashboard");

  const instructorDashBoard = (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden">
      {/* Header */}
      <div className="flex gap-1 w-full bg-blue-700 py-2 px-3 rounded-xl text-white">
        <div className="flex items-center w-full justify-between">
          <h1 className="text-xl text-white font-bold flex items-center gap-2">
            <GraduationCap size={28} />
            Fahrlehrer Dashboard
          </h1>

          <p className="text-sm font-semibold">Max MusterMann</p>
        </div>
      </div>

      {/* Abmelden */}
      <div className="flex justify-between gap-4">
        {/* Benachritigungen */}
        <div className="flex gap-2">
          <ClipboardList size={22} /> Prüfungsliste
          <div className="relative">
            <Bell className="text-yellow-500" size={20} />

            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 h-8 px-3 text-sm text-blue-700 hover:bg-blue-100 font-bold border border-blue-700 transition"
        >
          <LogOut size={16} />
          Abmelden
        </Button>
      </div>

      {/* Fahrstunde vergeben */}
      <DrivingLessonAppointment role={"instructor"} />

      {/* Angenommene Fahrstunde */}
      <div className="rounded-xl border border-blue-700 p-4">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="text-slate-700" size={20} />

          <h2 className="text-lg font-bold text-blue-700">
            Angenommene Fahrstunde
          </h2>
        </div>

        <div className="rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3 text-slate-700 text-sm">
            <CalendarDays size={16} />

            <span>
              Vergebene Fahrstunde:
              <strong> 20.07.2026, 08:30 Uhr</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 mb-5 text-slate-700 text-sm">
            <User size={16} />

            <span>
              Angenommen von:
              <strong> Thomas Bauer B197</strong>
            </span>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="ghost"
              className="flex w-52 items-center gap-2 h-8 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100"
            >
              <Pencil size={14} />
              Bearbeiten
            </Button>

            <Button
              variant="ghost"
              className="flex w-52 items-center gap-2 h-8 px-3 text-sm border border-red-500 text-red-500 hover:bg-red-50"
            >
              <Trash2 size={14} />
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
            {activeTab === "pruefungsliste" && (
              <ExamList role="instructor" setActiveTab={setActiveTab} />
            )}
            {activeTab === "schuelerliste" && (
              <StudentList setActiveTab={setActiveTab} />
            )}
          </div>

          <div className="w-full mt-auto pt-4">
            <Footer
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              items={footerItems}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
