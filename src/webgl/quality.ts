import type { Tier } from "./state";

/** Decide if WebGL should run at all. Returns null when the cinematic DOM fallback should be used. */
export function detectTier(): Tier | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const forced = params.get("tier") ?? process.env.NEXT_PUBLIC_FORCE_QUALITY_TIER;
  if (forced === "0") return null;
  if (forced === "1" || forced === "2" || forced === "3") return Number(forced) as Tier;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return null;

  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2");
    if (!gl) return null;
  } catch {
    return null;
  }

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  if (coarse || small) return cores >= 6 && mem >= 4 ? 2 : 1;
  if (cores <= 4 || mem < 4) return 2;
  return 3;
}

export const TIER = {
  1: { dpr: [1, 1.25] as [number, number], stars: 500, dust: 500, fieldBerries: 12, segments: 0.6, post: false, dof: false, transmission: false },
  2: { dpr: [1, 1.6] as [number, number], stars: 900, dust: 1400, fieldBerries: 20, segments: 0.8, post: true, dof: false, transmission: false },
  3: { dpr: [1, 2] as [number, number], stars: 1400, dust: 2600, fieldBerries: 30, segments: 1, post: true, dof: true, transmission: true },
} as const;
