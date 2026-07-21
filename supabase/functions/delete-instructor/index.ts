import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 1. DIESE CORS-HEADER MÜSSEN DA SEIN:
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

Deno.serve(async (req: Request) => {
  // 2. DAS HIER FÄNGT DEN BROWSER-CHECK (PREFLIGHT) AB:
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { instructorId } = await req.json();

    if (!instructorId) {
      return new Response(JSON.stringify({ error: "Instructor ID fehlt" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { error } = await supabaseAdmin.auth.admin.deleteUser(instructorId);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

// // Importiert den Supabase Client.
// // Dieser Client ermöglicht es, aus der Edge Function heraus mit Supabase zu kommunizieren.

// import { createClient } from "@supabase/supabase-js";

// // Deno.serve startet einen HTTP-Server.
// // Diese Funktion wird jedes Mal ausgeführt, wenn jemand diese Supabase Edge Function aufruft.
// Deno.serve(async (req: Request) => {
//   try {
//     const { instructorId } = await req.json();

//     if (!instructorId) {
//       return new Response(
//         JSON.stringify({
//           error: "Instructor ID fehlt",
//         }),
//         {
//           status: 400,
//         },
//       );
//     }

//     // Erstellt einen Supabase Client mit Admin-Rechten.

//     const supabaseAdmin = createClient(
//       Deno.env.get("SUPABASE_URL")!,
//       Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
//     );

//     // Löscht einen Benutzer aus Supabase Auth.

//     const { error } = await supabaseAdmin.auth.admin.deleteUser(instructorId);

//     if (error) {
//       //   new Response(...) baut die Nachricht, die zurück zur App geht. also, dem User     antworten, falls etwas schief läuft
//       return new Response(
//         JSON.stringify({
//           error: error.message,
//         }),
//         {
//           status: 400,
//         },
//       );
//     }

//     return new Response(
//       JSON.stringify({
//         success: true,
//       }),
//       {
//         status: 200,
//       },
//     );
//   } catch (error) {
//     // Fängt unerwartete Fehler ab.
//     //
//     // Beispiele:
//     // - Ungültiges JSON wurde geschickt
//     // - Supabase Variablen fehlen
//     // - Netzwerkfehler
//     // - Programmfehler
//     return new Response(
//       JSON.stringify({
//         error: error instanceof Error ? error.message : "Unbekannter Fehler",
//       }),
//       {
//         status: 500,
//       },
//     );
//   }
// });
