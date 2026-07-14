import { Button } from "@/components/button";
import { Pencil, Save } from "lucide-react";

export default function FeedbackCard() {
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
      <h2 className="flex items-center justify-center">
        <strong> Feedback vom 12.05.2026 </strong>
      </h2>
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
