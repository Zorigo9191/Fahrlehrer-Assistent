import { Button } from "@/components/button";
import { Bike, Car, Pencil, Save } from "lucide-react";
import { useState } from "react";

export default function FeedbackCard() {
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

  const [selectedClass] = useState("A");

  const selectedLicense = licenseClasses.find(
    (license) => license.value === selectedClass,
  );

  return (
    <div
      className="flex   
      w-full 
      max-w-3xl 
      mx-auto  
      items-center 
      mt-10 
      flex-col 
      gap-3 
      border 
      rounded-2xl
      border-blue-700 p-2  
      max-h-[90vh]
      break-all "
    >
      <div className="flex gap-2">
        <h2 className="flex items-center justify-center">
          <strong> Feedback vom 12.05.2026 </strong>
        </h2>
        <div className="flex items-center gap-2 ">
          <strong className="text-gray-400">Klasse:</strong>
          {selectedLicense?.type === "bike" ? (
            <Bike className="text-blue-700" size={18} />
          ) : (
            <Car className="text-blue-700" size={18} />
          )}
        </div>
      </div>
      <div
        className="
      w-full 
      max-h-[60vh] 
      overflow-y-auto 
      rounded-xl 
      p-3 "
      >
        <div
          className="
        flex 
        flex-col 
        gap-2 
        shadow-inner 
        w-full 
        "
        >
          <div
            className="
          flex 
          w-full
          flex-col 
          border 
          rounded-md
           bg-gray-300 
           p-2 
           gap-2 
           "
          >
            <h3 className="text-blue-700">
              <strong>Verkehrsbeobachtung:</strong>
            </h3>
            <p>
              Unzureichende VK BeoBach
              sadsajdjasdjasjdasjdasjdjasjdajsdjasjdajsdjasjdajsjjsdja
            </p>
          </div>
          <div className="flex w-full flex-col border rounded-md bg-gray-300 p-2">
            <h3 className="text-blue-700">
              <strong>Geschwindigkeit:</strong>
            </h3>
            <p>Unzureichende VK BeoBach</p>
          </div>
          <div className="flex w-full flex-col border rounded-md bg-gray-300 p-2">
            <h3 className="text-blue-700">
              <strong>Fahrzeugpositionierung:</strong>
            </h3>
            <p>Unzureichende VK BeoBach</p>
          </div>
          <div className="flex w-full flex-col border rounded-md bg-gray-300 p-2">
            <h3 className="text-blue-700">
              <strong>Kommunikation:</strong>
            </h3>
            <p>Unzureichende VK BeoBach</p>
          </div>
          <div className="flex w-full flex-col border rounded-md bg-gray-300 p-2">
            <h3 className="text-blue-700">
              <strong>Fahrzeugbedienung:</strong>
            </h3>
            <p>Unzureichende VK BeoBach</p>
          </div>
          <div className="flex w-full flex-col border rounded-md bg-blue-300 p-2">
            <h3>
              <strong>Allgemein:</strong>
            </h3>
            <p>Unzureichende VK BeoBach</p>
          </div>
        </div>
      </div>

      <Button className="flex w-full items-center gap-2 h-8 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100">
        <Pencil size={14} /> Bearbeiten
      </Button>
      <Button className="flex w-full not-only:items-center gap-2 h-8 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100">
        <Save className="mr-2 h-4 w-4" />
        Speichern
      </Button>
    </div>
  );
}
