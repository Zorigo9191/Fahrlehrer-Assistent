import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

export function showWarning(message: string) {
  toast.warning(message, {
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
