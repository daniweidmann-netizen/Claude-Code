"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { detectTier } from "./quality";
import { world, type Tier } from "./state";

const Experience = dynamic(() => import("./Experience"), { ssr: false });

/**
 * Decides whether the immersive 3D layer runs (WebGL2, no reduced motion, no
 * Save-Data) and mounts it only after the page has loaded, so the DOM layer
 * stays fast (LCP). Without WebGL the existing cinematic DOM design remains.
 */
export function ExperienceMount() {
  const [tier, setTier] = useState<Tier | null>(null);
  const [paused, setPaused] = useState(false);
  const onReady = useCallback(() => {}, []);

  useEffect(() => {
    const t = detectTier();
    if (!t) return;
    world.tier = t;
    const start = () => setTier(t);
    let idle: number | undefined;
    const schedule = () => {
      const w = window as Window;
      idle = typeof w.requestIdleCallback === "function" ? w.requestIdleCallback(start, { timeout: 1200 }) : (w as Window).setTimeout(start, 300);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (idle !== undefined) {
        if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
        clearTimeout(idle);
      }
    };
  }, []);

  // Pointer → world (normalised), plus drag-to-rotate on the product stage
  useEffect(() => {
    if (!tier) return;
    const onMove = (e: PointerEvent) => {
      world.pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      world.pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    let lastX = 0;
    const down = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest('[data-drag="pouch"]');
      if (!el) return;
      world.drag.active = true;
      world.drag.vel = 0;
      lastX = e.clientX;
    };
    const move = (e: PointerEvent) => {
      if (!world.drag.active) return;
      const dx = (e.clientX - lastX) / window.innerWidth;
      lastX = e.clientX;
      world.drag.yaw += dx * 5;
      world.drag.vel = dx * 5 * 0.6;
    };
    const up = () => (world.drag.active = false);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [tier]);

  // Pause rendering while an opaque light section fills the viewport
  useEffect(() => {
    if (!tier) return;
    const check = () => {
      const vh = window.innerHeight;
      const covered = Array.from(document.querySelectorAll<HTMLElement>('[data-header="light"]')).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= 0 && r.bottom >= vh;
      });
      setPaused(covered);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [tier]);

  if (!tier) return null;
  return <Experience tier={tier} paused={paused} onReady={onReady} />;
}
