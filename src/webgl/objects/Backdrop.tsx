"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MOODS, world } from "../state";

/** Full-screen gradient sky whose colours blend between chapter moods. */
const PALETTE: Record<string, { top: string; bottom: string; glow: string }> = {
  nacht: { top: "#1f1366", bottom: "#05060f", glow: "#5744d3" },
  beeren: { top: "#3a0c30", bottom: "#07040c", glow: "#a3214f" },
  produkt: { top: "#24195a", bottom: "#0a0c26", glow: "#7b62e0" },
  ritual: { top: "#160f2c", bottom: "#05060f", glow: "#e3a260" },
  finale: { top: "#1b1158", bottom: "#05060f", glow: "#c8b6ee" },
};
const C = Object.fromEntries(
  Object.entries(PALETTE).map(([k, v]) => [k, { top: new THREE.Color(v.top), bottom: new THREE.Color(v.bottom), glow: new THREE.Color(v.glow) }]),
);

const scratch = new THREE.Color();

export function Backdrop() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTop: { value: new THREE.Color() },
          uBottom: { value: new THREE.Color() },
          uGlow: { value: new THREE.Color() },
          uGlowPos: { value: new THREE.Vector2(0.3, 0.1) },
          uAspect: { value: 1 },
          uTime: { value: 0 },
          uIntro: { value: 0 },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = vec4(position.xy, 1.0, 1.0); }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uTop, uBottom, uGlow;
          uniform vec2 uGlowPos;
          uniform float uAspect, uTime, uIntro;
          varying vec2 vUv;
          float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
          void main() {
            vec2 ndc = vUv * 2.0 - 1.0;
            float g = smoothstep(-1.1, 1.2, ndc.y + 0.15 * ndc.x);
            vec3 col = mix(uBottom, uTop, g);
            vec2 d = ndc - uGlowPos; d.x *= uAspect;
            float glow = exp(-dot(d, d) * 1.8) * 0.38 * uIntro;
            col += uGlow * glow;
            // soft vignette + dithering against banding
            float v = smoothstep(1.7, 0.35, length(ndc * vec2(0.85, 1.0)));
            col *= mix(0.55, 1.0, v);
            col += (hash(vUv * 1000.0 + uTime) - 0.5) / 255.0;
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  );

  useFrame((state, dt) => {
    const u = mat.uniforms;
    (u.uTop.value as THREE.Color).setRGB(0, 0, 0);
    (u.uBottom.value as THREE.Color).setRGB(0, 0, 0);
    (u.uGlow.value as THREE.Color).setRGB(0, 0, 0);
    for (const m of MOODS) {
      const w = world.mood[m];
      (u.uTop.value as THREE.Color).add(scratch.copy(C[m].top).multiplyScalar(w));
      (u.uBottom.value as THREE.Color).add(scratch.copy(C[m].bottom).multiplyScalar(w));
      (u.uGlow.value as THREE.Color).add(scratch.copy(C[m].glow).multiplyScalar(w));
    }
    const gp = u.uGlowPos.value as THREE.Vector2;
    gp.x += (world.pouchNdc.x - gp.x) * Math.min(1, dt * 3);
    gp.y += (world.pouchNdc.y - gp.y) * Math.min(1, dt * 3);
    u.uAspect.value = state.size.width / state.size.height;
    u.uTime.value = state.clock.elapsedTime % 100;
    const intro = world.introStart < 0 ? 0 : Math.min(1, (state.clock.elapsedTime - world.introStart) / 2.2);
    u.uIntro.value = intro;
  });

  return (
    <mesh renderOrder={-10} frustumCulled={false} material={mat}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}
