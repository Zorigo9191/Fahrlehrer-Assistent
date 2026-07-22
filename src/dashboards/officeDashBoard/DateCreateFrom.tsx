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
import { Ban, Save } from "lucide-react";
import { supabase } from "../../lib/supabase.ts";
import { useState } from "react";

type DateCreateFormProps = {
  onClose: () => void;
};

export default function DateCreateForm({ onClose }: DateCreateFormProps) {
  const [examDay, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("");
  const [license, setLicense] = useState("");

  async function saveExamDate() {
    const { error } = await supabase.from("exam_list").insert({
      exam_date: examDay,
      exam_time: examTime,
      license_class: license,
    });

    if (error) {
      console.log(error);

      return;
    }
    setExamDate("");
    setExamTime("");
    setLicense("");
    onClose();
  }

  return (
    <div className="flex justify-center items-center min-h-90 bg-gray-50 p-4 overflow-x-hidden">
      <Card className="w-full max-w-lg shadow-lg border-orange-600 mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-500">
            Prüfungstermin erstellen
          </CardTitle>
          <CardDescription>
            Trage die vollständigen Daten für die Prüfung ein.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          *
          <div className="space-y-2">
            <Label htmlFor="id">Prüfungsdatum</Label>
            <Input
              id="date"
              type="date"
              value={examDay}
              onChange={(e) => setExamDate(e.target.value)}
              placeholder="tt.mm.jjjj"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="klasse">Prüfungszeit</Label>
            <Input
              id="time"
              type="time"
              value={examTime}
              onChange={(e) => setExamTime(e.target.value)}
              placeholder="z. B. 08:55"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="klasse">Klassen</Label>
            <Input
              id="klasse"
              type="text"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              placeholder="B, BE, A ..."
              required
            />
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex w-full gap-2 ">
            <Button
              variant="ghost"
              type="submit"
              onClick={saveExamDate}
              className=" h-8 w-full px-3 text-sm border border-orange-500 text-orange-500 hover:bg-orange-200"
            >
              <Save className="mr-2 h-4 w-4" />
              Speichern
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-full px-3 text-sm border border-red-500 text-red-500 hover:bg-red-200"
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
