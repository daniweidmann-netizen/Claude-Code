import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import AuroraBackground from "@/components/ui/AuroraBackground";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";

export const metadata: Metadata = {
  title: "Nachricht gesendet",
  description: "Vielen Dank für Ihre Anfrage bei ShopWerk. Wir melden uns in Kürze.",
  robots: { index: false, follow: true },
};

export default function ErfolgPage() {
  return (
    <div className="relative flex min-h-[90svh] items-center overflow-hidden">
      <div className="absolute inset-0 opacity-50">
        <AuroraBackground variant="hero" />
      </div>

      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center sm:px-8">
        <Reveal>
          <div className="mb-8 flex size-16 items-center justify-center rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
            <Check className="size-7" strokeWidth={1.5} />
          </div>
        </Reveal>

        <RevealText
          text="Nachricht gesendet."
          as="h1"
          className="font-display justify-center text-balance text-4xl font-medium leading-tight tracking-tight sm:text-5xl md:text-6xl"
        />

        <Reveal delay={0.3}>
          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-[var(--color-fg-muted)]">
            Vielen Dank für Ihr Interesse an ShopWerk. Wir haben Ihre Anfrage erhalten
            und melden uns innerhalb eines Werktages mit den nächsten Schritten.
          </p>
        </Reveal>

        <Reveal delay={0.45} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton
            href="/"
            className="bg-[var(--color-fg)] text-[var(--color-bg)] hover:bg-[var(--color-accent-soft)]"
          >
            <ArrowLeft className="size-4" />
            Zur Startseite
          </MagneticButton>
          <MagneticButton
            href="/arbeiten"
            className="border border-[var(--color-border-strong)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Unsere Arbeiten
            <ArrowUpRight className="size-4" />
          </MagneticButton>
        </Reveal>

        <Reveal delay={0.55}>
          <Link
            href="/"
            className="mt-16 inline-block font-display text-xl tracking-tight text-[var(--color-fg-subtle)]"
          >
            Shop<span className="text-gradient-gold">Werk</span>
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
