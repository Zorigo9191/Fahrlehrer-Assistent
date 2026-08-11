import ExamCard from "./ExamCard";
import ExamListHeader from "./ExamListHeader";
import {
  Ban,
  Pencil,
  Save,
  Trash2,
  X,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../components/button.tsx";
import { toast } from "sonner";
import { Input } from "../../components/input.tsx";
import {
  deleteExamDay,
  getExamDays,
  updateExamDate,
  createExamSlot,
  deleteExamSlot,
} from "./../officeDashBoard/officeService/OfficeService.ts";
import type { Status } from "../../components/statusLights.tsx";

type Role = "instructor" | "office";

type ExamListProps = {
  setActiveTab: (tab: string) => void;
  role: Role;
  showActions?: boolean;
  refreshTrigger?: number;
};

export default function ExamList({
  role,
  showActions = false,
  setActiveTab,
  refreshTrigger = 0,
}: ExamListProps) {
  let textColor = "";
  let borderColor = "";
  let bgColor = "";

  switch (role) {
    case "instructor":
      textColor = "text-blue-700";
      borderColor = "border-blue-700";
      bgColor = "bg-blue-700";
      break;

    case "office":
      textColor = "text-orange-700";
      borderColor = "border-orange-500";
      bgColor = "bg-orange-500";
      break;

    default:
      textColor = "text-black";
      borderColor = "border-black";
      bgColor = "bg-orange-500";
  }

  const [examDays, setExamDays] = useState<any[]>([]);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [editDayId, setEditDayId] = useState<string | null>(null);

  const [newDate, setNewDate] = useState("");
  const [newLicense, setNewLicense] = useState("");
  const [slotCount, setSlotCount] = useState("");

  async function loadExamData() {
    const { data } = await getExamDays();

    if (data) {
      setExamDays(data ?? []);
      if (data.length > 0 && !activeDayId) {
        setActiveDayId(data[0].id);
      }
    }
  }

  useEffect(() => {
    loadExamData();
  }, [refreshTrigger]);

  const activeDay = examDays.find((day) => day.id === activeDayId);
  const activeSlots = activeDay?.exam_slots || [];

  const handleAddSlotToDay = async (dayId: string, licenseClass: string) => {
    const payload = {
      exam_day_id: dayId,
      exam_time: "Neu",
      license_class: licenseClass || "B",
      status: "gray" as Status,
    };

    const { error } = await createExamSlot(payload);

    if (error) {
      toast.error("Fehler beim Erstellen des Slots!", {
        unstyled: true,
        icon: <AlertTriangle className="h-5 w-5 text-gray-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-5 py-4 shadow-md",
          title: "text-gray-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });

      return;
    }

    toast.success("Neuer Slot hinzugefügt!", {
      unstyled: true,
      icon: <Save className="h-5 w-5 text-green-400" />,
      classNames: {
        toast:
          "flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-5 py-4 shadow-md",
        title: "text-green-500 text-sm font-medium",
        icon: "flex items-center justify-center",
      },
    });

    await loadExamData();
  };

  const handleUpdateExamDate = async () => {
    if (!editDayId) return;

    const currentDay = examDays.find((day) => day.id === editDayId);

    const oldSlotCount = currentDay?.exam_slots?.length ?? 0;
    const newSlotCount = Number(slotCount);

    // Prüfungstag aktualisieren
    const { error } = await updateExamDate(editDayId, {
      exam_date: newDate,
      license_class: newLicense,
      slots: Number(slotCount),
    });

    if (error) {
      console.error("SUPABASE FEHLER DETAILS:", error);

      toast.error("Fehler beim Aktualisieren des Tages!", {
        unstyled: true,
        icon: <AlertTriangle className="h-5 w-5 text-gray-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-5 py-4 shadow-md",
          title: "text-gray-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });
      return;
    }

    toast.success("Prüfungstag wurde aktualisiert", {
      unstyled: true,
      icon: <Save className="h-5 w-5 text-green-400" />,
      classNames: {
        toast:
          "flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-5 py-4 shadow-md",
        title: "text-green-500 text-sm font-medium",
        icon: "flex items-center justify-center",
      },
    });

    // Wenn mehr Plätze
    if (newSlotCount > oldSlotCount) {
      const difference = newSlotCount - oldSlotCount;

      for (let i = 0; i < difference; i++) {
        await createExamSlot({
          exam_day_id: editDayId,
          exam_time: "Neu",
          license_class: newLicense || "B",
          status: "gray" as Status,
        });
      }
    }

    // Wenn weniger Plätze
    if (newSlotCount < oldSlotCount) {
      const difference = oldSlotCount - newSlotCount;

      const slotsToDelete = currentDay.exam_slots.slice(-difference);
      // -difference von hinten zählen   ["A", "B", "C", "D", "E"]; -> ["D", "E"]
      // slice nimmt einen Teil eines Arrays heraus [1, 2, 3, 4, 5]; -> arr.slice(2) -> 2;
      for (const slot of slotsToDelete) {
        await deleteExamSlot(slot.id);
      }
    }

    setEditDayId(null);
    setNewDate("");
    setNewLicense("");
    setSlotCount("");

    await loadExamData();
  };

  const handleDeleteExamDay = async (dayId: string) => {
    const { error } = await deleteExamDay(dayId);

    if (error) {
      toast.error("Fehler beim Löschen!");
      return;
    }

    setShowDeleteDialog(null);
    await loadExamData();

    toast.success("Prüfungstag wurde gelöscht", {
      unstyled: true,
      icon: <Trash2 className="h-5 w-5 text-red-500" />,
      classNames: {
        toast:
          "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
        title: "text-red-500 text-sm font-medium",
        icon: "flex items-center justify-center",
      },
    });
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 py-6 bg-white overflow-x-hidden">
      <ExamListHeader role={role} setActiveTab={setActiveTab} />

      <div className="flex gap-2 flex-wrap">
        {examDays.map((day) => {
          const formattedDate = new Date(day.exam_date).toLocaleDateString(
            "de-DE",
          );
          const slotsLength = day.exam_slots ? day.exam_slots.length : 0;

          return (
            <div
              key={day.id}
              className={`flex items-center gap-2 border px-3 py-2 rounded-md ${
                activeDayId === day.id ? `${bgColor} text-white` : textColor
              }`}
            >
              {showActions && (
                <X
                  size={20}
                  className="cursor-pointer hover:text-black"
                  onClick={() => setShowDeleteDialog(day.id)}
                />
              )}

              {showActions && (
                <Pencil
                  size={15}
                  className="cursor-pointer hover:text-black"
                  onClick={() => {
                    setEditDayId(day.id);
                    setNewDate(day.exam_date);
                    setNewLicense(day.license_class);
                    setSlotCount(day.slots ?? "");
                  }}
                />
              )}

              {showActions && (
                <Plus
                  size={18}
                  className="cursor-pointer hover:text-black"
                  onClick={() => handleAddSlotToDay(day.id, day.license_class)}
                />
              )}

              <Button
                variant="ghost"
                onClick={() => setActiveDayId(day.id)}
                className="flex items-center gap-1.5 font-medium p-0 h-auto hover:bg-transparent"
              >
                <span className="text-xs text-black font-bold">
                  {formattedDate}
                </span>

                <span className="text-xs text-black font-bold">
                  ({day.license_class})
                </span>
                <span className="text-xs text-black ">
                  ({slotsLength} Plätze)
                </span>
              </Button>

              {showDeleteDialog === day.id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white flex flex-col items-center rounded-xl shadow-lg p-6 w-80">
                    <h2 className="text-lg font-bold text-gray-500">
                      Datum löschen?
                    </h2>

                    <p className="flex w-full justify-center text-sm text-gray-600 mt-2">
                      Möchtest du wirklich diesen Prüfungstag löschen?
                    </p>

                    <span className="bg-gray-300 text-sm font-semibold text-gray-600 px-2 py-1 rounded-md mt-2">
                      {formattedDate}
                    </span>

                    <div className="flex gap-3 mt-5">
                      <Button
                        variant="ghost"
                        onClick={() => setShowDeleteDialog(null)}
                        className="flex-1 text-gray-500 bg-orange-200 hover:bg-orange-300"
                      >
                        <Ban />
                        Abbrechen
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteExamDay(day.id)}
                        className="flex-1 bg-red-300 hover:bg-red-400"
                      >
                        <Trash2 size={14} />
                        Löschen
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {editDayId === day.id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white flex flex-col items-center rounded-xl shadow-lg p-6 w-80">
                    <h2 className="text-lg font-bold text-gray-500">
                      Datum bearbeiten?
                    </h2>

                    <div className="space-y-2 w-full">
                      <div className="flex items-center gap-2 mt-2">
                        <span className="w-28 bg-gray-300 text-sm font-semibold text-gray-600 px-1 py-1 rounded-md">
                          Datum
                        </span>
                        <Input
                          className="border border-gray-500 h-7 text-black"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                        />
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="w-28 bg-gray-300 text-sm font-semibold text-gray-600 px-1 py-1 rounded-md">
                          Klassen
                        </span>
                        <Input
                          className="border border-gray-500 h-7 text-black"
                          value={newLicense}
                          onChange={(e) => setNewLicense(e.target.value)}
                        />
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="w-28 bg-gray-300 text-sm font-semibold text-gray-600 px-1 py-1 rounded-md">
                          Slots
                        </span>
                        <Input
                          className="border border-gray-500 h-7 text-black"
                          value={slotCount}
                          onChange={(e) => setSlotCount(e.target.value)}
                          placeholder="Anzahl"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-5">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditDayId(null);
                          setNewDate("");
                          setNewLicense("");
                          setSlotCount("");
                        }}
                        className="flex-1 text-gray-500 border border-gray-500 hover:bg-orange-200"
                      >
                        <Ban />
                        Abbrechen
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={handleUpdateExamDate}
                        className="flex-1 bg-red-300 hover:bg-red-400"
                      >
                        <Save size={14} />
                        Speichern
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        className={`border flex flex-col gap-4 p-4 rounded-sm ${borderColor}`}
      >
        {activeSlots.length > 0 ? (
          activeSlots.map((slot: any) => (
            <ExamCard
              key={slot.id}
              role={role === "instructor" ? "instructor" : "office"}
              exam={slot}
              onChanged={loadExamData}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm italic text-center py-4">
            Keine Slots für diesen Tag vorhanden.
          </p>
        )}
      </div>
    </div>
  );
}
