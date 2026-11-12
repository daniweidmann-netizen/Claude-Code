"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { world } from "../state";

/** Moon key light, violet rim, product light sweep and the single warm ritual lamp. */
export function Lights() {
  const key = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const sweep = useRef<THREE.PointLight>(null);
  const ember = useRef<THREE.PointLight>(null);
  const berry = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const intro = world.introStart < 0 ? 0 : Math.min(1, (t - world.introStart) / 2.2);
    const S = world.stage;
    const P = world.pouch;
    if (key.current) {
      key.current.intensity = 2.4 * intro;
      key.current.position.set(P.x - 4 + world.pointer.x * 2, P.y + 5 + world.pointer.y * 1.5, 6);
      key.current.target.position.set(P.x, P.y, P.z);
      key.current.target.updateMatrixWorld();
    }
    if (rim.current) rim.current.intensity = (2.6 + (S.product ?? 0) * 2.5 + (S.finale ?? 0) * 3) * intro;
    if (sweep.current) {
      const w = (S.product ?? 0) + (S.finale ?? 0) * 0.6;
      sweep.current.intensity = 14 * w * intro;
      sweep.current.position.set(P.x + Math.sin(t * 0.55) * P.h * 1.4, P.y + P.h * 0.4, P.z + 2.2);
    }
    if (ember.current) {
      ember.current.intensity = 26 * world.mood.ritual * intro;
      ember.current.position.set(P.x - P.h * 1.3, P.y - P.h * 0.2, P.z + 1.6);
    }
    if (berry.current) {
      berry.current.intensity = 30 * world.mood.beeren * intro;
    }
  });

  return (
    <>
      <ambientLight intensity={0.22} color="#b9a8f0" />
      <directionalLight ref={key} color="#e4dafc" intensity={0} />
      <directionalLight ref={rim} color="#7b62e0" position={[4, 2, -6]} intensity={0} />
      <pointLight ref={sweep} color="#f2eee9" intensity={0} distance={12} decay={2} />
      <pointLight ref={ember} color="#e3a260" intensity={0} distance={10} decay={2} />
      <pointLight ref={berry} color="#ff5a8a" position={[0, 2, 2]} intensity={0} distance={18} decay={2} />
      {/* Procedural studio for foil & gummy reflections — no HDR download */}
      <Environment resolution={128} frames={1}>
        <color attach="background" args={["#07081a"]} />
        <Lightformer form="rect" intensity={2.2} color="#d9cdf7" position={[-3, 4, 4]} scale={[6, 1.4, 1]} rotation={[0.4, 0.6, 0]} />
        <Lightformer form="rect" intensity={3} color="#7b62e0" position={[4, 1, -3]} scale={[1.2, 8, 1]} rotation={[0, -1.2, 0]} />
        <Lightformer form="ring" intensity={1.6} color="#c8b6ee" position={[0, 3, 6]} scale={2.4} />
        <Lightformer form="rect" intensity={0.8} color="#e3a260" position={[-5, -2, 2]} scale={[2, 2, 1]} rotation={[0, 1, 0]} />
      </Environment>
    </>
  );
}
