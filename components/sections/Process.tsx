"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MessageCircle,
  Compass,
  PenTool,
  Code2,
  Rocket,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";
import { processSteps } from "@/lib/data/process";
import SectionHeading from "@/components/ui/SectionHeading";

const icons: Record<string, LucideIcon> = {
  MessageCircle,
  Compass,
  PenTool,
  Code2,
  Rocket,
  LifeBuoy,
};

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section || prefersReducedMotion) return;

      const setTween = () => {
        const distance = track.scrollWidth - window.innerWidth;
        if (distance <= 0) return;

        const tween = gsap.to(track, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance + window.innerHeight * 0.4}`,
            scrub: 0.6,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
        return tween;
      };

      const tween = setTween();
      return () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="prozess" ref={sectionRef} className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Unser Prozess"
          title="Sechs Schritte zu einem Ergebnis, das trägt."
          description="Kein starres Baukastensystem – ein klarer, bewährter Prozess mit Raum für Ihre Marke."
        />
      </div>

      <div
        ref={trackRef}
        className="mt-20 flex w-max gap-6 px-6 will-change-transform sm:gap-8 sm:px-8 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {processSteps.map((step) => {
          const Icon = icons[step.icon];
          return (
            <div
              key={step.title}
              className="glass flex h-[22rem] w-[20rem] shrink-0 flex-col justify-between rounded-3xl p-8 sm:h-[24rem] sm:w-[24rem]"
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-4xl text-[var(--color-fg-subtle)]">
                  {step.index}
                </span>
                <div className="flex size-12 items-center justify-center rounded-full border border-[var(--color-border-strong)] text-[var(--color-accent)]">
                  {Icon && <Icon className="size-5" strokeWidth={1.5} />}
                </div>
              </div>
              <div>
                <h3 className="font-display text-3xl font-medium tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
        <div className="w-[1px] shrink-0 sm:w-8" aria-hidden />
      </div>
    </section>
  );
}
