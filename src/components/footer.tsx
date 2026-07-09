import { ClipboardList, House, Users } from "lucide-react";
import { Button } from "./button";

interface FooterProps {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
}

export default function Footer({ activeTab, setActiveTab }: FooterProps) {
  const getButtonClass = (tabName: string): string => {
    const baseClass = "flex flex-col items-center gap-1 h-auto py-2";
    const activeClass = "text-blue-600 bg-transparent";
    const inactiveClass = "text-slate-500 bg-transparent";

    return `${baseClass} ${activeTab === tabName ? activeClass : inactiveClass}`;
  };

  return (
    <footer className="border-t bg-white sticky bottom-0 w-full h-16 z-10">
      <div className="flex h-full items-center justify-around">
        <Button
          className={getButtonClass("dashboard")}
          onClick={() => setActiveTab("dashboard")}
        >
          <House size={22} />
          <span className="text-xs">Dashboard</span>
        </Button>

        <Button
          className={getButtonClass("pruefungsliste")}
          onClick={() => setActiveTab("pruefungsliste")}
        >
          <ClipboardList size={22} />
          <span className="text-xs">Prüfungsliste</span>
        </Button>

        <Button
          className={getButtonClass("schuelerliste")}
          onClick={() => setActiveTab("schuelerliste")}
        >
          <Users size={22} />
          <span className="text-xs">Schülerliste</span>
        </Button>
      </div>
    </footer>
  );
}
