import { Button } from "@/components/button";
import { Zap, Pencil, Trash2, List, X } from "lucide-react";

export default function ExamList() {
  const licenseClasses = ["B197", "B78", "B", "BE", "AM", "A1", "A2", "A"];

  return (
    <div className="flex flex-col w-full gap-8 py-8 bg-white">
      {/* Header */}
      <div className="flex gap-1 w-full h-full bg-blue-700 py-4 px-3 rounded-xl  text-white">
        <div className=" flex  items-center w-full justify-between">
          <h1 className="text-2xl text-white font-bold items-center flex gap-2 ">
            <List size={32} />
            Prüfungsliste
          </h1>
          <p className="py-4 px-3">Max MusterMann</p>
        </div>
      </div>

      {/* Schließen Button */}
      <div className="flex w-full justify-end">
        <Button
          variant="ghost"
          className="
            flex items-center gap-2 px-3 
            text-blue-700 
            hover:bg-blue-100 
            font-bold 
            border border-blue-700 
            transition
          "
        >
          <X /> Schließen
        </Button>
      </div>

      {/* Datum Buttons */}
      <div className="flex gap-2 flex-wrap">
        {["Datum 1", "Datum 2", "Datum 3", "Datum 4"].map((date) => (
          <Button
            key={date}
            variant="ghost"
            className="
              px-3 
              text-blue-700 
              hover:bg-blue-100 
              font-bold 
              border 
              border-blue-700
            "
          >
            {date}
          </Button>
        ))}
      </div>

      {/* Prüfung */}
      <div className="rounded-xl border border-blue-700 p-6">
        <div className="flex items-center gap-3 mb-5">
          <Zap className="text-yellow-500" size={22} />

          <h2 className="text-xl font-bold text-blue-700">
            Prüfungstermin buchen
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 p-5">
          <p className="font-bold">14:00 - 15:30 Uhr</p>

          <span className="font-bold">Name des Schülers</span>

          <select
            className="
              w-full 
              rounded-md 
              border 
              border-slate-300 
              p-2
            "
          >
            <option>Führerscheinklasse wählen</option>

            {licenseClasses.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-row gap-4 max-md:flex-col mt-6 p-5">
          <Button
            variant="ghost"
            className="
              flex items-center gap-2 px-3 
              text-blue-700 
              hover:bg-blue-100 
              font-bold 
              border border-blue-700
            "
          >
            Speichern
          </Button>

          <Button
            variant="ghost"
            className="
              flex items-center gap-2 px-3 
              text-blue-700 
              hover:bg-blue-100 
              font-bold 
              border border-blue-700
            "
          >
            <Pencil size={16} />
            Bearbeiten
          </Button>

          <Button
            variant="ghost"
            className="
              flex items-center gap-2 px-3 
              hover:bg-red-50 
              font-bold 
              border border-red-500 
              text-red-500
            "
          >
            <Trash2 size={16} />
            Schüler Löschen
          </Button>
        </div>
      </div>
    </div>
  );
}
