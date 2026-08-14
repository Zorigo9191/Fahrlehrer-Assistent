import { Button } from "@/components/button";
import Footer from "@/components/footer";

import {
  User,
  Pencil,
  Trash2,
  LogOut,
  Bell,
  House,
  MessagesSquare,
  FileX,
  Plus,
  AlertTriangle,
  StickyNotes,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import ExamAppointment from "./ExamAppointment.tsx";
import ReceivedFeedback from "./ReceivedFeedback";
import HiddenLessons from "./HiddenLessons";

import DrivingLessonAppointment from "../sharedAppointmentCards/DrivingLessonAppointment.tsx";
import { getFeedbacks } from "../sharedStudentComponents/sharedService/SharedService.ts";

import type { Database } from "../../types/database.types.ts";
import { toast } from "sonner";

type SavedFeedbacksRow =
  Database["public"]["Tables"]["student_feedback"]["Row"] & {
    instructors: {
      first_name: string;
    } | null;
  };

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
    label: "Prüfungstermine",
    icon: FileX,
    color: "",
  },
];

export default function InstructorDashBoard() {
  const navigate = useNavigate();

  const [savedFeedbacks, setSavedFeedbacks] = useState<SavedFeedbacksRow[]>([]);

  const [activeTab, setActiveTab] = useState("dashboard");

  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);

  const studentId = 114;

  // Nur neue Feedbacks zählen
  const notificationCount = savedFeedbacks.filter(
    (feedback) => feedback.read_at === null,
  ).length;

  async function loadSavedFeedbacks() {
    const { data, error } = await getFeedbacks(studentId);

    if (error) {
      console.error("Fehler beim Laden der gespeicherten Feedbacks", error);

      toast.error("Fehler beim Laden der Feedbacks!", {
        unstyled: true,
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
          title: "text-red-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });

      return;
    }

    setSavedFeedbacks(data ?? []);
  }

  useEffect(() => {
    loadSavedFeedbacks();
  }, [studentId]);

  // FeedGlocke schließt, wenn außerhalb geklickt wird
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const studentDashBoard = (
    <div className="flex min-h-screen w-full max-w-3xl mx-auto flex-col gap-6 overflow-x-hidden bg-white py-6">
      {/* Header */}
      <div className="flex h-24 w-full gap-1 rounded-xl bg-green-700 px-3 py-2 text-white">
        <div className="flex w-full items-center justify-between">
          <h1 className="flex items-center gap-2 text-xl font-bold text-white">
            <User size={28} />
            Schüler Dashboard
          </h1>

          {/* Profilbild */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-gray-800 bg-gray-200">
                <AvatarImage src="/profil1.png" />

                <AvatarFallback>
                  <Plus className="text-white" />
                </AvatarFallback>
              </Avatar>

              <div className="absolute -bottom-2 -right-1 flex gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-6 w-6 cursor-pointer rounded-full bg-white text-blue-500 hover:text-blue-600"
                >
                  <Pencil size={14} />
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  className="h-6 w-6 cursor-pointer rounded-full bg-white text-red-500 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>

            <p className="text-sm font-semibold">Max Mustermann</p>
          </div>
        </div>
      </div>

      {/* Feedbacks + Abmelden */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <StickyNotes size={22} />

          <strong>Feedbacks</strong>

          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative flex cursor-pointer items-center justify-center p-1"
            >
              <Bell className="text-yellow-500" size={20} />

              {notificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotifications && (
              <div className="absolute -left-30 top-9 z-50 w-80 rounded-lg border border-gray-200 bg-white p-3 shadow-xl">
                <h3 className="mb-3 text-sm font-bold text-gray-800">
                  Feedbacks
                </h3>

                <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
                  {savedFeedbacks.map((feedback) => {
                    const isNew = feedback.read_at === null;

                    return (
                      <div
                        key={feedback.id}
                        className={`rounded-lg border p-2 ${
                          isNew
                            ? "border-gray-300 bg-white text-black"
                            : "border-gray-200 bg-gray-100 text-gray-400"
                        }`}
                      >
                        <div className="text-xs font-semibold">
                          {new Date(feedback.created_at).toLocaleDateString(
                            "de-DE",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )}
                        </div>

                        <div className="text-xs">
                          Fahrlehrer:{" "}
                          {feedback.instructors?.first_name ?? "Unbekannt"}
                        </div>

                        <div className="text-xs">
                          Klasse: {feedback.license_class ?? "Unbekannt"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Abmelden */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="flex h-8 items-center gap-2 border border-green-700 px-3 text-sm font-bold text-green-700 transition hover:bg-green-100"
        >
          <LogOut size={16} />
          Abmelden
        </Button>
      </div>

      {/* Fahrstunde vergeben */}
      <DrivingLessonAppointment
        role="student"
        instructorId="6128533f-d2b2-4933-93c5-84bc619a11d5"
        refreshKey={0}
      />

      {/* Angenommene Fahrstunde */}
      <HiddenLessons studentId={studentId} />
    </div>
  );

  return (
    <div className="flex min-h-screen w-full justify-center bg-slate-100">
      <div
        className="
          flex
          min-h-screen
          w-full
          flex-col
          overflow-hidden
          bg-white
          md:my-8
          md:min-h-[calc(100vh-4rem)]
          md:max-w-3xl
          md:rounded-2xl
          md:shadow-xl
          lg:max-w-5xl
        "
      >
        <main className="flex-1 p-4 pb-8">
          <div className="flex-1">
            {activeTab === "dashboard" && studentDashBoard}

            {activeTab === "feedbacks" && (
              <ReceivedFeedback setActiveTab={setActiveTab} studentId={114} />
            )}

            {activeTab === "exams" && (
              <ExamAppointment setActiveTab={setActiveTab} studentId={114} />
            )}
          </div>

          <div className="mt-auto w-full pt-4">
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
// import { Button } from "@/components/button";
// import Footer from "@/components/footer";

// import {
//   User,
//   Pencil,
//   Trash2,
//   LogOut,
//   Bell,
//   House,

//   MessagesSquare,
//   FileX,
//   Plus,
//   AlertTriangle,
//   StickyNotes,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
// import ExamAppointment from "./ExamAppointment.tsx";
// import ReceivedFeedback from "./ReceivedFeedback";
// import HiddenLessons from "./HiddenLessons";

// import DrivingLessonAppointment from "../sharedAppointmentCards/DrivingLessonAppointment.tsx";
// import { getFeedbacks } from "../sharedStudentComponents/sharedService/SharedService.ts";
// import type { Database } from "../../types/database.types.ts";
// import { toast } from "sonner";

// type SavedFeedbacksRow =
//   Database["public"]["Tables"]["student_feedback"]["Row"];

// const footerItems = [
//   {
//     id: "dashboard",
//     label: "Dashboard",
//     icon: House,
//     color: "",
//   },

//   {
//     id: "feedbacks",
//     label: "Rückmeldungen",
//     icon: MessagesSquare,
//     color: "",
//   },
//   {
//     id: "exams",
//     label: "Prüfungstermine",
//     icon: FileX,
//     color: "",
//   },
// ];

// export default function InstructorDashBoard() {
//   const navigate = useNavigate();

//   const [savedFeedbacks, setSavedFeedbacks] = useState<SavedFeedbacksRow[]>([]);
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const studentId = 114;
//   const [showNotifications, setShowNotifications] = useState(false);
//   const notificationCount = savedFeedbacks.filter(
//     (feedback) => feedback.read_at === null,
//   ).length;

//   // Nur feedbackzahlen möchte ich holen
//   async function loadSavedFeedbacks() {
//     const { data, error } = await getFeedbacks(studentId);

//     if (error) {
//       console.error("Fehler beim Laden der gespeicherten Feedbacks", error);

//       toast.error("Fehler beim Aktualisieren des Tages!", {
//         unstyled: true,
//         icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
//         classNames: {
//           toast:
//             "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
//           title: "text-red-500 text-sm font-medium",
//           icon: "flex items-center justify-center",
//         },
//       });
//       return;
//     }
//     if (data) {
//       setSavedFeedbacks(data ?? []);
//     }
//   }

//   useEffect(() => {
//     loadSavedFeedbacks();
//   }, [studentId]);

//   const studentDashBoard = (
//     <div className="flex flex-col min-h-screen  w-full max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden">
//       {/* Header */}
//       <div className="flex gap-1 w-full h-24 bg-green-700 py-2 px-3 rounded-xl text-white">
//         <div className="flex items-center w-full justify-between">
//           <h1 className="text-xl text-white font-bold flex items-center gap-2">
//             <User size={28} />
//             Schüler Dashboard
//           </h1>

//           {/* ProfilBild */}

//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <Avatar className="h-20 w-20 border-2 border-gray-800 bg-gray-200">
//                 <AvatarImage src="/profil1.png" />
//                 <AvatarFallback>
//                   <Plus className="text-white" />
//                 </AvatarFallback>
//               </Avatar>

//               {/* Buttons unter dem Bild */}
//               <div className="absolute -bottom-2 -right-1 flex gap-1">
//                 <Button
//                   size="icon"
//                   variant="outline"
//                   className="h-6 w-6 rounded-full bg-white cursor-pointer text-blue-500 hover:text-blue-600"
//                 >
//                   <Pencil size={14} />
//                 </Button>

//                 <Button
//                   size="icon"
//                   variant="outline"
//                   className="h-6 w-6 rounded-full bg-white cursor-pointer text-red-500 hover:text-red-600"
//                 >
//                   <Trash2 size={14} />
//                 </Button>
//               </div>
//             </div>

//             <p className="text-sm font-semibold">Max Mustermann</p>
//           </div>
//         </div>
//       </div>
//       {/* Abmelden */}
//       <div className="flex justify-between gap-4">
//         {/* Benachritigungen */}
//         <div className="flex gap-2">
//           <StickyNotes size={22} /> <strong>Feedbacks</strong>
//           <div className="relative">
//             <Button
//               onClick={() => setShowNotifications((prev) => !prev)} // zwischen true und false wechseln.
//               className="relative cursor-pointer"
//             />

//             <Bell className="text-yellow-500" size={20} />

//             {notificationCount > 0 && (
//               <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
//                 {notificationCount > 99 ? "99+" : notificationCount}
//               </span>
//             )}

//             {showNotifications && (
//               <div className="absolute right-0 top-8 z-50 w-80 rounded-lg border border-gray-200 bg-white p-3 shadow-xl">
//                 <h3 className="mb-3 text-sm font-bold text-gray-800">
//                   Feedbacks
//                 </h3>

//                 <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
//                   {savedFeedbacks.map((feedback) => {
//                     const isNew = feedback.read_at === null;

//                     return (
//                       <div
//                         key={feedback.id}
//                         className={`rounded-lg border p-3 ${
//                           isNew
//                             ? "border-gray-300 bg-white text-black"
//                             : "border-gray-200 bg-gray-100 text-gray-400"
//                         }`}
//                       >
//                         <div className="text-sm font-semibold">
//                           {feedback.created_at}
//                         </div>

//                         <div className="text-sm">
//                           Fahrlehrer: {feedback.instructor_id}
//                         </div>

//                         <div className="text-sm">
//                           Führerschein: {feedback.license_class}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//         <Button
//           variant="ghost"
//           onClick={() => navigate("/")}
//           className="flex items-center gap-2 h-8 px-3 text-sm text-green-700 hover:bg-green-100 font-bold border border-green-700 transition"
//         >
//           <LogOut size={16} />
//           Abmelden
//         </Button>
//       </div>

//       {/* Fahrstunde vergeben */}

//       <DrivingLessonAppointment
//         role="student"
//         instructorId={"6128533f-d2b2-4933-93c5-84bc619a11d5"}
//         refreshKey={0}
//       />

//       {/* Angenommene Fahrstunde */}
//       <HiddenLessons studentId={studentId} />
//     </div>
//   );

//   return (
//     <div className="min-h-screen w-full bg-slate-100 flex justify-center">
//       <div
//         className="
//           w-full
//           min-h-screen
//           bg-white
//           md:max-w-3xl
//           md:my-8
//           md:min-h-[calc(100vh-4rem)]
//           md:rounded-2xl
//           md:shadow-xl
//           lg:max-w-5xl
//           flex flex-col
//           overflow-hidden
//         "
//       >
//         <main className="flex-1 p-4 pb-8">
//           <div className="flex-1">
//             {activeTab === "dashboard" && studentDashBoard}
//             {activeTab === "feedbacks" && (
//               <ReceivedFeedback setActiveTab={setActiveTab} studentId={114} />
//             )}
//             {activeTab === "exams" && (
//               <ExamAppointment setActiveTab={setActiveTab} studentId={114} />
//             )}
//           </div>

//           <div className="w-full mt-auto pt-4">
//             <Footer
//               activeTab={activeTab}
//               setActiveTab={setActiveTab}
//               items={footerItems}
//               color="text-green-700"
//             />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
