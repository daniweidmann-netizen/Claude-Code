import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import AuroraBackground from "@/components/ui/AuroraBackground";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[90svh] items-center overflow-hidden">
      <div className="absolute inset-0 opacity-50">
        <AuroraBackground />
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center sm:px-8">
        <Reveal>
          <div className="mb-8 flex size-16 items-center justify-center rounded-full border border-[var(--color-border-strong)] text-[var(--color-accent)]">
            <Compass className="size-7" strokeWidth={1.5} />
          </div>
        </Reveal>

        <RevealText
          text="404"
          as="h1"
          className="font-display justify-center text-[6rem] font-medium leading-none tracking-tight sm:text-[9rem]"
        />

        <Reveal delay={0.25}>
          <h2 className="font-display mt-4 text-2xl font-medium tracking-tight sm:text-3xl">
            Diese Seite hat sich verlaufen.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--color-fg-muted)]">
            Die von Ihnen gesuchte Seite existiert nicht mehr oder wurde verschoben.
            Kehren Sie zurück zur Startseite oder entdecken Sie unsere Arbeiten.
          </p>
        </Reveal>

        <Reveal delay={0.4} className="mt-10 flex flex-wrap items-center justify-center gap-4">
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
          </MagneticButton>
        </Reveal>

        <Reveal delay={0.5}>
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
