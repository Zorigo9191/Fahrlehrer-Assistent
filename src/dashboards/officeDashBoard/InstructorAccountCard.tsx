import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Save, Pencil, Trash2 } from "lucide-react";

interface Instructor {
  id: number;
  name: string;
  password: string;
  klasse: string;
  telefon: string;
  created_at: string;
  student_count: string;
}

interface InstructorProps {
  instructor: Instructor;
}

export default function InstructorAccountCard({ instructor }: InstructorProps) {
  return (
    <Card className="w-full max-w-xs min-h-45 transition-all duration-300 ease-in-out border border-orange-500">
      <CardHeader>
        <CardTitle className="text-md">Name: {instructor.name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 [&>p>strong]:text-orange-400">
        <p>
          <strong>Id: </strong> {instructor.id}
        </p>
        <p>
          <strong>Passwort: </strong> {instructor.password}
        </p>
        <p>
          <strong>Klasse: </strong> {instructor.klasse}
        </p>

        <p>
          <strong>Telefon: </strong> {instructor.telefon}
        </p>
        <p>
          <strong>Erstellt am:</strong> {instructor.created_at}
        </p>
        <p>
          <strong>Schülerzahl:</strong> {instructor.student_count}
        </p>
      </CardContent>
      <div className="flex gap-2 mt-5 flex-wrap justify-center p-2">
        <Button
          variant="ghost"
          className="h-8 w-52 px-3 text-sm border border-orange-500 text-orange-500 hover:bg-orange-200"
        >
          <Save className="mr-2 h-4 w-4" />
          Speichern
        </Button>

        <Button
          variant="ghost"
          className="flex w-52 items-center gap-2 h-8 px-3 text-sm border border-orange-500 text-orange-500 hover:bg-orange-200"
        >
          <Pencil size={14} />
          Bearbeiten
        </Button>

        <Button
          variant="ghost"
          className="flex w-52 items-center gap-2 h-8 px-3 text-sm border border-red-500 text-black bg-red-300 hover:bg-red-400"
        >
          <Trash2 size={14} />
          Löschen
        </Button>
      </div>
    </Card>
  );
}
