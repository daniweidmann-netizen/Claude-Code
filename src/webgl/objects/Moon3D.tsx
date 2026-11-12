"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "../state";

/**
 * The crescent from the pouch artwork as a glowing shader disc. It accompanies
 * the pouch: top-right behind it in the hero, centred behind it in the finale
 * ("eclipse" moment), high and small elsewhere.
 */
export function Moon3D() {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uOpacity: { value: 0 }, uTime: { value: 0 } },
        vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: /* glsl */ `
          uniform float uOpacity, uTime; varying vec2 vUv;
          void main() {
            vec2 p = vUv * 2.0 - 1.0;
            float r = 0.42;
            float d1 = length(p) - r;
            float d2 = length(p - vec2(0.2, 0.16)) - r * 0.9;
            float moon = smoothstep(0.012, -0.004, max(d1, -d2));
            float halo = exp(-max(length(p) - r, 0.0) * 5.5) * 0.35 + exp(-length(p) * 2.2) * 0.12;
            vec3 col = mix(vec3(0.80, 0.75, 0.95), vec3(0.95, 0.93, 0.90), smoothstep(-0.4, 0.4, p.x - p.y)) * 0.82;
            float a = moon + halo * (0.85 + 0.15 * sin(uTime * 0.7));
            gl_FragColor = vec4(col * a, a * uOpacity);
          }`,
      }),
    [],
  );

  useFrame((state, dt) => {
    const P = world.pouch;
    const s = world.stage;
    const k = 1 - Math.exp(-dt * 4);
    // Hero: upper right behind pouch. Finale: centred behind. Elsewhere: above.
    const tx = P.x + P.h * (0.55 * (s.hero ?? 0) - 0.62 * (s.product ?? 0) + 0.7 * (s.berries ?? 0) + 0.95 * (s.ritual ?? 0));
    const ty = P.y + P.h * (0.55 * (s.hero ?? 0) + 0.12 * (s.finale ?? 0) + 0.5 * (s.product ?? 0) + 0.6 * (s.berries ?? 0) + 0.3 * (s.ritual ?? 0));
    const size = P.h * (1.0 * (s.hero ?? 0) + 2.1 * (s.finale ?? 0) + 0.9 * ((s.product ?? 0) + (s.berries ?? 0) + (s.ritual ?? 0)));
    const m = ref.current;
    if (!m) return;
    m.position.x += (tx - m.position.x) * k;
    m.position.y += (ty - m.position.y) * k;
    m.position.z = -3;
    const sc = m.scale.x + (size * 1.35 - m.scale.x) * k;
    m.scale.setScalar(Math.max(0.01, sc));
    const intro = world.introStart < 0 ? 0 : Math.min(1, (state.clock.elapsedTime - world.introStart) / 1.6);
    mat.uniforms.uOpacity.value = intro * (1 - world.mood.beeren * 0.8);
    mat.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={ref} material={mat} renderOrder={-5}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}
