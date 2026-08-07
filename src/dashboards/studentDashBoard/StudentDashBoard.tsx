import { Button } from "@/components/button";
import Footer from "@/components/footer";

import {
  User,
  Pencil,
  Trash2,
  LogOut,
  Bell,
  House,
  CalendarPlus,
  MessagesSquare,
  FileX,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import ExamAppointment from "./ExamAppointment.tsx";
import ReceivedFeedback from "./ReceivedFeedback";
import HiddenLessons from "./HiddenLessons";

import DrivingLessonAppointment from "../sharedAppointmentCards/DrivingLessonAppointment.tsx";

const footerItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: House,
    color: "",
  },

  {
    id: "feedbacks",
    label: "Rückmeldungen",
    icon: MessagesSquare,
    color: "",
  },
  {
    id: "exams",
    label: "Ausgeblendet",
    icon: FileX,
    color: "",
  },
];

export default function InstructorDashBoard() {
  const navigate = useNavigate();
  const notificationCount = 12;
  const [activeTab, setActiveTab] = useState("dashboard");

  const studentDashBoard = (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden">
      {/* Header */}
      <div className="flex gap-1 w-full h-24 bg-green-700 py-2 px-3 rounded-xl text-white">
        <div className="flex items-center w-full justify-between">
          <h1 className="text-xl text-white font-bold flex items-center gap-2">
            <User size={28} />
            Schüler Dashboard
          </h1>

          {/* ProfilBild */}

          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-gray-800 bg-gray-200">
                <AvatarImage src="/profil1.png" />
                <AvatarFallback>
                  <Plus className="text-white" />
                </AvatarFallback>
              </Avatar>

              {/* Buttons unter dem Bild */}
              <div className="absolute -bottom-2 -right-1 flex gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-6 w-6 rounded-full bg-white cursor-pointer text-blue-500 hover:text-blue-600"
                >
                  <Pencil size={14} />
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  className="h-6 w-6 rounded-full bg-white cursor-pointer text-red-500 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>

            <p className="text-sm font-semibold">Max Mustermann</p>
          </div>
        </div>
      </div>
      {/* Abmelden */}
      <div className="flex justify-between gap-4">
        {/* Benachritigungen */}
        <div className="flex gap-2">
          <CalendarPlus size={22} /> <strong>Feedbacks</strong>
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
          className="flex items-center gap-2 h-8 px-3 text-sm text-green-700 hover:bg-green-100 font-bold border border-green-700 transition"
        >
          <LogOut size={16} />
          Abmelden
        </Button>
      </div>

      {/* Fahrstunde vergeben */}

      <DrivingLessonAppointment
        role="student"
        instructorId={"21f740a5-0b84-4e4a-9222-1342e05e0026"}
        refreshKey={0}
      />

      {/* Angenommene Fahrstunde */}
      <HiddenLessons />
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
            {activeTab === "dashboard" && studentDashBoard}
            {activeTab === "feedbacks" && (
              <ReceivedFeedback setActiveTab={setActiveTab} />
            )}
            {activeTab === "exams" && (
              <ExamAppointment setActiveTab={setActiveTab} />
            )}
          </div>

          <div className="w-full mt-auto pt-4">
            <Footer
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              items={footerItems}
              color="text-green-700"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
