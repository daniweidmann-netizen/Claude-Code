"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { testimonials } from "@/lib/data/testimonials";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  };

  const current = testimonials[index];

  return (
    <section className="relative overflow-hidden border-t border-[var(--color-border)] py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-violet)]/8 blur-[160px]" />

      <div className="relative mx-auto max-w-5xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Kundenbewertungen"
          title="Was unsere Kunden sagen."
          align="center"
          className="mx-auto"
        />

        <div className="relative mt-16">
          <div className="glass-strong relative overflow-hidden rounded-[2.5rem] px-8 py-14 sm:px-16 sm:py-20">
            <Quote className="mx-auto size-10 text-[var(--color-accent)]/50" strokeWidth={1.2} />

            <div className="relative mt-8 min-h-[13rem] sm:min-h-[9rem]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={index}
                  custom={direction}
                  initial={{ opacity: 0, x: 40 * direction, filter: "blur(8px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -40 * direction, filter: "blur(8px)" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center"
                >
                  <p className="font-display text-balance text-2xl font-light leading-snug tracking-tight sm:text-3xl">
                    „{current.quote}“
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <div className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-violet)] text-sm font-medium text-black">
                      {current.initials}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium">{current.name}</div>
                      <div className="text-xs text-[var(--color-fg-muted)]">
                        {current.role}, {current.company}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              type="button"
              data-cursor="hover"
              aria-label="Vorheriges Zitat"
              onClick={() => go(-1)}
              className="flex size-11 items-center justify-center rounded-full border border-[var(--color-border-strong)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <ArrowLeft className="size-4" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  aria-label={`Zitat ${i + 1}`}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className="relative h-1.5 rounded-full bg-[var(--color-border-strong)] transition-all duration-500"
                  style={{ width: i === index ? 28 : 8 }}
                >
                  {i === index && (
                    <motion.span
                      layoutId="testimonial-dot"
                      className="absolute inset-0 rounded-full bg-[var(--color-accent)]"
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              data-cursor="hover"
              aria-label="Nächstes Zitat"
              onClick={() => go(1)}
              className="flex size-11 items-center justify-center rounded-full border border-[var(--color-border-strong)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
