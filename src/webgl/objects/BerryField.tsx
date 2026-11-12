"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "../state";
import { Berry, Gummy } from "./Fruit";
import type { BerryKind } from "./geometry";

/**
 * Chapter 02 — the Berry Dimension: giant berries (and a few gummies) in a
 * tunnel the viewer flies through while scrolling the chapter. The centre is
 * kept clear for the tumbling pouch.
 */
const KINDS: BerryKind[] = ["strawberry", "raspberry", "blackberry", "blueberry"];

export function BerryField({ count, seg, transmission }: { count: number; seg: number; transmission: boolean }) {
  const group = useRef<THREE.Group>(null);
  const refs = useRef<(THREE.Object3D | null)[]>([]);

  const items = useMemo(() => {
    let s = 98765;
    const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
    const total = count + Math.max(2, Math.round(count / 6));
    return Array.from({ length: total }, (_, i) => {
      const a = r() * Math.PI * 2;
      const rad = 1.9 + r() * 2.8;
      return {
        gummy: i >= count,
        kind: KINDS[i % 4],
        x: Math.cos(a) * rad * 1.35,
        y: Math.sin(a) * rad * 0.85,
        z: -(i / total) * 30 - r() * 2,
        s: 0.4 + r() * 0.75,
        rx: r() * 6,
        ry: r() * 6,
        spin: (r() - 0.5) * 0.6,
      };
    });
  }, [count]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const p = world.berries;
    const active = p > 0 && p < 1 && world.mood.beeren > 0.03;
    g.visible = active;
    if (!active) return;
    const t = state.clock.elapsedTime;
    const travel = THREE.MathUtils.lerp(-8, 34, p);
    items.forEach((it, i) => {
      const o = refs.current[i];
      if (!o) return;
      const z = it.z + travel;
      const fade = THREE.MathUtils.smoothstep(z, -34, -22) * (1 - THREE.MathUtils.smoothstep(z, 6.5, 9));
      o.position.set(it.x - world.pointer.x * 0.4 * (z + 30) / 30, it.y - world.pointer.y * 0.25 * (z + 30) / 30 + Math.sin(t * 0.5 + i) * 0.08, z);
      o.scale.setScalar(Math.max(0.0001, it.s * fade * (it.gummy ? 0.7 : 1)));
      o.rotation.set(it.rx + t * it.spin, it.ry + t * it.spin * 0.7, 0);
    });
  });

  return (
    <group ref={group} visible={false}>
      {items.map((it, i) =>
        it.gummy ? (
          <Gummy key={i} seg={seg} transmission={transmission} ref={(el) => void (refs.current[i] = el)} />
        ) : (
          <Berry key={i} kind={it.kind} seg={seg} ref={(el) => void (refs.current[i] = el)} />
        ),
      )}
    </group>
  );
}
