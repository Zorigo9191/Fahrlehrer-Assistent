import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ServerGate from "./components/ServerGate.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ServerGate>
      <App />
    </ServerGate>
  </StrictMode>,
);
