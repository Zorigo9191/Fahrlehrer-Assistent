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

type DateCreateFormProps = {
  onClose: () => void;
};

export default function DateCreateForm({ onClose }: DateCreateFormProps) {
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
            <Input id="id" type="text" placeholder="tt.mm.jjjj" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="klasse">Prüfungszeit</Label>
            <Input id="klasse" type="text" placeholder="z. B. 08:55" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="klasse">Klassen</Label>
            <Input
              id="klasse"
              type="text"
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
              className=" h-8 w-full px-3 text-sm border border-orange-500 text-orange-500 hover:bg-orange-200"
            >
              <Save className="mr-2 h-4 w-4" />
              Speichern
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-full px-3 text-sm border border-orange-500 text-orange-500 hover:bg-orange-200"
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
