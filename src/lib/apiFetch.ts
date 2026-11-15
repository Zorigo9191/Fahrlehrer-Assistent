import { supabase } from "./supabase.ts";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

// import { supabase } from "./supabase.ts";

// export async function apiFetch(url: string, options: RequestInit = {}) {
//   const { data } = await supabase.auth.getSession();
//   const token = data.session?.access_token;

//   return fetch(url, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...options.headers,
//     },
//   });
// }
