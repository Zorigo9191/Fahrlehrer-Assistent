import { Button } from "../../../components/button.tsx";

export function AboutApp({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-300 p-5 text-sm text-slate-900 shadow-sm">
      <div className="mb-4 border-b border-slate-100 pb-3">
        Diese moderne App wurde speziell für den Einsatz in Fahrschulen
        entwickelt. Sie unterstützt Fahrlehrer dabei, ihren Arbeitsalltag
        effizienter zu organisieren und verschiedene Aufgaben zentral zu
        verwalten.Ziel der Anwendung ist es, den Fahrschulalltag zu vereinfachen
        und Fahrlehrern möglichst viele organisatorische Aufgaben abzunehmen.
      </div>
      <div className="flex w-full justify-end ">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="h-8 px-3 text-xs border-2 border-black text-black hover:bg-black hover:text-slate-200 "
        >
          Schließen
        </Button>
      </div>
    </div>
  );
}
