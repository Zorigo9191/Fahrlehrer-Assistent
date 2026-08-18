import { Button } from "@/components/button";
import { Field, FieldGroup, FieldLabel } from "@/components/field";
import { Input } from "@/components/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.ts";

type Role = "student" | "instructor" | "office";

interface LoginFormProps {
  buttonColor: string;
  role: Role | undefined;
}

export function LoginForm({ buttonColor, role }: LoginFormProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    //  direkt aus dem Formular auslesen
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // 1. Bei Supabase anmelden
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      setLoading(false);
      setError("E-Mail oder Passwort ist falsch.");
      return;
    }

    // Rolle aus der 'profiles'-Tabelle abrufen
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    console.log(profileData, profileError);
    if (profileError || !profileData) {
      setLoading(false);
      await supabase.auth.signOut();
      setError("Kein zugehöriges Benutzerprofil gefunden.");
      return;
    }

    if (role && profileData.role !== role) {
      setLoading(false);
      await supabase.auth.signOut(); // Sofort wieder ausloggen, wenn der Bereich falsch ist!
      setError(
        `Zugriff verweigert. Du bist als ${profileData.role} registriert.`,
      );
      return;
    }

    setLoading(false);

    switch (profileData.role) {
      case "student":
        navigate("/dashboard/student");
        break;

      case "instructor":
        navigate("/dashboard/instructor");
        break;

      case "office":
        navigate("/dashboard/office");
        break;

      default:
        navigate("/");
    }
  }

  return (
    <form onSubmit={handleLogin} className="w-full max-w-md mx-auto">
      <FieldGroup className="space-y-5 sm:space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">E-Mail-Adresse</FieldLabel>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="max@mustermann.de"
            required
            className="
              h-12
              w-full
              rounded-xl
              px-4
              text-base
              md:h-14
            "
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Passwort</FieldLabel>

          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••••••"
              required
              className="
                h-12
                w-full
                rounded-xl
                px-4
                text-base
                md:h-14
              "
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </Field>

        <Button
          type="submit"
          disabled={loading}
          className={`
            mt-4
            h-12
            w-full
            rounded-xl
            text-white
            md:h-14
            ${buttonColor}
          `}
        >
          {loading ? "Wird eingeloggt..." : "Login"}
        </Button>
      </FieldGroup>
    </form>
  );
}
