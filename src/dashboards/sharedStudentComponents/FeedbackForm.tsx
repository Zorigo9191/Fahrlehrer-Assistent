import { Button } from "@/components/button";
import { Field, FieldGroup, FieldLabel } from "@/components/field";
import { Input } from "@/components/input";
import Textarea from "@/components/textArea";
import { AlertTriangle, Ban, Bike, Car, Save } from "lucide-react";
import { useContext, useState } from "react";
import { createStudentFeedbacks } from "./sharedService/SharedService.ts";
import { toast } from "sonner";
import { AuthContext } from "../../context/AuthContext.tsx";

type FeedbackFormProps = {
  onClose: () => void;
  studentId: string;
};

export default function FeedbackForm({
  onClose,
  studentId,
}: FeedbackFormProps) {
  const licenseClasses = [
    { value: "B197", type: "car", color: "text-blue-700" },
    { value: "B78", type: "car", color: "text-blue-700" },
    { value: "B", type: "car", color: "text-blue-700" },
    { value: "BE", type: "car", color: "text-blue-700" },
    { value: "AM", type: "bike", color: "text-blue-700" },
    { value: "A1", type: "bike", color: "text-blue-700" },
    { value: "A2", type: "bike", color: "text-blue-700" },
    { value: "A", type: "bike", color: "text-blue-700" },
  ];

  const [selectedClass, setSelectedClass] = useState("B197");
  const [lessonDay, setLessonDay] = useState<string>("");
  const [feedbackData, setFeedbackData] = useState({
    verkehrsbeobachtung: "",
    geschwindigkeit: "",
    fahrzeugpositionierung: "",
    kommunikation: "",
    fahrzeugbedienung: "",
    allgemeines: "",
  });

  const handleChangeFeedbacks = (field: string, value: string) => {
    setFeedbackData((prev) => ({ ...prev, [field]: value }));
  };

  const { session } = useContext(AuthContext);
  const instructorId = session?.user?.id;

  const selectedLicense = licenseClasses.find(
    (license) => license.value === selectedClass,
  );

  async function handleSaveFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const { data, error } = await createStudentFeedbacks({
        feedback: JSON.stringify(feedbackData),
        instructor_id: instructorId,
        license_class: selectedClass,
        student_id: studentId,
        created_at: lessonDay,
      });

      if (error) {
        throw error;
      }

      console.log("Feedbacks gespeichert:", data);

      toast.success("Feedback wurde gespeichert", {
        unstyled: true,
        icon: <Save className="h-5 w-5 text-green-400" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-5 py-4 shadow-md",
          title: "text-green-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });
      onClose();
    } catch (error) {
      console.error(error);

      toast.warning("Bitte Datum auswählen", {
        unstyled: true,
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        classNames: {
          toast:
            "flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-4 shadow-md",
          title: "text-yellow-500 text-sm font-medium",
          icon: "flex items-center justify-center",
        },
      });
    }
  }

  return (
    <form
      className="w-full mt-2 max-w-md mx-auto "
      onSubmit={handleSaveFeedback}
    >
      <FieldGroup className="space-y-4">
        <Field>
          <FieldLabel htmlFor="date">
            <strong>Datum der Fahrstunde</strong>
          </FieldLabel>

          <Input
            id="date"
            value={lessonDay || ""}
            type="date"
            className="h-10 rounded-xl text-blue-700 border-2"
            onChange={(e) => setLessonDay(e.target.value)}
          />
        </Field>

        <Field>
          <div className="flex items-center gap-2 ">
            {selectedLicense?.type === "bike" ? (
              <Bike className="text-blue-700" size={18} />
            ) : (
              <Car className="text-blue-700" size={18} />
            )}

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-md border-2 text-blue-700 border-blue-700 px-2 py-1 text-sm"
            >
              {licenseClasses.map((category) => (
                <option
                  key={category.value}
                  value={category.value}
                  color={category.color}
                >
                  {category.value}
                </option>
              ))}
            </select>
          </div>
        </Field>

        <Field>
          <FieldLabel>Verkehrsbeobachtung</FieldLabel>

          <Textarea
            value={feedbackData.verkehrsbeobachtung}
            onChange={(e) =>
              handleChangeFeedbacks("verkehrsbeobachtung", e.target.value)
            }
            placeholder="..."
            className="h-24 resize-none"
          />
        </Field>

        <Field>
          <FieldLabel>Geschwindigkeit</FieldLabel>

          <Textarea
            value={feedbackData.geschwindigkeit}
            onChange={(e) =>
              handleChangeFeedbacks("geschwindigkeit", e.target.value)
            }
            placeholder="..."
            className="h-24 resize-none"
          />
        </Field>

        <Field>
          <FieldLabel>Fahrzeugpositionierung</FieldLabel>

          <Textarea
            value={feedbackData.fahrzeugpositionierung}
            onChange={(e) =>
              handleChangeFeedbacks("fahrzeugpositionierung", e.target.value)
            }
            placeholder="..."
            className="h-24 resize-none"
          />
        </Field>

        <Field>
          <FieldLabel>Kommunikation</FieldLabel>

          <Textarea
            value={feedbackData.kommunikation}
            onChange={(e) =>
              handleChangeFeedbacks("kommunikation", e.target.value)
            }
            placeholder="..."
            className="h-24 resize-none"
          />
        </Field>

        <Field>
          <FieldLabel>Fahrzeugbedienung</FieldLabel>

          <Textarea
            value={feedbackData.fahrzeugbedienung}
            onChange={(e) =>
              handleChangeFeedbacks("fahrzeugbedienung", e.target.value)
            }
            placeholder="..."
            className="h-24 resize-none"
          />
        </Field>

        <Field>
          <FieldLabel>Allgemeines Feedback</FieldLabel>

          <Textarea
            value={feedbackData.allgemeines}
            onChange={(e) =>
              handleChangeFeedbacks("allgemeines", e.target.value)
            }
            placeholder="..."
            className="h-24 resize-none"
          />
        </Field>

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            variant="ghost"
            className="h-8 w-52 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100"
          >
            <Save className="mr-2 h-4 w-4" />
            Speichern
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-52 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100"
          >
            <Ban className="mr-2 h-4 w-4" />
            Abbrechen
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
