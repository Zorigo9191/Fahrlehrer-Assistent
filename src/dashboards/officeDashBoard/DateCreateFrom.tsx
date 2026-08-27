import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { AlertTriangle, Ban, Save } from "lucide-react";
import { useState } from "react";
import { createExamDay, getExamDays } from "./officeService/OfficeService.ts";
import { toast } from "sonner";

type DateCreateFormProps = {
  onClose: () => void;
  onSaved: () => void;
};

export default function DateCreateForm({
  onClose,
  onSaved,
}: DateCreateFormProps) {
  const [examDay, setExamDate] = useState("");
  const [license, setLicense] = useState("");
  const [slot, setSlots] = useState<number | "">(0);

  async function saveExamDate() {
    const { data: existingExam } = await getExamDays();
    const dateAlreadyExists = existingExam?.some(
      (exam) => exam.exam_date === examDay,
    );

    if (dateAlreadyExists) {
      toast.error("Achtung: Dieses Datum existiert bereits!", {
        unstyled: true,
        icon: <AlertTriangle className="h-5 w-5 text-gray-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
          title: "text-red-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });
      return;
    }

    // 1. Zuerst den Prüfungstag in exam_days erstellen
    const { data: newDayData, error: dayError } = await createExamDay({
      exam_date: examDay,
      license_class: license,
      slots: Number(slot) || 0,
    });

    if (dayError || !newDayData) {
      console.error("Fehler beim Erstellen des Prüfungstages:", dayError);

      toast.error("Fehler beim Speichern des Prüfungstages!", {
        unstyled: true,
        icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 shadow-md",
          title: "text-red-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });
      return;
    }

    toast.success("Prüfungstag und Slots erfolgreich erstellt!", {
      unstyled: true,
      icon: <Save className="h-5 w-5 text-green-600" />,
      classNames: {
        toast:
          "flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-5 py-4 shadow-md",
        title: "text-green-500 text-sm font-medium",
        icon: "flex items-center justify-center",
      },
    });
    setExamDate("");
    setLicense("");
    setSlots("");

    onSaved();
    onClose();
  }

  return (
    <div className="flex justify-center items-center min-h-90 bg-app-elevated p-4 overflow-x-hidden">
      <Card className="w-full max-w-lg shadow-lg border-orange-600 mt-8">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-orange-500">
            Prüfungstermin erstellen
          </CardTitle>
          <CardDescription className="text-xs text-slate-200 ">
            Trage die Daten für den Prüfungstag ein. Die Plätze werden direkt
            als Slots generiert.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4  text-slate-200">
          <div className="space-y-2 ">
            <Label htmlFor="date" className="text-xs">
              Prüfungsdatum
            </Label>
            <Input
              id="date"
              type="date"
              className="[&::-webkit-calendar-picker-indicator]:invert
              [&::-webkit-calendar-picker-indicator]:opacity-80 h-8"
              value={examDay}
              onChange={(e) => setExamDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="klasse" className="text-xs">
              Klassen
            </Label>
            <Input
              id="klasse"
              type="text"
              value={license}
              className="h-8"
              onChange={(e) => setLicense(e.target.value)}
              placeholder="B, BE, A ..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slots" className="text-xs">
              Anzahl der Plätze
            </Label>
            <Input
              id="slots"
              type="number"
              min={0}
              max={20}
              value={slot}
              onChange={(e) =>
                setSlots(e.target.value === "" ? "" : Number(e.target.value))
              }
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="8"
              required
              className="
              h-8 w-15
              [&::-webkit-inner-spin-button]:h-6
              [&::-webkit-inner-spin-button]:w-4
              [&::-webkit-inner-spin-button]:-mr-1
            
            "
            />
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex w-full gap-2">
            <Button
              variant="ghost"
              type="button"
              onClick={saveExamDate}
              className="h-8 w-full px-3 text-xs border border-slate-200 text-orange-500 hover:bg-orange-500 hover:text-slate-200"
            >
              <Save className="mr-2 h-4 w-4" />
              Speichern
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-full px-3 text-xs border border-slate-200 text-slate-200 hover:bg-slate-600 hover:text-slate-200"
            >
              <Ban className="mr-2 h-4 w-4" />
              Abbrechen
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
