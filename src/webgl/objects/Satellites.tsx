"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "../state";
import { Berry, Gummy } from "./Fruit";
import type { BerryKind } from "./geometry";

/**
 * Berries and gummies that accompany the pouch: a slow orbit in the hero and
 * finale, a composed still-life arc in the product reveal, two gummies on the
 * nightstand in the ritual. Hidden in the berry world (the field takes over).
 */
const KINDS: BerryKind[] = ["strawberry", "raspberry", "blackberry", "blueberry"];
const GUMMIES = 4;

export function Satellites({ seg, transmission }: { seg: number; transmission: boolean }) {
  const berries = useRef<(THREE.Group | null)[]>([]);
  const gummies = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const P = world.pouch;
    const S = world.stage;
    const h = P.h;
    const intro = world.introStart < 0 ? 0 : THREE.MathUtils.smoothstep(t - world.introStart, 0.4, 2.6);
    const orbitW = (S.hero ?? 0) + (S.finale ?? 0);
    const prodW = S.product ?? 0;
    const ritW = S.ritual ?? 0;
    const vis = (1 - (S.berries ?? 0)) * intro;
    const k = 0.08;

    // Hero/finale constellation around the corners of the pouch (never in front of the artwork)
    const HERO_B = [
      [-0.5, -0.38, 0.32],
      [0.52, 0.34, -0.25],
      [0.6, -0.22, 0.12],
      [-0.36, 0.52, -0.45],
    ];
    const PROD_B = [
      [-0.46, -0.525, 0.3],
      [0.47, -0.53, 0.24],
      [-0.4, -0.54, -0.36],
      [-0.66, -0.2, -0.4],
    ];
    // Narrow screens: the headline sits right below the pouch, keep the lower half clear
    const compact = state.size.width < 640;
    berries.current.forEach((b, i) => {
      if (!b) return;
      const [hx0, hy0, hz] = HERO_B[i];
      const hx = compact && hy0 < 0 ? hx0 * 1.1 : hx0;
      const hy = compact && hy0 < 0 ? 0.05 : hy0;
      const [px, py, pz] = PROD_B[i];
      const spread = 1 + (S.finale ?? 0) * 0.2;
      const drift = Math.sin(t * 0.35 + i * 1.7);
      const tx = P.x + h * ((hx * spread + drift * 0.04) * orbitW + px * prodW);
      const ty = P.y + h * ((hy * spread + Math.cos(t * 0.3 + i) * 0.035) * orbitW + py * prodW);
      const tz = P.z + h * ((hz + drift * 0.08) * orbitW + pz * prodW);
      b.position.x += (tx - b.position.x) * k;
      b.position.y += (ty - b.position.y) * k;
      b.position.z += (tz - b.position.z) * k;
      const s = h * (i === 0 ? 0.13 : 0.105) * vis * (1 - ritW);
      b.scale.setScalar(Math.max(0.0001, b.scale.x + (s - b.scale.x) * k));
      b.rotation.set(Math.sin(t * 0.3 + i) * 0.5, t * 0.22 + i, Math.cos(t * 0.2 + i) * 0.3);
    });

    gummies.current.forEach((g, i) => {
      if (!g) return;
      // hero: a loose group drifting below the pouch base
      const hx = (-0.28 + i * 0.21) * h, hy = (-0.56 - (i % 2) * 0.06) * h, hz = (0.32 - (i % 2) * 0.22) * h;
      // product: a precise arc in front of the base
      const ax = (-0.27 + i * 0.18) * h, ay = -0.588 * h, az = h * 0.4;
      // ritual: two gummies resting next to the pouch
      const rx = (0.42 + i * 0.13) * h, ry = -0.46 * h, rz = 0.2 * h;
      const bob = Math.sin(t * 0.9 + i * 2) * 0.025 * h * (1 - ritW);
      const tx = P.x + hx * orbitW + ax * prodW + rx * ritW;
      const ty = P.y + hy * orbitW + ay * prodW + ry * ritW + bob;
      const tz = P.z + hz * orbitW + az * prodW + rz * ritW;
      g.position.x += (tx - g.position.x) * k;
      g.position.y += (ty - g.position.y) * k;
      g.position.z += (tz - g.position.z) * k;
      const s = h * 0.085 * vis * (ritW > 0.5 && i > 1 ? 0 : 1) * (compact ? 1 - orbitW * (S.hero ?? 0) : 1);
      g.scale.setScalar(Math.max(0.0001, g.scale.x + (s - g.scale.x) * k));
      g.rotation.set(0.45 * (1 - ritW) + Math.sin(t * 0.4 + i) * 0.25 * orbitW, t * 0.25 * orbitW + i * 0.8, Math.sin(t * 0.3 + i) * 0.2 * orbitW);
    });
  });

  return (
    <>
      {KINDS.map((kind, i) => (
        <Berry key={kind} kind={kind} seg={seg} ref={(el) => void (berries.current[i] = el)} />
      ))}
      {Array.from({ length: GUMMIES }, (_, i) => (
        <Gummy key={i} seg={seg} transmission={transmission} ref={(el) => void (gummies.current[i] = el)} />
      ))}
    </>
  );
}
