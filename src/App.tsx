import "./index.css";
import Root from "./dashboards/Root";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

function App() {
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const loadSession = async () => {
  //     const { error } = await supabase.auth.getSession();

  //     if (error) {
  //       console.error(error);
  //     }

  //     setLoading(false);
  //   };

  //   loadSession();

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((event, session) => {
  //     console.log("Auth event:", event);
  //     console.log("Session:", session);
  //   });

  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, []);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

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
