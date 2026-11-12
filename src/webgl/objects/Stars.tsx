"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "../state";

/** Far star shell with per-star twinkle; rotates gently with scroll. */
export function Stars({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const { geo, mat } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const r = 40 + Math.random() * 20;
      const s = Math.sqrt(1 - u * u);
      pos.set([r * s * Math.cos(th), r * u * 0.7 + 6, -Math.abs(r * s * Math.sin(th)) - 10], i * 3);
      seed[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPx: { value: 1 }, uOpacity: { value: 0 } },
      vertexShader: /* glsl */ `
        attribute float aSeed; uniform float uTime, uPx; varying float vA; varying float vS;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          float big = step(0.93, aSeed);
          gl_PointSize = (1.2 + big * 2.2) * uPx;
          vA = (0.35 + 0.65 * aSeed) * (0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 1.8) + aSeed * 40.0));
          vS = big;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uOpacity; varying float vA; varying float vS;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d);
          vec3 c = mix(vec3(0.78, 0.71, 0.93), vec3(0.98, 0.96, 0.92), vS);
          gl_FragColor = vec4(c, a * vA * uOpacity);
        }`,
    });
    return { geo, mat };
  }, [count]);

  useFrame((state) => {
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uPx.value = state.viewport.dpr;
    const intro = world.introStart < 0 ? 0 : Math.min(1, (state.clock.elapsedTime - world.introStart) / 2.5);
    mat.uniforms.uOpacity.value = intro * (1 - world.mood.beeren * 0.5);
    if (ref.current) {
      ref.current.rotation.y = window.scrollY * 0.00004 + world.pointer.x * 0.02;
      ref.current.rotation.x = world.pointer.y * 0.01;
    }
  });

  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />;
}
