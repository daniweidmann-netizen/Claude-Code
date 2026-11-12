"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { Director } from "./Director";
import { TIER } from "./quality";
import { world, type Tier } from "./state";
import { Backdrop } from "./objects/Backdrop";
import { Stars } from "./objects/Stars";
import { Dust } from "./objects/Dust";
import { Moon3D } from "./objects/Moon3D";
import { Pouch } from "./objects/Pouch";
import { Lights } from "./objects/Lights";
import { Effects } from "./objects/Effects";
import { Satellites } from "./objects/Satellites";
import { BerryField } from "./objects/BerryField";
import { ProductStage } from "./objects/ProductStage";

/** Marks the 3D layer as ready once all suspended assets have loaded. */
function Ready({ onReady }: { onReady: () => void }) {
  const clock = useThree((s) => s.clock);
  useEffect(() => {
    world.introStart = clock.elapsedTime + 0.15;
    document.documentElement.classList.add("webgl");
    onReady();
    return () => document.documentElement.classList.remove("webgl");
  }, [clock, onReady]);
  return null;
}

export default function Experience({ tier, paused, onReady }: { tier: Tier; paused: boolean; onReady: () => void }) {
  const q = TIER[tier];
  const [dpr, setDpr] = useState<number>(Math.min(q.dpr[1], typeof window !== "undefined" ? window.devicePixelRatio : 1));

  return (
    <Canvas
      className="!fixed inset-0 !h-[100lvh] !w-full"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      frameloop={paused ? "never" : "always"}
      dpr={dpr}
      camera={{ fov: 32, position: [0, 0, 10], near: 0.1, far: 120 }}
      gl={{ antialias: tier > 1 && !q.post, alpha: false, powerPreference: "high-performance", stencil: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.setClearColor("#05060f");
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(1, d - 0.35))}
        onIncline={() => setDpr((d) => Math.min(q.dpr[1], d + 0.2))}
        flipflops={3}
      />
      <Director />
      <Backdrop />
      <Stars count={q.stars} />
      <Dust count={q.dust} />
      <Moon3D />
      <ProductStage />
      <Lights />
      <Suspense fallback={null}>
        <Pouch segments={q.segments} />
        <Satellites seg={q.segments} transmission={q.transmission} />
        <BerryField count={q.fieldBerries} seg={q.segments * 0.8} transmission={false} />
        <Ready onReady={onReady} />
      </Suspense>
      <Effects tier={tier} />
    </Canvas>
  );
}
