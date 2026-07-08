import autoLogo from "@/assets/autoLogo.png";
import {
  User,
  GraduationCap,
  Briefcase,
  MessageCircle,
  Phone,
  Info,
} from "lucide-react";
import { Button } from "@/components/button";
import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const navigate = useNavigate();

  const content = (
    <div className="flex h-full flex-col px-6 py-10 bg-white">
      {/* AutoLogo */}
      <div className="mt-10 flex flex-col items-center md:flex-row md:justify-center md:gap-6">
        <div className="mb-4 flex justify-center md:mb-0">
          <img
            src={autoLogo}
            alt="auto-logo"
            className="w-30 h-30 object-contain"
          />
        </div>

        <h1 className="text-center text-3xl font-bold leading-8 bg-linear-to-r from-green-500 via-blue-500 to-orange-500 text-transparent bg-clip-text md:text-left">
          Fahrlehrer
          <br />
          Assistent
        </h1>
      </div>

      {/* Login Buttons */}
      <div className="mt-12 flex flex-col items-center gap-4 md:flex-row md:justify-center">
        <Button
          onClick={() => navigate("/login/student")}
          className="flex w-70 h-15 justify-start items-center gap-4 rounded-xl bg-green-700 px-5 py-4 text-white shadow-md hover:bg-green-600"
        >
          <User size={24} />
          <span className="font-semibold">Fahrschüler Login</span>
        </Button>

        <Button
          onClick={() => navigate("/login/instructor")}
          className="flex w-70 h-15 justify-start items-center gap-4 rounded-xl bg-blue-700 px-5 py-4 text-white shadow-md hover:bg-blue-600"
        >
          <GraduationCap size={24} />
          <span className="font-semibold">Fahrlehrer Login</span>
        </Button>

        <Button
          onClick={() => navigate("/login/office")}
          className="flex w-70 h-15 justify-start items-center gap-4 rounded-xl bg-orange-500 px-5 py-4 text-white shadow-md hover:bg-orange-400"
        >
          <Briefcase size={24} />
          <span className="font-semibold">Büromitarbeiter Login</span>
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-auto flex flex-col items-start gap-3 pb-3 text-slate-700 md:flex-row md:justify-center md:items-center">
        <div className="flex items-center gap-2 ">
          <MessageCircle size={20} />
          <span>Feedback & Hilfe</span>
        </div>

        <div className="flex items-center gap-2 ">
          <Phone size={20} />
          <span>Kontakt aufnehmen</span>
        </div>

        <div className="flex items-center gap-2 ">
          <Info size={20} />
          <span>Über den Assistenten</span>
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
      "
      >
        {content}
      </div>
    </div>
  );
}
