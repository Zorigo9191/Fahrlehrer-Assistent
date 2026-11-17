import { useEffect, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const GIVE_UP_AFTER = 90; // Sekunden

export default function ServerGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const ping = async () => {
      while (!cancelled) {
        try {
          const res = await fetch(`${API_URL}/health`, {
            signal: AbortSignal.timeout(8000),
          });
          if (res.ok) {
            if (!cancelled) setReady(true);
            return;
          }
        } catch {
          // Server schläft noch, nach kurzer Pause erneut versuchen
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
    };

    ping();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (ready) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [ready]);

  if (ready) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-4 text-center text-slate-200">
      <Loader2 className="h-10 w-10 animate-spin text-[#3EDED3]" />
      {seconds < GIVE_UP_AFTER ? (
        <>
          <p className="text-lg font-medium">Server startet …</p>
          <p className="text-sm text-slate-400">
            Der erste Aufruf kann bis zu einer Minute dauern ({seconds}s).
          </p>
        </>
      ) : (
        <p className="text-sm text-slate-400">
          Der Server antwortet nicht. Bitte lade die Seite später neu.
        </p>
      )}
    </div>
  );
}
