import "./index.css";
import Root from "./dashboards/Root";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <Root />

        <Toaster
          toastOptions={{
            unstyled: true,
          }}
        />
      </AuthProvider>
    </>
  );
}

export default App;
