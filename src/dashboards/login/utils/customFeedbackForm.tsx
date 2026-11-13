import { useState } from "react";
import { Field, FieldGroup, FieldLabel } from "../../../components/field.tsx";
import { Input } from "../../../components/input.tsx";
import Textarea from "../../../components/textArea.tsx";
import { Button } from "../../../components/button.tsx";
import { Ban, Save } from "lucide-react";

export function CustomFeedbackForm({ onClose }: { onClose: () => void }) {
  const [customComment, setCustomComment] = useState("");
  const [commentTouched, setCommentTouched] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValidComment = (value: string) => value.trim().length >= 5;
  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

  const showCommentError = commentTouched && !isValidComment(customComment);
  const showEmailError = emailTouched && !isValidEmail(customEmail);

  const handleSaveCustomFeedback = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailTouched(true);
    setCommentTouched(true);
    if (!isValidEmail(customEmail) || !isValidComment(customComment)) return;

    setSubmitted(true);
  };

  const focusReset =
    "focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-slate-200";

  if (submitted) {
    return (
      <div className="mt-6 flex flex-col items-center gap-4 text-center bg-gray-600 p-2 rounded-2xl">
        <p className="text-sm font-semibold text-black">
          Vielen Dank für Ihr Feedback!
        </p>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="h-8 px-3 text-xs border border-slate-200 text-white hover:bg-black hover:text-slate-200"
        >
          Schließen
        </Button>
      </div>
    );
  }

  return (
    <form
      className="w-full mt-2 max-w-md mx-auto scrollbar-none text-xstext-slate-200"
      onSubmit={handleSaveCustomFeedback}
    >
      <FieldGroup className="space-y-4 ">
        <Field>
          <FieldLabel htmlFor="email" className="text-sm text-slate-200">
            <strong>Bitte geben Sie Ihre E-mail Adresse ein</strong>
          </FieldLabel>

          <Input
            id="email"
            value={customEmail}
            type="email"
            aria-invalid={showEmailError}
            className={`h-10 rounded-xl text-xs text-slate-200 border transition ${focusReset}
            `}
            onChange={(e) => setCustomEmail(e.target.value)}
            onBlurCapture={() => setEmailTouched(true)}
          />

          {showEmailError && (
            <p className="text-xs text-red-500">
              Bitte eine gültige E-Mail eingeben
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel className="text-xs text-slate-200">
            <p>Haben Sie Feedback für uns?</p>
          </FieldLabel>

          <Textarea
            value={customComment}
            aria-invalid={showCommentError}
            onChange={(e) => setCustomComment(e.target.value)}
            onBlurCapture={() => setCommentTouched(true)}
            placeholder="..."
            className={`h-24 resize-none text-slate-200 ${focusReset}`}
          />

          {showCommentError && (
            <p className="text-xs text-red-500">
              Bitte mindestens 5 Zeichen eingeben
            </p>
          )}
        </Field>

        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          <Button
            type="submit"
            variant="ghost"
            className="h-8 w-52 px-3 text-xs border border-slate-200 text-white hover:bg-black hover:text-slate-200"
          >
            <Save className="mr-2 h-4 w-4" />
            Feedback senden
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-52 px-3 text-xs border border-slate-200 text-white hover:bg-black hover:text-slate-200"
          >
            <Ban className="mr-2 h-4 w-4" />
            Abbrechen
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
