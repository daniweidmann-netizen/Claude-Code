"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

declare global {
  interface Window {
    __vireliMotion?: boolean;
    __lenis?: Lenis;
  }
}

/**
 * Global motion layer: Lenis smooth scroll synced to the GSAP ticker, plus
 * declarative reveals:
 *   data-reveal="lines"  → SplitText line mask reveal
 *   data-reveal="fade"   → fade + rise
 *   data-reveal-delay    → seconds
 * Respects prefers-reduced-motion (nothing animates, everything visible).
 */
export function Motion() {
  useEffect(() => {
    window.__vireliMotion = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    if (reduce) {
      root.classList.remove("js-motion");
      return;
    }

    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), syncTouch: false });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // In-page anchor links → smooth scroll
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!;
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.6 });
    };
    document.addEventListener("click", onClick);

    const ctx = gsap.context(() => {
      const splits: SplitText[] = [];
      document.querySelectorAll<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
        const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "reveal-line" });
        splits.push(split);
        gsap.set(el, { opacity: 1 });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.35,
          ease: "expo.out",
          stagger: 0.09,
          delay: Number(el.dataset.revealDelay ?? 0),
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      document.querySelectorAll<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "expo.out",
          delay: Number(el.dataset.revealDelay ?? 0),
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
      // Subtle parallax: data-parallax="0.15" (fraction of viewport)
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const amt = Number(el.dataset.parallax);
        gsap.fromTo(
          el,
          { yPercent: -amt * 50 },
          {
            yPercent: amt * 50,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => splits.forEach((s) => s.revert());
    });

    return () => {
      ctx.revert();
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}

/** Inline, render-blocking snippet: enables reveal initial states only when JS + motion are available. */
export const motionBootScript = `(function(){try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var d=document.documentElement;d.classList.add('js-motion');setTimeout(function(){if(!window.__vireliMotion)d.classList.remove('js-motion')},4000)}}catch(e){}})();`;
