"use client";

import { Bloom, DepthOfField, EffectComposer, Vignette } from "@react-three/postprocessing";
import { TIER } from "../quality";
import type { Tier } from "../state";

export function Effects({ tier }: { tier: Tier }) {
  const q = TIER[tier];
  if (!q.post) return null;
  return (
    <EffectComposer multisampling={tier === 3 ? 4 : 0} enableNormalPass={false}>
      {q.dof ? <DepthOfField worldFocusDistance={10} worldFocusRange={5} bokehScale={2.6} /> : <></>}
      <Bloom mipmapBlur intensity={0.55} luminanceThreshold={0.72} luminanceSmoothing={0.2} />
      <Vignette offset={0.32} darkness={0.55} />
    </EffectComposer>
  );
}
