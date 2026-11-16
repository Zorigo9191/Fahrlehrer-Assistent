import { User, Building2, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "../../../components/button.tsx";

export function ContactCard({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-300 p-5 text-sm text-slate-900 shadow-sm">
      {/* Kopfzeile mit Name und Firma */}
      <div className="mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900">
          <User className="h-4 w-4 text-blue-600 " />
          <span>Zo En</span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-900">
          <Building2 className="h-3.5 w-3.5 " />
          <span>ZO Digital GmbH</span>
        </div>
      </div>

      {/* Kontaktdaten & Adresse */}
      <div className="space-y-2.5 text-xs sm:text-sm">
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 shrink-0 text-slate-900" />
          <a
            href="mailto:info@zo-digital.example"
            className="text-blue-600 hover:underline"
          >
            info@zo-digital.example
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 shrink-0 text-slate-900" />
          <a href="tel:+4915123456789" className="hover:text-slate-900">
            +49 151 23456789
          </a>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-900" />
          <div>
            <p>Hauptstraße 42</p>
            <p>10115 Beispielstadt</p>
            <p className="text-slate-900">Deutschland</p>
          </div>
        </div>
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
