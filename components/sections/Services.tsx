"use client";

import {
  PenTool,
  Code2,
  ShoppingBag,
  Sparkles,
  Search,
  Gauge,
  LifeBuoy,
  Server,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import { services } from "@/lib/data/services";

const icons: Record<string, LucideIcon> = {
  PenTool,
  Code2,
  ShoppingBag,
  Sparkles,
  Search,
  Gauge,
  LifeBuoy,
  Server,
};

export default function Services() {
  return (
    <section id="leistungen" className="relative border-t border-[var(--color-border)] py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Leistungen"
          title="Alles aus einer Hand, auf höchstem Niveau."
          description="Von der ersten Skizze bis zum laufenden Betrieb: Wir begleiten Ihr digitales Projekt über den gesamten Lebenszyklus – mit einem Team statt Schnittstellen."
        />

        <div className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const Icon = icons[service.icon];
            return (
              <Reveal key={service.title} delay={(i % 4) * 0.08}>
                <TiltCard maxTilt={5} className="group h-full">
                  <div className="glass relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-colors duration-500 hover:border-[var(--color-accent)]/40">
                    <div className="mb-8 flex items-start justify-between">
                      <span className="font-display text-sm text-[var(--color-fg-subtle)]">
                        {service.index}
                      </span>
                      <div className="flex size-11 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-accent)] transition-all duration-500 group-hover:scale-110 group-hover:border-[var(--color-accent)]/50 group-hover:bg-[var(--color-accent)]/10">
                        {Icon && <Icon className="size-5" strokeWidth={1.5} />}
                      </div>
                    </div>

                    <h3 className="font-display text-2xl font-medium tracking-tight">
                      {service.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                      {service.description}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {service.points.map((point) => (
                        <li
                          key={point}
                          className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[11px] text-[var(--color-fg-subtle)] transition-colors duration-500 group-hover:border-[var(--color-border-strong)] group-hover:text-[var(--color-fg-muted)]"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>

                    <ArrowUpRight className="absolute right-6 top-6 size-5 -translate-x-1 translate-y-1 text-[var(--color-accent)] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
