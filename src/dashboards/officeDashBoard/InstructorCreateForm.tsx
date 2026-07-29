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
import { Ban, Eye, EyeOff, Save } from "lucide-react";
import { useState } from "react";
import { createInstructor } from "./instructorService/InstructorService";

type instructorCreateFormProps = {
  onClose: () => void;
};

export default function InstructorCreateForm({
  onClose,
}: instructorCreateFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [teachingClasses, setTeachingClasses] = useState<string[]>([]);

  const handleSave = async () => {
    const { error } = await createInstructor({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      phone_number: phoneNumber,
      teaching_classes: teachingClasses,
    });

    if (error) {
      console.log("Supabase error:", error);
      return;
    }
    console.log("Instructor saved");
    onClose();
  };

  return (
    <div className="flex justify-center items-center min-h-90 bg-gray-50 p-4 overflow-x-hidden ">
      <Card className="w-full max-w-lg shadow-lg border-orange-600 mt-8 ">
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
            <Input id="id" type="text" placeholder="Fl-4" required />
          </div>
          {/* Namen */}
          <div className="space-y-2">
            <Label htmlFor="name"> Vorname</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Vorname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name"> Nachname</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Nachname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          {/* Emmail Adresse */}
          <div className="space-y-2">
            <Label htmlFor="name"> E-mail</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="max@example.com"
            />
          </div>
          {/* Passwort */}
          <div className="space-y-2">
            <Label htmlFor="password">Passwort vergeben</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          {/* AusbildungsKlasse  */}
          <div className="space-y-2">
            <Label htmlFor="klasse">Ausbildungsklasse</Label>
            <Input
              id="klasse"
              type="text"
              placeholder="B, BE, A"
              onChange={(e) =>
                setTeachingClasses(
                  e.target.value.split(",").map((item) => item.trim()),
                )
              }
              required
            />
          </div>
          {/*  Telefonnummer */}
          <div className="space-y-2">
            <Label htmlFor="telefon">Telefonnummer</Label>
            <Input
              id="telefon"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+49 ..........."
              required
            />
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex w-full gap-2 ">
            <Button
              variant="ghost"
              type="button"
              onClick={handleSave}
              className=" h-8 w-full px-3 text-sm border border-orange-500 text-orange-500 hover:bg-orange-200"
            >
              <Save className="mr-2 h-4 w-4" />
              Speichern
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-full px-3 text-sm border border-orange-500 text-orange-500 hover:bg-orange-200"
            >
              <Ban className="mr-2 h-4 w-4" />
              Abbrechen
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
