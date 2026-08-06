import { Button } from "@/components/button";
import { Ban, Bike, Car, Pencil, Save } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getFeedbacks,
  updateStudentFeedback,
} from "./sharedService/SharedService.ts";
import type { Database } from "../../types/database.types.ts";

type FeedbackCardProps = {
  studentId: number;
};

type FeedbackContent = {
  verkehrsbeobachtung?: string;
  geschwindigkeit?: string;
  fahrzeugpositionierung?: string;
  kommunikation?: string;
  fahrzeugbedienung?: string;
  allgemein?: string;
};

type feedBacksUpdate =
  Database["public"]["Tables"]["student_feedback"]["Update"];

export default function FeedbackCards({ studentId }: FeedbackCardProps) {
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

  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<feedBacksUpdate[]>([]);

  // Speichert die ID des Feedbacks, das gerade bearbeitet wird (null = keins)
  const [editingId, setEditingId] = useState<number | null>(null);

  // Hält die temporären Formulardaten während der Bearbeitung
  const [formData, setFormData] = useState<FeedbackContent>({});

  async function loadFeedback() {
    setLoading(true);
    const { data, error } = await getFeedbacks(studentId);

    if (error || !data) {
      console.error("Fehler beim Laden:", error);
      setLoading(false);
      return;
    }

    setFeedbacks(data);
    setLoading(false);
  }

  useEffect(() => {
    loadFeedback();
  }, []);

  // Startet den Bearbeitungsmodus
  const handleStartEdit = (item: feedBacksUpdate) => {
    setEditingId(item.id);
    const parsedFeedback =
      typeof item.feedback === "string"
        ? JSON.parse(item.feedback)
        : item.feedback;

    setFormData({ ...parsedFeedback });
  };

  // Ändert Werte im temporären State
  const handleChange = (field: string, value: string) => {
    setFormData((prev: FeedbackContent) => ({
      ...prev,
      [field]: value,
    }));
  };

  //Speichern in die Datenbank
  const handleSave = async (id: number) => {
    setLoading(true);

    //  das formData-Objekt wieder in einen String um,
    const feedbackPayload = JSON.stringify(formData);

    const { error } = await updateStudentFeedback(id, feedbackPayload);
    if (error) {
      console.error("Fehler beim Speichern:", error);
      setLoading(false);
      return;
    }

    console.log("Erfolgreich gespeichert für ID:", id);

    // Bearbeitungsmodus beenden
    setEditingId(null);

    //  neu  laden
    await loadFeedback();
    setLoading(false);
  };

  return (
    <div className="flex w-full max-w-3xl mx-auto items-center mt-10 flex-col gap-3 border rounded-2xl border-blue-700 p-2 max-h-[90vh] break-all overflow-y-auto">
      {loading && (
        <p className="text-center text-gray-500">Lade Feedbacks...</p>
      )}

      {!loading && feedbacks.length === 0 && (
        <p className="text-center text-gray-500">Keine Feedbacks gefunden.</p>
      )}

      {!loading &&
        feedbacks.map((item) => {
          const isEditing = editingId === item.id;

          const feedbackData =
            typeof item.feedback === "string"
              ? JSON.parse(item.feedback)
              : item.feedback;

          const currentLicense = licenseClasses.find(
            (license) => license.value === item.license_class,
          );

          const formattedDate = new Date(item.created_at).toLocaleDateString(
            "de-DE",
          );

          return (
            <div
              key={item.id}
              className="flex flex-col w-full gap-3 border-b border-blue-200 pb-4 mb-2"
            >
              <div className="flex gap-2 justify-between items-center px-2">
                <h2 className="flex items-center justify-center font-bold">
                  Feedback vom {formattedDate}
                </h2>
                <div className="flex items-center gap-2 text-md">
                  <strong className="text-gray-600">Klasse:</strong>
                  {item.license_class}
                  {currentLicense?.type === "bike" ? (
                    <Bike className="text-blue-700" size={18} />
                  ) : (
                    <Car className="text-blue-700" size={18} />
                  )}
                </div>
              </div>

              <div className="w-full max-h-[60vh] overflow-y-auto rounded-xl p-3">
                <div className="flex flex-col gap-2 shadow-inner w-full">
                  {/* Verkehrsbeobachtung */}
                  <div className="flex w-full flex-col border rounded-md bg-gray-300 p-2 gap-2">
                    <h3 className="text-blue-700">
                      <strong>Verkehrsbeobachtung:</strong>
                    </h3>
                    {isEditing ? (
                      <textarea
                        className="w-full p-2 rounded bg-white border"
                        value={formData.verkehrsbeobachtung || ""}
                        onChange={(e) =>
                          handleChange("verkehrsbeobachtung", e.target.value)
                        }
                      />
                    ) : (
                      <p>{feedbackData?.verkehrsbeobachtung}</p>
                    )}
                  </div>

                  {/* Geschwindigkeit */}
                  <div className="flex w-full flex-col border rounded-md bg-gray-300 p-2">
                    <h3 className="text-blue-700">
                      <strong>Geschwindigkeit:</strong>
                    </h3>
                    {isEditing ? (
                      <textarea
                        className="w-full p-2 rounded bg-white border"
                        value={formData.geschwindigkeit || ""}
                        onChange={(e) =>
                          handleChange("geschwindigkeit", e.target.value)
                        }
                      />
                    ) : (
                      <p>{feedbackData?.geschwindigkeit}</p>
                    )}
                  </div>

                  {/* Fahrzeugpositionierung */}
                  <div className="flex w-full flex-col border rounded-md bg-gray-300 p-2">
                    <h3 className="text-blue-700">
                      <strong>Fahrzeugpositionierung:</strong>
                    </h3>
                    {isEditing ? (
                      <textarea
                        className="w-full p-2 rounded bg-white border"
                        value={formData.fahrzeugpositionierung || ""}
                        onChange={(e) =>
                          handleChange("fahrzeugpositionierung", e.target.value)
                        }
                      />
                    ) : (
                      <p>{feedbackData?.fahrzeugpositionierung}</p>
                    )}
                  </div>

                  {/* Kommunikation */}
                  <div className="flex w-full flex-col border rounded-md bg-gray-300 p-2">
                    <h3 className="text-blue-700">
                      <strong>Kommunikation:</strong>
                    </h3>
                    {isEditing ? (
                      <textarea
                        className="w-full p-2 rounded bg-white border"
                        value={formData.kommunikation || ""}
                        onChange={(e) =>
                          handleChange("kommunikation", e.target.value)
                        }
                      />
                    ) : (
                      <p>{feedbackData?.kommunikation}</p>
                    )}
                  </div>

                  {/* Fahrzeugbedienung */}
                  <div className="flex w-full flex-col border rounded-md bg-gray-300 p-2">
                    <h3 className="text-blue-700">
                      <strong>Fahrzeugbedienung:</strong>
                    </h3>
                    {isEditing ? (
                      <textarea
                        className="w-full p-2 rounded bg-white border"
                        value={formData.fahrzeugbedienung || ""}
                        onChange={(e) =>
                          handleChange("fahrzeugbedienung", e.target.value)
                        }
                      />
                    ) : (
                      <p>{feedbackData?.fahrzeugbedienung}</p>
                    )}
                  </div>

                  {/* Allgemein */}
                  <div className="flex w-full flex-col border rounded-md bg-blue-300 p-2">
                    <h3 className="text-blue-700">
                      <strong>Allgemein:</strong>
                    </h3>
                    {isEditing ? (
                      <textarea
                        className="w-full p-2 rounded bg-white border"
                        value={formData.allgemein || ""}
                        onChange={(e) =>
                          handleChange("allgemein", e.target.value)
                        }
                      />
                    ) : (
                      <p>{feedbackData?.allgemein}</p>
                    )}
                  </div>
                </div>
              </div>

              {/*  umschalten je nach Status */}
              {isEditing ? (
                <div className="flex gap-2 w-full">
                  <Button
                    onClick={() => setEditingId(null)}
                    className="flex-1 items-center gap-2 h-8 px-3 text-sm border border-red-700 text-red-700 hover:bg-red-100"
                  >
                    <Ban size={14} /> Abbrechen
                  </Button>
                  <Button
                    onClick={() => handleSave(item.id)}
                    className="flex-1 items-center justify-center gap-2 h-8 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100"
                  >
                    <Save className="mr-2 h-4 w-4" /> Speichern
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => handleStartEdit(item)}
                  className="flex w-full items-center gap-2 h-8 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100"
                >
                  <Pencil size={14} /> Bearbeiten
                </Button>
              )}
            </div>
          );
        })}
    </div>
  );
}
