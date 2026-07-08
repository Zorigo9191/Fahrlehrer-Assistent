import { Button } from "@/components/button";
import { Field, FieldGroup, FieldLabel } from "@/components/field";
import { Input } from "@/components/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface InputFieldgroupProps {
  buttonColor: string;
}

export function InputFieldgroup({ buttonColor }: InputFieldgroupProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="
    w-full
    max-w-md
    mx-auto
 
  "
    >
      <FieldGroup
        className="
          space-y-5
          sm:space-y-6
        "
      >
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>

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
          <FieldLabel htmlFor="password">Passwort</FieldLabel>

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

        <Button
          type="submit"
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
          Login
        </Button>
      </FieldGroup>
    </form>
  );
}
