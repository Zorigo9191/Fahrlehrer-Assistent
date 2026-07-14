import { useNavigate, useParams } from "react-router-dom";
import { Briefcase, GraduationCap, User } from "lucide-react";
import { Button } from "@/components/button";
import { LoginForm } from "./LoginForm";

type Role = "student" | "instructor" | "office";

export default function LoginPage() {
  const navigate = useNavigate();
  const { role } = useParams<{ role: Role }>();

  let title = "";
  let titleColor = "";
  let textColor = "";
  let borderColor = "";
  let buttonColor = "";
  let Icon = GraduationCap;

  switch (role) {
    case "student":
      title = "Fahrschüler Login";
      titleColor = "text-green-700";
      textColor = "text-green-700";
      borderColor = "border-green-700";
      buttonColor = "bg-green-700 hover:bg-green-600";
      Icon = User;
      break;

    case "instructor":
      title = "Fahrlehrer Login";
      titleColor = "text-blue-700";
      textColor = "text-blue-700";
      borderColor = "border-blue-700";
      buttonColor = "bg-blue-700 hover:bg-blue-600";
      Icon = GraduationCap;
      break;

    case "office":
      title = "Büromitarbeiter Login";
      titleColor = "text-orange-500";
      textColor = "text-orange-700";
      borderColor = "border-orange-700";
      buttonColor = "bg-orange-500 hover:bg-orange-400";
      Icon = Briefcase;
      break;

    default:
      title = "Login";
      titleColor = "text-black";
      textColor = "text-black";
      borderColor = "border-black";
      buttonColor = "bg-slate-700 hover:bg-slate-600";
      Icon = GraduationCap;
  }

  const content = (
    <div className="flex h-full items-center flex-col px-6 py-10 bg-white">
      {/* Header */}
      <div className="mt-10 mb-8 flex flex-col items-center md:flex-row md:justify-center md:gap-6">
        <h1
          className={`text-center text-2xl font-bold bg-clip-text ${titleColor}`}
        >
          <Icon className="inline-block mr-2" size={32} />
          {title}
        </h1>
      </div>

      {/* Formular-Container */}
      <div className="w-full max-w-md mx-auto">
        <LoginForm buttonColor={buttonColor} role={role} />
      </div>

      {/* Footer-Container mit exakt gleicher Breite (max-w-md) und Abstand nach oben */}
      <div className="w-full max-w-md mx-auto mt-6 pb-3">
        <Button
          onClick={() => navigate("/")}
          className={`
            w-full
            h-12
            md:h-14
            flex
            justify-center
            items-center
            gap-4
            rounded-xl
            px-5
            font-medium
            bg-transparent
            ${textColor}
            ${borderColor}
            border-2
          `}
        >
          <Icon size={20} />
          <span>Zurück zur Rollenauswahl</span>
        </Button>
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
