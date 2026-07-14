import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { Eye, EyeOff, Save } from "lucide-react";
import { useState } from "react";

export default function InstructorCreateForm() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 ">
      <Card className="w-full max-w-lg shadow-lg border-orange-600">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-500">
            Fahrlehrer-Konto erstellen
          </CardTitle>
          <CardDescription>
            Trage die vollständigen Daten für den neuen Fahrlehrer ein.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          *
          <div className="space-y-2">
            <Label htmlFor="id">Fahrlehrer-ID</Label>
            <Input id="id" type="text" placeholder="z.B. FL-1002" required />
          </div>
          {/* 2. Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name, Vorname</Label>
            <Input
              id="name"
              type="text"
              placeholder="Max Mustermann"
              required
            />
          </div>
          {/* 3. Passwort */}
          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {/* 4. Klasse (z.B. Klasse B, A, C) */}
          <div className="space-y-2">
            <Label htmlFor="klasse">Führerscheinklassen</Label>
            <Input id="klasse" type="text" placeholder="B, BE, A" required />
          </div>
          {/* 5. Telefonnummer */}
          <div className="space-y-2">
            <Label htmlFor="telefon">Telefonnummer</Label>
            <Input
              id="telefon"
              type="tel"
              placeholder="+49 170 1234567"
              required
            />
          </div>
          <div className=" gap-2 flex items-center justify-center ">
            <Label htmlFor="student_count">Schülerzahl</Label>
            <span>0</span>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            variant="ghost"
            type="submit"
            className=" h-8 w-full px-3 text-sm border border-orange-500 text-orange-500 hover:bg-orange-200"
          >
            <Save className="mr-2 h-4 w-4" />
            Speichern
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
