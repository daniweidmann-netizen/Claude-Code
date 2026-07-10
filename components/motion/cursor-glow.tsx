"use client";

import { useEffect, useRef } from "react";

/**
 * A soft light that trails the cursor, giving glass surfaces the sense of
 * catching real light. Pure transform writes on a ref (no React state) so
 * it never triggers a re-render — safe to run every pointer event.
 */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", handleMove, { passive: true });

    let rafId: number;
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-[480px] w-[480px] rounded-full opacity-[0.06] mix-blend-screen will-change-transform lg:block"
      style={{
        background:
          "radial-gradient(circle, var(--color-gold-300) 0%, var(--color-aurora-violet) 45%, transparent 72%)",
        filter: "blur(40px)",
      }}
    />
  );
}
