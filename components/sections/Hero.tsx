"use client";

import { useRef, MouseEvent } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import AuroraBackground from "@/components/ui/AuroraBackground";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { heroStats } from "@/lib/data/site";

const particles = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  left: (i * 37) % 100,
  top: (i * 53) % 100,
  size: 1.5 + ((i * 13) % 3),
  duration: 8 + (i % 7),
  delay: (i % 5) * 0.6,
}));

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const glassRotateX = useTransform(my, [0, 1], [6, -6]);
  const glassRotateY = useTransform(mx, [0, 1], [-6, 6]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[var(--color-bg)] pt-32 pb-20"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <AuroraBackground variant="hero" />

        {/* Light rays */}
        <div
          className="animate-spin-slow absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.10]"
          style={{
            background:
              "conic-gradient(from 90deg, transparent 0deg, rgba(216,180,120,0.9) 8deg, transparent 20deg, transparent 160deg, rgba(91,140,255,0.8) 172deg, transparent 190deg, transparent 340deg, rgba(216,180,120,0.6) 352deg, transparent 360deg)",
          }}
          aria-hidden
        />

        {/* Particles */}
        <div className="absolute inset-0">
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute rounded-full bg-[var(--color-accent-soft)]"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
                opacity: 0.35,
                animation: `float-y ${p.duration}s ease-in-out ${p.delay}s infinite`,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-bg)]" />
        <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_0%,transparent_0%,rgba(5,5,6,0.5)_75%)]" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-6 sm:px-8"
      >
        <Reveal>
          <div className="mb-8 inline-flex w-fit items-center gap-2 self-start rounded-full border border-[var(--color-border-strong)] bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.25em] text-[var(--color-fg-muted)] backdrop-blur">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[var(--color-accent)]" />
            </span>
            Premium Webdesign Agentur · Schweiz
          </div>
        </Reveal>

        <RevealText
          text="Digitale Erlebnisse, die Kunden überzeugen."
          as="h1"
          className="font-display max-w-5xl text-balance text-5xl font-medium leading-[1.03] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]"
        />

        <Reveal delay={0.5} className="mt-8 max-w-xl">
          <p className="text-lg leading-relaxed text-[var(--color-fg-muted)] sm:text-xl">
            Wir entwickeln Premium-Webseiten für Unternehmen, die wachsen möchten —
            gestaltet in Grafstal, gebaut für internationale Ansprüche.
          </p>
        </Reveal>

        <Reveal delay={0.65} className="mt-12 flex flex-wrap items-center gap-5">
          <MagneticButton
            href="/#kontakt"
            className="bg-[var(--color-fg)] text-[var(--color-bg)] hover:bg-[var(--color-accent-soft)]"
          >
            Projekt starten
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </MagneticButton>
          <MagneticButton
            href="/arbeiten"
            className="border border-[var(--color-border-strong)] text-[var(--color-fg)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Unsere Arbeiten
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </MagneticButton>
        </Reveal>

        <motion.div
          style={{ rotateX: glassRotateX, rotateY: glassRotateY, transformPerspective: 1200 }}
          className="glass mt-20 grid w-full grid-cols-2 gap-6 rounded-3xl p-6 sm:grid-cols-4 sm:p-8"
        >
          {heroStats.map((stat, i) => (
            <Reveal key={stat.label} delay={0.15 * i}>
              <div>
                <div className="font-display text-2xl font-medium text-[var(--color-fg)] sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-[var(--color-fg-muted)] sm:text-sm">
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[var(--color-fg-subtle)]"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scrollen</span>
        <ChevronDown className="size-4" />
      </motion.div>

      <Link href="/#leistungen" className="sr-only">
        Zu unseren Leistungen springen
      </Link>
    </section>
  );
}
