import { type LucideIcon } from "lucide-react";
import { Button } from "./button";

interface FooterItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface FooterProps {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
  items: FooterItem[];
  color?: string;
}

export default function Footer({
  activeTab,
  setActiveTab,
  items,
  color = "text-blue-600",
}: FooterProps) {
  const getButtonClass = (tabName: string) => {
    return `
      flex flex-col items-center gap-1 h-auto py-2 bg-transparent
      ${activeTab === tabName ? color : "text-slate-500"}
    `;
  };

  return (
    <footer className="border-t bg-white sticky bottom-0 w-full h-16 z-10">
      <div className="flex h-full items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Button
              key={item.id}
              className={getButtonClass(item.id)}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={22} />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </footer>
  );
}
