"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { techStack } from "@/lib/data/site";

export default function WhyUs() {
  return (
    <section className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-32">
      <div className="pointer-events-none absolute right-0 top-0 h-[36rem] w-[36rem] rounded-full bg-[var(--color-violet)]/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-[30rem] w-[30rem] rounded-full bg-[var(--color-accent)]/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Warum ShopWerk?"
          title="Substanz statt Behauptungen."
          description="Wir versprechen nicht einfach Qualität – wir bauen sie in jedes Detail, jede Zeile Code und jede Millisekunde Ladezeit."
        />

        <div className="mt-20 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Reveal className="lg:col-span-1">
            <div className="glass flex h-full flex-col justify-between rounded-3xl p-10">
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                Individualität
              </span>
              <div className="mt-10">
                <div className="font-display text-gradient-gold text-6xl font-medium tracking-tight sm:text-7xl">
                  <AnimatedCounter value={100} suffix="%" />
                </div>
                <p className="mt-4 max-w-[16rem] text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  Massgeschneiderte Lösungen. Kein Template, kein Baukasten, keine Kompromisse.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-1">
            <div className="glass flex h-full flex-col justify-between rounded-3xl p-10">
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                Performance
              </span>
              <div className="mt-10">
                <div className="font-display text-gradient-aurora text-6xl font-medium tracking-tight sm:text-7xl">
                  <AnimatedCounter value={1.5} prefix="<" suffix="s" decimals={1} />
                </div>
                <p className="mt-4 max-w-[16rem] text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  Durchschnittliche Ladezeit. Geschwindigkeit ist bei uns Designprinzip, nicht Nachgedanke.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.24} className="lg:col-span-1">
            <div className="glass relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-10">
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                Technologie
              </span>
              <div className="mt-10">
                <h3 className="font-display text-2xl font-medium tracking-tight">
                  Modernste Technologien
                </h3>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {techStack.map((tech, i) => (
                    <motion.span
                      key={tech.name}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ y: -3, borderColor: "var(--color-accent)" }}
                      className="rounded-full border border-[var(--color-border-strong)] bg-white/[0.03] px-4 py-2 text-xs font-medium text-[var(--color-fg-muted)]"
                    >
                      {tech.name}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
