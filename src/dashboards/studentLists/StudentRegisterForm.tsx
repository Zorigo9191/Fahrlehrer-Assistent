import { Button } from "@/components/button";
import { Field, FieldGroup, FieldLabel } from "@/components/field";
import { Input } from "@/components/input";
import { Bike, Car, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type StudentRegisterFormProps = {
  onClose: () => void;
};

const licenseClasses = [
  { value: "B197", type: "car" },
  { value: "B78", type: "car" },
  { value: "B", type: "car" },
  { value: "BE", type: "car" },
  { value: "AM", type: "bike" },
  { value: "A1", type: "bike" },
  { value: "A2", type: "bike" },
  { value: "A", type: "bike" },
];

export default function StudentRegisterForm({
  onClose,
}: StudentRegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedClass, setSelectedClass] = useState("B197");

  const selectedLicense = licenseClasses.find(
    (license) => license.value === selectedClass,
  );

  return (
    <form
      className="
    w-full
    max-w-md
    mx-auto"
    >
      <FieldGroup
        className="
          space-y-5
          sm:space-y-6"
      >
        <Field>
          <FieldLabel htmlFor="name">Name eingeben</FieldLabel>

          <Input
            id="name"
            type="text"
            placeholder="Max Mustermann"
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
          <FieldLabel htmlFor="password">Passwort vergeben</FieldLabel>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••••••"
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
        <div className="flex items-center gap-2">
          {selectedLicense?.type === "bike" ? (
            <Bike className="text-blue-700" size={18} />
          ) : (
            <Car className="text-blue-700" size={18} />
          )}

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm"
          >
            {licenseClasses.map((category) => (
              <option key={category.value} value={category.value}>
                {category.value}
              </option>
            ))}
          </select>
        </div>
        <div className=" flex gap-2">
          <Button
            variant="ghost"
            className="h-8 w-52 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100"
          >
            Speichern
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex w-52 items-center gap-2 h-8 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100"
          >
            Abbrechen
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
