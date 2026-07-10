import type { Metadata } from "next";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";
import AuroraBackground from "@/components/ui/AuroraBackground";
import ProjectGallery from "@/components/portfolio/ProjectGallery";

export const metadata: Metadata = {
  title: "Unsere Arbeiten",
  description:
    "Case Studies von ShopWerk: Webdesign, E-Commerce und Landingpages, die messbare Ergebnisse liefern.",
  alternates: { canonical: "/arbeiten" },
};

export default function ArbeitenPage() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden border-b border-[var(--color-border)] pb-20 pt-40">
        <div className="absolute inset-0 opacity-60">
          <AuroraBackground />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
          <Reveal>
            <span className="mb-5 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent)]">
              <span className="h-px w-8 bg-[var(--color-accent)]/60" />
              Portfolio
            </span>
          </Reveal>
          <RevealText
            text="Arbeiten, die für sich sprechen."
            as="h1"
            className="font-display max-w-4xl text-balance text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          />
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
              Eine Auswahl unserer Projekte für Unternehmen, Shops und Launch-Kampagnen –
              jedes davon eine eigenständige digitale Identität.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <ProjectGallery />
        </div>
      </section>
    </div>
  );
}
