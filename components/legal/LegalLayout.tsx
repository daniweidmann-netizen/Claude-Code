import { ReactNode } from "react";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";

interface LegalLayoutProps {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}

export default function LegalLayout({ eyebrow, title, updated, children }: LegalLayoutProps) {
  return (
    <div className="pb-32 pt-40">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <Reveal>
          <span className="mb-5 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent)]">
            <span className="h-px w-8 bg-[var(--color-accent)]/60" />
            {eyebrow}
          </span>
        </Reveal>
        <RevealText
          text={title}
          as="h1"
          className="font-display text-balance text-4xl font-medium leading-tight tracking-tight sm:text-5xl"
        />
        <Reveal delay={0.2}>
          <p className="mt-5 text-sm text-[var(--color-fg-subtle)]">Stand: {updated}</p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="legal-prose mt-16 space-y-10 text-[15px] leading-relaxed text-[var(--color-fg-muted)]">
            {children}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
