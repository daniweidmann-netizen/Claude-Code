"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import { makeBerry, makeGummyGeometry, makeGummyMaterial, type BerryKind, type Part } from "./geometry";

const cache = new Map<string, Part[]>();
export function useBerryParts(kind: BerryKind, seg: number) {
  return useMemo(() => {
    const key = `${kind}-${seg}`;
    if (!cache.has(key)) cache.set(key, makeBerry(kind, seg));
    return cache.get(key)!;
  }, [kind, seg]);
}

const gummyCache = new Map<string, { geometry: THREE.BufferGeometry; material: THREE.Material }>();
export function useGummy(seg: number, transmission: boolean) {
  return useMemo(() => {
    const key = `${seg}-${transmission}`;
    if (!gummyCache.has(key)) gummyCache.set(key, { geometry: makeGummyGeometry(seg), material: makeGummyMaterial(transmission) });
    return gummyCache.get(key)!;
  }, [seg, transmission]);
}

export const Berry = forwardRef<THREE.Group, { kind: BerryKind; seg: number }>(function Berry({ kind, seg }, ref) {
  const parts = useBerryParts(kind, seg);
  return (
    <group ref={ref}>
      {parts.map((p, i) => (
        <mesh key={i} geometry={p.geometry} material={p.material} />
      ))}
    </group>
  );
});

export const Gummy = forwardRef<THREE.Mesh, { seg: number; transmission: boolean }>(function Gummy({ seg, transmission }, ref) {
  const g = useGummy(seg, transmission);
  return <mesh ref={ref} geometry={g.geometry} material={g.material} />;
});
