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
    <div className="flex h-full flex-col bg-app-elevated px-6 py-10">
      {/* ==================== Header ==================== */}
      <div className="mt-10 flex flex-col items-center md:flex-row md:justify-center md:gap-6">
        {/* AutoLogo */}
        <div className="mb-4 flex justify-center md:mb-0">
          <div className="relative">
            {/* Farbiger Glow */}
            <div className="absolute -inset-2 rounded-full bg-linear-to-r from-green-500 via-blue-500 to-orange-500 opacity-60 blur-md" />

            {/* Farbiger Rahmen */}
            <div className="relative h-32 w-32 rounded-full bg-linear-to-br from-green-500 via-blue-500 to-orange-500 p-1">
              {/* Weißer Innenbereich */}
              <div className="h-full w-full overflow-hidden rounded-full bg-white p-2">
                {/* Logo */}
                <img
                  src={autoLogo}
                  alt="auto-logo"
                  className="h-full w-full rounded-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Titel */}
        <h1 className="text-center text-3xl font-bold leading-8 bg-linear-to-r from-green-500 via-blue-500 to-orange-500 text-transparent bg-clip-text md:text-left">
          Fahrlehrer
          <br />
          Assistent
        </h1>
      </div>

      {/* ==================== Login Buttons ==================== */}
      <div className="mt-12 flex flex-col items-center gap-4 md:flex-row md:justify-center">
        {/* Fahrschüler */}
        <Button
          onClick={() => navigate("/login/student")}
          className="flex h-12 w-70 items-center justify-start gap-4 rounded-xl bg-green-700 px-5 py-4 text-white shadow-xl hover:bg-green-600"
        >
          <User size={22} />
          <span className="font-semibold">Fahrschüler Login</span>
        </Button>

        {/* Fahrlehrer */}
        <Button
          onClick={() => navigate("/login/instructor")}
          className="flex h-12 w-70 items-center justify-start gap-4 rounded-xl bg-blue-700 px-5 py-4 text-white shadow-md hover:bg-blue-600"
        >
          <GraduationCap size={22} />
          <span className="font-semibold">Fahrlehrer Login</span>
        </Button>

        {/* Büro */}
        <Button
          onClick={() => navigate("/login/office")}
          className="flex h-12 w-70 items-center justify-start gap-4 rounded-xl bg-orange-500 px-5 py-4 text-white shadow-md hover:bg-orange-400"
        >
          <Briefcase size={22} />
          <span className="font-semibold">Büromitarbeiter Login</span>
        </Button>
      </div>

      {/* ==================== Footer ==================== */}
      <div className="mt-auto flex flex-col items-start gap-3 pb-3 text-xs text-slate-200 md:flex-row md:items-center md:justify-center">
        {/* Feedback */}
        <div className="flex cursor-pointer items-center gap-2">
          <MessageCircle size={16} />
          <span>Feedback & Hilfe</span>
        </div>

        {/* Kontakt */}
        <div className="flex cursor-pointer items-center gap-2">
          <Phone size={16} />
          <span>Kontakt aufnehmen</span>
        </div>

        {/* Über */}
        <div className="flex cursor-pointer items-center gap-2">
          <Info size={16} />
          <span>Über den Assistenten</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full justify-center bg-app-surface">
      <div
        className="
          w-full
          min-h-screen
          bg-white
          md:my-8
          md:min-h-[calc(100vh-4rem)]
          md:max-w-3xl
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
