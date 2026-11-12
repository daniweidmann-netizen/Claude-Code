"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "../state";

/** Fine "star dust" rising slowly through the scene, with pointer parallax. */
export function Dust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uPx: { value: 1 }, uOpacity: { value: 0 }, uWarm: { value: 0 }, uBerry: { value: 0 } },
        vertexShader: /* glsl */ `
          attribute float aSeed; uniform float uTime, uPx; varying float vA;
          void main() {
            vec3 p = position;
            float h = 14.0;
            p.y = mod(p.y + uTime * (0.08 + aSeed * 0.18) + 7.0, h) - 7.0;
            p.x += sin(uTime * 0.2 + aSeed * 30.0) * 0.25;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (0.6 + aSeed * 2.4) * uPx * (8.0 / -mv.z);
            vA = (0.25 + aSeed * 0.75) * smoothstep(7.0, 5.0, abs(p.y));
          }`,
        fragmentShader: /* glsl */ `
          uniform float uOpacity, uWarm, uBerry; varying float vA;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.05, d);
            vec3 c = vec3(0.78, 0.71, 0.93);
            c = mix(c, vec3(1.0, 0.72, 0.45), uWarm);
            c = mix(c, vec3(1.0, 0.55, 0.7), uBerry * 0.6);
            gl_FragColor = vec4(c, a * vA * uOpacity);
          }`,
      }),
    [],
  );
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos.set([(Math.random() - 0.5) * 18, (Math.random() - 0.5) * 14, -Math.random() * 14 + 3], i * 3);
      seed[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count]);

  useFrame((state) => {
    const u = mat.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uPx.value = state.viewport.dpr;
    const intro = world.introStart < 0 ? 0 : Math.min(1, (state.clock.elapsedTime - world.introStart) / 3);
    u.uOpacity.value = intro * 0.85;
    u.uWarm.value = world.mood.ritual;
    u.uBerry.value = world.mood.beeren;
    if (ref.current) {
      ref.current.position.x = -world.pointer.x * 0.35;
      ref.current.position.y = -world.pointer.y * 0.2 + window.scrollY * 0.0006;
    }
  });

  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />;
}
