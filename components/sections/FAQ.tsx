"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { faqItems } from "@/lib/data/faq";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative border-t border-[var(--color-border)] py-32">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Fragen, die uns oft gestellt werden."
          align="center"
          className="mx-auto"
        />

        <div className="mt-16 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {faqItems.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.question} delay={Math.min(i * 0.05, 0.3)}>
                <div>
                  <button
                    type="button"
                    data-cursor="hover"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-lg font-medium tracking-tight sm:text-xl">
                      {item.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-strong)] text-[var(--color-accent)]"
                    >
                      <Plus className="size-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-7 pr-14 text-sm leading-relaxed text-[var(--color-fg-muted)] sm:text-base">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
