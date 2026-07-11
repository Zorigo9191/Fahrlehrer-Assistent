import { Button } from "@/components/button";
import { Field, FieldGroup, FieldLabel } from "@/components/field";
import { Input } from "@/components/input";
import Textarea from "@/components/textArea";

type FeedbackFormProps = {
  onClose: () => void;
};

export default function FeedbackForm({ onClose }: FeedbackFormProps) {
  return (
    <form className="w-full max-w-md mx-auto">
      <FieldGroup className="space-y-4">
        <Field>
          <FieldLabel htmlFor="date">Datum der Fahrstunde</FieldLabel>

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
            Speichern
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-52 px-3 text-sm border border-blue-700 text-blue-700 hover:bg-blue-100"
          >
            Abbrechen
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
