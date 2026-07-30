import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { Button } from "@/components/button";
import { User, X } from "lucide-react";
import AcceptedDrivingLesson from "../sharedAppointmentCards/AcceptedDrivingLesson.tsx";

type HiddenLessonsProps = {
  setActiveTab: (tab: string) => void;
};

export default function HiddenLessons({ setActiveTab }: HiddenLessonsProps) {
  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden">
      {/* Header */}
      <div className="flex gap-1 w-full h-24 bg-green-700 py-2 px-3 rounded-xl text-white">
        <div className="flex items-center w-full justify-between">
          <h1 className="text-xl text-white font-bold flex items-center gap-2">
            <User size={28} />
            Ausgeblendete Fahrstunden
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-gray-800 bg-gray-200">
              <AvatarImage src="/profil1.png" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </div>

          <p className="text-sm font-semibold">Max Mustermann</p>
        </div>
      </div>
      <div className="flex justify-end gap-2 ">
        <Button
          variant="ghost"
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center gap-2 h-8 px-3 text-sm text-green-700 hover:bg-green-200 font-bold border border-green-700 transition"
        >
          <X />
          schließen
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 ">
        <AcceptedDrivingLesson role="student" variant="hidden" />
        <AcceptedDrivingLesson role="student" variant="hidden" />
        <AcceptedDrivingLesson role="student" variant="hidden" />
        <AcceptedDrivingLesson role="student" variant="hidden" />
        <AcceptedDrivingLesson role="student" variant="hidden" />
      </div>
    </div>
  );
}
