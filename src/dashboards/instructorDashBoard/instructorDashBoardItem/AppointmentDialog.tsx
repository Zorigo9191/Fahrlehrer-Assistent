import { AlertTriangle, Ban, Loader2, Save } from "lucide-react";
import { Button } from "../../../components/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/card.tsx";
import { Input } from "../../../components/input.tsx";
import { Label } from "../../../components/label.tsx";
import { useState } from "react";
import { createAvailableLesson } from "./AppointmentService.ts";
import type { Database } from "../../../types/database.types.ts";
import { toast } from "sonner";

type AvailableLessonInsert =
  Database["public"]["Tables"]["available_lessons"]["Insert"];

interface AppointmentDialogProps {
  appointmentDialog: boolean;
  setAppointmentDialog: (open: boolean) => void;
  instructorId: string;
  onSave?: (lesson: AvailableLessonInsert) => void;
}

export default function AppointmentDialog({
  appointmentDialog,
  setAppointmentDialog,
  instructorId,
  onSave,
}: AppointmentDialogProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newAvailableLesson = {
        lesson_date: date,
        lesson_time: time,
        license_class: category,
        duration_minutes: Number(duration),
        instructor_id: instructorId,
        status: "offen",
      };

      const { error } = await createAvailableLesson(newAvailableLesson);

      if (error) {
        toast.warning("Die Fahrstundenanfrage kann nicht erstellt werden.", {
          unstyled: true,
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
          classNames: {
            toast:
              "flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-4 shadow-md",
            title: "text-yellow-500 text-sm font-medium",
            icon: "flex items-center justify-center",
          },
        });
        return;
      }

      toast.success("Termin Anfrage wurde erfolgreich erstellt", {
        unstyled: true,
        icon: <Save className="h-5 w-5 text-green-400" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-5 py-4 shadow-md",
          title: "text-green-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });

      if (onSave) {
        // Elternkomponente informieren, falls nötig
        onSave(newAvailableLesson);
      }

      setDate("");
      setTime("");
      setCategory("");
      setDuration("");
      setAppointmentDialog(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ein unbekannter Fehler ist aufgetreten";

      toast.error(errorMessage, {
        unstyled: true,
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
          title: "text-red-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });
    } finally {
      // Ladezustand in jedem Fall zurücksetzen
      setIsLoading(false);
    }
  }

  return (
    <>
      {appointmentDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 ">
          <div className="relative w-full max-w-md rounded-xl bg-app-elevated p-6 shadow-2xl ">
            <form onSubmit={handleSave}>
              <Card className="w-full max-w-lg shadow-lg border-blue-700 mt-8 ">
                <CardHeader>
                  <CardTitle className="text-sm  justify-center flex font-bold text-blue-700">
                    Anfrage für Fahrstunde
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-200">
                    * Bitte alle Felder ausfüllen
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="date"
                      className="text-blue-700 font-bold text-xs"
                    >
                      Tag für Fahrstunde
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      className="[&::-webkit-calendar-picker-indicator]:invert
                                 [&::-webkit-calendar-picker-indicator]:opacity-80 text-slate-200 text-xs h-7"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="time"
                      className="text-blue-700 font-bold text-xs"
                    >
                      Uhrzeit
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      className="[&::-webkit-calendar-picker-indicator]:invert
                                 [&::-webkit-calendar-picker-indicator]:opacity-80 text-slate-200 text-xs h-7"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="klasse"
                      className="text-blue-700 font-bold text-xs"
                    >
                      Klasse
                    </Label>
                    <Input
                      id="klasse"
                      type="text"
                      className="text-slate-200 text-xs h-7"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="B, BE, A ..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="slots"
                      className="text-blue-700 font-bold text-xs"
                    >
                      Dauer
                    </Label>
                    <Input
                      id="duration"
                      type="text"
                      className="[&::-webkit-calendar-picker-indicator]:invert
                                 [&::-webkit-calendar-picker-indicator]:opacity-80 text-slate-200 text-xs h-7"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="90-Min"
                      required
                    />
                  </div>
                </CardContent>

                <CardFooter>
                  <div className="flex w-full gap-2">
                    <Button
                      variant="ghost"
                      type="submit"
                      disabled={isLoading}
                      className="h-8 w-full px-3 text-xs border border-slate-200 text-blue-700 hover:bg-blue-700 hover:text-slate-200"
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Speichern
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={isLoading}
                      onClick={() => setAppointmentDialog(false)}
                      className="h-8 w-full px-3 text-xs border border-slate-200 text-slate-200 hover:bg-slate-600 hover:text-slate-200"
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Abbrechen
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
