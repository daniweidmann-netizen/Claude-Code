"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { AuroraBackground } from "@/components/motion/aurora-background";
import { Magnetic } from "@/components/motion/magnetic";

const headline = ["Objects", "engineered", "for", "eternity."];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6"
    >
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0">
        <AuroraBackground />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center pt-24 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="glass-panel mb-8 flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-mist-200"
        >
          <Sparkles size={13} className="text-gold-300" />
          Autumn / Winter Edition, now open
        </motion.div>

        <h1 className="font-display text-[13vw] font-light leading-[0.98] tracking-tight text-mist-50 sm:text-[9vw] lg:text-[6.4vw]">
          {headline.map((word, i) => (
            <span key={word} className="mr-[0.28em] inline-block overflow-hidden last:mr-0">
              <motion.span
                initial={{ y: "110%", rotate: 4 }}
                animate={{ y: "0%", rotate: 0 }}
                transition={{
                  duration: 1.1,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.35 + i * 0.09,
                }}
                className={i === headline.length - 1 ? "text-gradient-gold inline-block italic" : "inline-block"}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
          className="mt-8 max-w-lg text-balance text-base leading-relaxed text-mist-300 sm:text-lg"
        >
          A digital atelier for objects built to outlast trends — designed with
          restraint, finished by hand, and made for those who notice the
          difference.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.05 }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Magnetic strength={0.4}>
            <a
              href="#collection"
              className="group relative overflow-hidden rounded-full bg-mist-50 px-8 py-3.5 text-sm font-medium tracking-wide text-void-950 transition-transform duration-500 hover:scale-[1.03]"
            >
              <span className="relative z-10">Explore the Collection</span>
              <span className="animate-shimmer absolute inset-0 z-0 bg-[linear-gradient(110deg,transparent,rgba(0,0,0,0.15),transparent)] bg-[length:200%_100%]" />
            </a>
          </Magnetic>
          <Magnetic strength={0.4}>
            <a
              href="#philosophy"
              className="rounded-full border border-white/15 px-8 py-3.5 text-sm font-medium tracking-wide text-mist-100 transition-colors duration-300 hover:border-white/30 hover:bg-white/5"
            >
              Our Philosophy
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        className="animate-float pointer-events-none absolute left-[8%] top-[28%] hidden h-24 w-24 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      />
      <motion.div
        aria-hidden
        className="animate-float-delayed pointer-events-none absolute bottom-[24%] right-[10%] hidden h-16 w-16 rounded-full border border-gold-300/30 bg-gradient-to-br from-gold-300/15 to-transparent backdrop-blur-md lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-mist-400"
      >
        <span className="text-[11px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
