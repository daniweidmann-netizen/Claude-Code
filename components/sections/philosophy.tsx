"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";

const PILLARS = [
  {
    index: "01",
    title: "Material",
    body: "We source what will age with dignity — brushed titanium, full-grain leather, hand-blown glass. Nothing that fades, nothing that peels.",
  },
  {
    index: "02",
    title: "Time",
    body: "Each object spends months in development before a single unit is produced. We would rather ship late than ship ordinary.",
  },
  {
    index: "03",
    title: "Restraint",
    body: "Luxury is not decoration. It is the discipline to remove everything that doesn't serve the object's purpose.",
  },
];

export function Philosophy() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.2"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="philosophy" ref={ref} className="relative px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-gold-300">
            Our Philosophy
          </p>
          <p className="font-display text-3xl font-light italic leading-[1.3] text-mist-100 sm:text-4xl lg:text-5xl">
            &ldquo;We don&apos;t design products.{" "}
            <span className="text-gradient-gold">We design the moments</span>{" "}
            before you notice them working.&rdquo;
          </p>
        </Reveal>

        <div className="relative mx-auto mt-24 max-w-4xl">
          <div className="absolute left-4 top-0 hidden h-full w-px bg-white/10 sm:block">
            <motion.div
              style={{ scaleY: lineScale }}
              className="h-full w-full origin-top bg-gradient-to-b from-gold-300 via-gold-400/60 to-transparent"
            />
          </div>

          <div className="flex flex-col gap-16 sm:pl-16">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.index} delay={i * 0.1}>
                <div className="grid grid-cols-[auto_1fr] items-start gap-6 sm:grid-cols-[80px_1fr] sm:gap-10">
                  <span className="font-display text-3xl font-light text-mist-500">
                    {pillar.index}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-light text-mist-50 sm:text-3xl">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-mist-400">
                      {pillar.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
