import "./index.css";
import Root from "./dashboards/Root";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Root />
      <Toaster
        toastOptions={{
          unstyled: true,
        }}
      />
    </>
  );
}

export default App;
