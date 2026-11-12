"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "../state";

/**
 * Product reveal set: a polished dark stone plinth that slowly turns beneath
 * the pouch, and a fine halo of light that opens behind it as the chapter
 * enters. In the finale only the halo remains (the "eclipse").
 */
export function ProductStage() {
  const plinth = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);

  const { stone, rim, haloMat } = useMemo(() => {
    const stone = new THREE.MeshPhysicalMaterial({ color: "#14112a", roughness: 0.14, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.4 });
    const rim = new THREE.MeshStandardMaterial({ color: "#c8b6ee", emissive: new THREE.Color("#c8b6ee"), emissiveIntensity: 1.6, roughness: 0.4 });
    const haloMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uOpacity: { value: 0 }, uTime: { value: 0 } },
      vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: /* glsl */ `
        uniform float uOpacity, uTime; varying vec2 vUv;
        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          float r = length(p);
          float ring = exp(-pow((r - 0.78) * 38.0, 2.0)) * 0.9 + exp(-pow((r - 0.78) * 7.0, 2.0)) * 0.25;
          float ang = atan(p.y, p.x);
          float shimmer = 0.75 + 0.25 * sin(ang * 3.0 + uTime * 0.6);
          vec3 col = mix(vec3(0.55, 0.45, 0.95), vec3(0.95, 0.92, 1.0), ring);
          gl_FragColor = vec4(col * ring * shimmer, ring * uOpacity);
        }`,
    });
    return { stone, rim, haloMat };
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const P = world.pouch;
    const prod = world.stage.product ?? 0;
    const fin = world.stage.finale ?? 0;
    const k = 1 - Math.exp(-dt * 5);
    const p = plinth.current;
    if (p) {
      const s = Math.max(0.0001, P.h * prod);
      p.position.set(P.x, P.y - P.h * 0.63, P.z);
      p.scale.setScalar(p.scale.x + (s - p.scale.x) * k);
      p.rotation.y = t * 0.15;
      p.visible = p.scale.x > 0.01;
    }
    const h = halo.current;
    if (h) {
      const w = Math.max(prod, fin * 0.7);
      h.position.set(P.x, P.y + P.h * 0.04, P.z - P.h * 0.45);
      const s = Math.max(0.0001, P.h * (0.72 + 0.22 * w));
      h.scale.setScalar(h.scale.x + (s - h.scale.x) * k);
      haloMat.uniforms.uOpacity.value = w;
      haloMat.uniforms.uTime.value = t;
      h.visible = w > 0.01;
    }
  });

  return (
    <>
      <group ref={plinth} visible={false}>
        <mesh material={stone} position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.62, 0.66, 0.1, 96]} />
        </mesh>
        <mesh material={rim} position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.62, 0.0035, 8, 128]} />
        </mesh>
      </group>
      <mesh ref={halo} material={haloMat} visible={false} renderOrder={-4}>
        <planeGeometry args={[1.6, 1.6]} />
      </mesh>
    </>
  );
}
