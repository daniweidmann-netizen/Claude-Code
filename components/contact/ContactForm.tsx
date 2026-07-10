"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";

const budgetOptions = [
  "Unter CHF 5'000",
  "CHF 5'000 – 15'000",
  "CHF 15'000 – 40'000",
  "Über CHF 40'000",
];

const fieldClass =
  "peer w-full border-b border-[var(--color-border-strong)] bg-transparent py-3.5 text-base text-[var(--color-fg)] outline-none transition-colors placeholder-transparent focus:border-[var(--color-accent)]";
const labelClass =
  "pointer-events-none absolute left-0 top-3.5 text-sm text-[var(--color-fg-muted)] transition-all duration-300 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[var(--color-accent)] peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs";

export default function ContactForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      company: String(form.get("company") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      budget: String(form.get("budget") || ""),
      message: String(form.get("message") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.");
      }

      router.push("/kontakt/erfolg");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
        <div className="relative">
          <input id="name" name="name" type="text" required placeholder=" " className={fieldClass} />
          <label htmlFor="name" className={labelClass}>
            Name *
          </label>
        </div>
        <div className="relative">
          <input id="company" name="company" type="text" placeholder=" " className={fieldClass} />
          <label htmlFor="company" className={labelClass}>
            Firma
          </label>
        </div>
        <div className="relative">
          <input id="phone" name="phone" type="tel" placeholder=" " className={fieldClass} />
          <label htmlFor="phone" className={labelClass}>
            Telefon
          </label>
        </div>
        <div className="relative">
          <input id="email" name="email" type="email" required placeholder=" " className={fieldClass} />
          <label htmlFor="email" className={labelClass}>
            E-Mail *
          </label>
        </div>
        <div className="relative sm:col-span-2">
          <select
            id="budget"
            name="budget"
            defaultValue=""
            className="w-full appearance-none border-b border-[var(--color-border-strong)] bg-transparent py-3.5 text-base text-[var(--color-fg)] outline-none transition-colors focus:border-[var(--color-accent)]"
          >
            <option value="" disabled className="bg-[var(--color-bg-elevated)]">
              Budget wählen
            </option>
            {budgetOptions.map((option) => (
              <option key={option} value={option} className="bg-[var(--color-bg-elevated)]">
                {option}
              </option>
            ))}
          </select>
          <label
            htmlFor="budget"
            className="absolute -top-3.5 left-0 text-xs text-[var(--color-fg-muted)]"
          >
            Budget
          </label>
        </div>
        <div className="relative sm:col-span-2">
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder=" "
            className={`${fieldClass} resize-none`}
          />
          <label htmlFor="message" className={labelClass}>
            Projektbeschreibung *
          </label>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <motion.button
        type="submit"
        disabled={submitting}
        data-cursor="hover"
        whileHover={{ scale: submitting ? 1 : 1.02 }}
        whileTap={{ scale: submitting ? 1 : 0.98 }}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-fg)] px-8 py-4 text-sm font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-accent-soft)] disabled:opacity-60 sm:w-auto"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Wird gesendet …
          </>
        ) : (
          <>
            Projekt starten
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </motion.button>
    </form>
  );
}
