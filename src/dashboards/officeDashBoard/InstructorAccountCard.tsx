import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Save, Pencil, Trash2, AlertTriangle, Ban } from "lucide-react";
import { useEffect, useState } from "react";
import {
  deleteInstructor,
  updateInstructor,
} from "./instructorService/InstructorService";
import { Input } from "@/components/input";
import { toast } from "sonner";
import { getStudentCount } from "./officeService/OfficeService.ts";

interface Instructor {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  teaching_classes: string[];
  created_at: string;
}

interface InstructorProps {
  instructor: Instructor;
  refresh: () => void;
}

export default function InstructorAccountCard({
  instructor,
  refresh,
}: InstructorProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(instructor.first_name);
  const [lastName, setLastName] = useState(instructor.last_name);
  const [phone, setPhone] = useState(instructor.phone_number ?? "");
  const [classes, setClasses] = useState(
    instructor.teaching_classes.join(", "),
  );
  const [studentCount, setStudentCount] = useState(0);

  const handleSave = async () => {
    const { error: instructorError } = await updateInstructor(instructor.id, {
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      teaching_classes: classes.split(",").map((item) => item.trim()),
    });
    if (instructorError) {
      console.error(instructorError);
      return;
    }

    setIsEditing(false);
  };

  const handleDelete = async () => {
    const { error: instructorError } = await deleteInstructor(instructor.id);

    if (instructorError) {
      toast.error("Löschen fehlgeschlagen");
      console.error(instructorError);
      return;
    }
    setShowDeleteDialog(false);
    refresh();

    toast.success("Fahrlehrer wurde gelöscht.", {
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

  // SchülerAnZahl holen aus der Supabase-Db

  async function fetchStundentCount() {
    const { count, error } = await getStudentCount(instructor.id);

    if (error) {
      console.error("Fehler beim Laden der Schüleranzahl!", error);
      toast.error("Fehler beim Laden der Schüleranzahl!", {
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

    setStudentCount(count);
  }

  useEffect(() => {
    fetchStundentCount();
  }, [instructor.id]);

  return (
    <Card className="w-full  max-w-xs min-h-45 transition-all duration-300 ease-in-out border border-orange-500">
      <CardHeader>
        {isEditing ? (
          <div className="space-y-2">
            <label className="space-y-2 text-orange-400 font-bold">
              Vorname:
            </label>
            <Input
              className="h-8"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label className="space-y-2 text-orange-400 font-bold">
              Nachname:
            </label>
            <Input
              className="h-8"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        ) : (
          <CardTitle className="text-md text-orange-400 flex gap-2">
            Name:
            <p className="text-gray-700 font-bold">
              {instructor.first_name} {instructor.last_name}
            </p>
          </CardTitle>
        )}
      </CardHeader>

      <CardContent className="space-y-2 [&>p>strong]:text-orange-400">
        <p>
          <strong>Ausbildungsklasse: </strong>
          {isEditing ? (
            <Input
              className="h-8"
              value={classes}
              onChange={(e) => setClasses(e.target.value)}
            />
          ) : (
            instructor.teaching_classes.join(", ")
          )}
        </p>

        <p>
          <strong>Telefon: </strong>
          {isEditing ? (
            <Input
              className="h-8"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          ) : (
            instructor.phone_number
          )}
        </p>
        <p>
          <strong>Erstellt am:</strong>{" "}
          {new Date(instructor.created_at).toLocaleString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p>
          <strong>Schülerzahl:</strong> {studentCount}
        </p>
      </CardContent>
      <div className="flex gap-2 mt-5 flex-wrap justify-center p-2">
        <Button
          variant="ghost"
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          className="flex flex-1 min-w-35 items-center justify-center gap-2 h-8 px-3 text-sm border border-orange-500 text-orange-500 hover:bg-orange-200"
        >
          {isEditing ? (
            <>
              <Save size={14} />
              Speichern
            </>
          ) : (
            <>
              <Pencil size={14} />
              Bearbeiten
            </>
          )}
        </Button>

        {/* Abbrechen beim Bearbeiten */}
        {isEditing ? (
          <Button
            variant="ghost"
            onClick={() => {
              setFirstName(instructor.first_name);
              setLastName(instructor.last_name);
              setPhone(instructor.phone_number ?? "");
              setClasses(instructor.teaching_classes.join(", "));

              setIsEditing(false);
            }}
            className="flex flex-1 min-w-35 items-center justify-center gap-2 h-8 px-3 text-sm border border-red-500 text-black bg-red-300 hover:bg-red-400"
          >
            <Ban size={14} />
            Abbrechen
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setShowDeleteDialog(true)}
            className="flex flex-1 min-w-35 items-center justify-center gap-2 h-8 px-3 text-sm border border-red-500 text-black bg-red-300 hover:bg-red-400"
          >
            <Trash2 size={14} />
            Löschen
          </Button>
        )}
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80">
            <h2 className="text-lg font-bold">Fahrlehrer löschen?</h2>

            <p className="text-sm text-gray-600 mt-2">
              Möchtest du diesen Fahrlehrer wirklich entfernen?
            </p>
            <div className="flex gap-3 mt-5">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 border border-orange-500 hover:bg-orange-200"
              >
                Abbrechen
              </Button>

              <Button
                variant="ghost"
                onClick={handleDelete}
                className="flex-1  border-red-500 text-black bg-red-300 hover:bg-red-400"
              >
                <Trash2 size={14} />
                Löschen
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
