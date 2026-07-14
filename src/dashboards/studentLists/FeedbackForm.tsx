import { Button } from "@/components/button";
import { Field, FieldGroup, FieldLabel } from "@/components/field";
import { Input } from "@/components/input";
import Textarea from "@/components/textArea";
import { Ban, Save } from "lucide-react";

type FeedbackFormProps = {
  onClose: () => void;
};

export default function FeedbackForm({ onClose }: FeedbackFormProps) {
  return (
    <form className="w-full mt-2 max-w-md mx-auto">
      <FieldGroup className="space-y-4">
        <Field>
          <FieldLabel htmlFor="date">
            <strong>Datum der Fahrstunde</strong>
          </FieldLabel>

          <Input id="date" type="date" className="h-10 rounded-xl" />
        </Field>

        <Field>
          <FieldLabel>Verkehrsbeobachtung</FieldLabel>

          <Textarea placeholder="..." className="h-24 resize-none" />
        </Field>

        <Field>
          <FieldLabel>Geschwindigkeit</FieldLabel>

          <Textarea placeholder="..." className="h-24 resize-none" />
        </Field>

        <Field>
          <FieldLabel>Fahrzeugpositionierung</FieldLabel>

          <Textarea placeholder="..." className="h-24 resize-none" />
        </Field>

        <Field>
          <FieldLabel>Kommunikation</FieldLabel>

          <Textarea placeholder="..." className="h-24 resize-none" />
        </Field>

        <Field>
          <FieldLabel>Fahrzeugbedienung</FieldLabel>

          <Textarea placeholder="..." className="h-24 resize-none" />
        </Field>

        <Field>
          <FieldLabel>Allgemeines Feedback</FieldLabel>

          <Textarea placeholder="..." className="h-24 resize-none" />
        </Field>

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            variant="ghost"
            className="h-8 w-52 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100"
          >
            {" "}
            <Save className="mr-2 h-4 w-4" />
            Speichern
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-52 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100"
          >
            <Ban className="mr-2 h-4 w-4" />
            Abbrechen
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
