"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "../state";

/**
 * PROVISIONAL 3D pouch (see ASSET_GUIDE.md §5). Procedural stand-up pouch
 * (pillow bulge, flat top seal, tear notches, rounded corners). The front
 * carries the ORIGINAL artwork, taken unmodified from the store packshot;
 * it will be replaced by the print file once supplied. The back has no
 * artwork (not available) and is rendered as plain foil, and the rotation is
 * limited so the back is only glimpsed.
 */

export const POUCH_ASPECT = 1005 / 1329; // width / height of the artwork texture

function makeGeometry(seg: number) {
  const W = POUCH_ASPECT;
  const g = new THREE.PlaneGeometry(W, 1, Math.round(44 * seg), Math.round(58 * seg));
  const pos = g.attributes.position as THREE.BufferAttribute;
  const uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const u = uv.getX(i);
    const v = uv.getY(i);
    const bx = Math.pow(Math.sin(Math.PI * u), 0.55);
    const top = 1 - THREE.MathUtils.smoothstep(v, 0.84, 0.93); // flat seal + zip area
    const bottom = THREE.MathUtils.smoothstep(v, 0.0, 0.07);
    const gusset = 1 + 0.45 * Math.pow(1 - v, 3);
    let z = 0.052 * bx * top * bottom * gusset;
    // subtle foil wrinkles
    z += 0.0016 * Math.sin(u * 37 + v * 11) * Math.sin(v * 23) * bx * top;
    pos.setZ(i, z);
    // the bulge pulls the silhouette in slightly at mid-height
    pos.setX(i, pos.getX(i) * (1 - 0.012 * bx * top * bottom));
  }
  g.computeVertexNormals();
  return g;
}

function makeMask() {
  const w = 256;
  const h = Math.round(256 / POUCH_ASPECT);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  const r = 10;
  ctx.beginPath();
  ctx.roundRect(1, 1, w - 2, h - 2, [r, r, 6, 6]);
  ctx.fill();
  // tear notches on both sides
  ctx.fillStyle = "#000";
  const ny = h * 0.085;
  for (const x of [0, w]) {
    ctx.beginPath();
    ctx.arc(x, ny, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

export function Pouch({ segments = 1 }: { segments?: number }) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef(0);
  const art = useLoader(THREE.TextureLoader, "/assets/textures/pouch-front-temp.webp");

  const { front, back, matFront, matBack } = useMemo(() => {
    art.colorSpace = THREE.SRGBColorSpace;
    art.anisotropy = 8;
    const mask = makeMask();
    const front = makeGeometry(segments);
    const back = front.clone();
    back.rotateY(Math.PI);
    const matFront = new THREE.MeshPhysicalMaterial({
      map: art,
      alphaMap: mask,
      alphaTest: 0.5,
      roughness: 0.36,
      metalness: 0.32,
      clearcoat: 0.55,
      clearcoatRoughness: 0.28,
      emissive: new THREE.Color("#ffffff"),
      emissiveMap: art,
      emissiveIntensity: 0.42,
      envMapIntensity: 0.9,
    });
    const matBack = new THREE.MeshPhysicalMaterial({
      color: "#2a1c63",
      alphaMap: mask,
      alphaTest: 0.5,
      roughness: 0.34,
      metalness: 0.62,
      clearcoat: 0.6,
      clearcoatRoughness: 0.3,
      envMapIntensity: 1.1,
    });
    return { front, back, matFront, matBack };
  }, [art, segments]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const P = world.pouch;
    const S = world.stage;
    const ptr = world.pointer;

    // Intro: rise out of the dark
    const ti = world.introStart < 0 ? 0 : Math.min(1, (t - world.introStart) / 2.0);
    const intro = 1 - Math.pow(1 - ti, 4);

    // Weightless tumble in the berry world — a wide swing, never a full turn
    // (the back of the pack has no artwork yet).
    spin.current = P.spin * Math.sin(t * 0.45) * 1.05;

    const float = Math.sin(t * 0.9) * 0.045 * P.h;
    const idleYaw = Math.sin(t * 0.35) * 0.16 * ((S.hero ?? 0) + (S.ritual ?? 0) * 0.4) + Math.sin(t * 0.25) * 0.08 * (S.product ?? 0);
    const hover = world.hover ? 1 : 0;
    const dragYaw = THREE.MathUtils.clamp(world.drag.yaw, -1.25, 1.25) * ((S.product ?? 0) + (S.finale ?? 0) * 0.5);

    g.position.set(P.x, P.y + float - (1 - intro) * 0.6 * P.h, P.z);
    g.scale.setScalar(Math.max(0.0001, P.h * (0.86 + 0.14 * intro) * (1 + hover * 0.02)));
    g.rotation.set(
      P.pitch - ptr.y * (0.12 + hover * 0.08),
      P.yaw + idleYaw + ptr.x * (0.22 + hover * 0.12) + spin.current + dragYaw,
      P.roll + Math.sin(t * 0.6) * 0.02,
    );
    g.visible = intro > 0.001;
  });

  return (
    <group ref={group} visible={false}>
      <mesh geometry={front} material={matFront} />
      <mesh geometry={back} material={matBack} />
    </group>
  );
}
