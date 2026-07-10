"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

/**
 * Drives the whole document with Lenis so wheel/touch input resolves to a
 * single buttery inertial scroll — every scroll-linked effect downstream
 * (parallax, reveals, nav morph) reads from this one RAF loop.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
