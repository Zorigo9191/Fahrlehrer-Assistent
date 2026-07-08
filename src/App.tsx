import "./index.css";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types/database.types";
import Root from "./dashboards/root";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_TOKEN,
);

function App() {
  fetchData();

  async function fetchData() {
    const { data, error } = await supabase
      .from("licence_categories")
      .select("*");

    if (error) {
      console.log(error);
    }
    console.log(data);
    return data;
  }

  return (
    <>
      <Root />
    </>
  );
}

export default App;
