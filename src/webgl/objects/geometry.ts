import * as THREE from "three";
import { mergeGeometries, mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

/**
 * Procedural, PROVISIONAL models for the four berries on the pack and the
 * gummy (shape/colour matched to the store photo). Replace with scanned/
 * modelled GLBs when available (ASSET_GUIDE.md §5).
 */

export type BerryKind = "strawberry" | "raspberry" | "blackberry" | "blueberry";
export type Part = { geometry: THREE.BufferGeometry; material: THREE.Material };

const rand = (() => {
  let s = 1234567;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
})();

function drupeletBerry(n: number, size: number, stretch: number, seg: number) {
  const parts: THREE.BufferGeometry[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 1.85; // leave the stem opening at the top free
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = i * golden;
    const p = new THREE.Vector3(Math.cos(th) * r, y * stretch, Math.sin(th) * r).multiplyScalar(0.82);
    // narrow towards the tip (bottom)
    const taper = 1 - 0.18 * Math.max(0, -y);
    p.x *= taper;
    p.z *= taper;
    const g = new THREE.SphereGeometry(size * (0.9 + rand() * 0.25), Math.max(6, Math.round(10 * seg)), Math.max(4, Math.round(8 * seg)));
    g.translate(p.x, p.y, p.z);
    parts.push(g);
  }
  return mergeGeometries(parts)!;
}

export function makeBerry(kind: BerryKind, seg = 1): Part[] {
  if (kind === "raspberry") {
    return [
      { geometry: drupeletBerry(Math.round(78 * seg + 20), 0.21, 1.08, seg), material: MAT.raspberry },
      { geometry: new THREE.SphereGeometry(0.8, 16, 12).scale(1, 1.05, 1), material: MAT.raspberryCore },
    ];
  }
  if (kind === "blackberry") {
    return [
      { geometry: drupeletBerry(Math.round(90 * seg + 20), 0.2, 1.22, seg), material: MAT.blackberry },
      { geometry: new THREE.SphereGeometry(0.78, 16, 12).scale(1, 1.2, 1), material: MAT.blackberryCore },
    ];
  }
  if (kind === "blueberry") {
    const g = new THREE.SphereGeometry(1, Math.round(40 * seg), Math.round(28 * seg));
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const rr = Math.sqrt(x * x + z * z);
      let ny = y * 0.82;
      if (y > 0.6) ny -= Math.exp(-rr * rr * 18) * 0.22; // crown dimple
      pos.setY(i, ny);
    }
    g.computeVertexNormals();
    const crown: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 5; i++) {
      const c = new THREE.ConeGeometry(0.07, 0.2, 5);
      c.rotateZ(Math.PI / 2 + 0.5);
      c.translate(0.13, 0.66, 0);
      c.rotateY((i / 5) * Math.PI * 2);
      crown.push(c);
    }
    return [
      { geometry: g, material: MAT.blueberry },
      { geometry: mergeGeometries(crown)!, material: MAT.blueberryCrown },
    ];
  }
  // strawberry
  const pts = [
    [0, -1.15], [0.18, -1.05], [0.42, -0.72], [0.66, -0.3], [0.8, 0.08], [0.82, 0.32], [0.7, 0.55], [0.42, 0.68], [0.14, 0.7], [0, 0.66],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const body = new THREE.LatheGeometry(new THREE.SplineCurve(pts).getPoints(Math.round(40 * seg)), Math.round(48 * seg));
  body.deleteAttribute("uv");
  const merged = mergeVertices(body);
  merged.computeVertexNormals();
  // vertex colour: deep red at the tip, slightly paler shoulders
  const colors: number[] = [];
  const cp = merged.attributes.position as THREE.BufferAttribute;
  const deep = new THREE.Color("#b3081e");
  const pale = new THREE.Color("#e8463f");
  for (let i = 0; i < cp.count; i++) {
    const t = THREE.MathUtils.smoothstep(cp.getY(i), 0.1, 0.65);
    const c = deep.clone().lerp(pale, t * 0.6);
    colors.push(c.r, c.g, c.b);
  }
  merged.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const seeds: THREE.BufferGeometry[] = [];
  const nSeeds = Math.round(90 * seg + 20);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const curve = new THREE.SplineCurve(pts);
  for (let i = 0; i < nSeeds; i++) {
    const t = 0.06 + (i / nSeeds) * 0.62;
    const p = curve.getPoint(t);
    const th = i * golden;
    const s = new THREE.SphereGeometry(0.028, 5, 4).scale(0.7, 1.4, 0.7);
    s.translate(Math.cos(th) * p.x * 1.005, p.y, Math.sin(th) * p.x * 1.005);
    seeds.push(s);
  }
  const leaves: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 8; i++) {
    const l = new THREE.SphereGeometry(1, 10, 6).scale(0.34, 0.025, 0.11);
    l.translate(0.3, 0, 0);
    l.rotateZ(-0.35 - rand() * 0.25);
    l.translate(0.04, 0.68, 0);
    l.rotateY((i / 8) * Math.PI * 2 + rand() * 0.3);
    leaves.push(l);
  }
  const stem = new THREE.CylinderGeometry(0.035, 0.05, 0.3, 8);
  stem.translate(0, 0.84, 0);
  leaves.push(stem);
  return [
    { geometry: merged, material: MAT.strawberry },
    { geometry: mergeGeometries(seeds)!, material: MAT.seed },
    { geometry: mergeGeometries(leaves)!, material: MAT.leaf },
  ];
}

export function makeGummyGeometry(seg = 1) {
  const profile = [
    [0, -0.5], [0.44, -0.5], [0.5, -0.46], [0.52, -0.3], [0.5, 0.05], [0.46, 0.3], [0.4, 0.44], [0.3, 0.5], [0.12, 0.52], [0, 0.5],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(new THREE.SplineCurve(profile).getPoints(Math.round(28 * seg)), Math.round(72 * seg));
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const r = Math.sqrt(x * x + z * z);
    const th = Math.atan2(z, x);
    const f = 1 + 0.085 * Math.cos(8 * th) * Math.min(1, r / 0.25);
    pos.setX(i, x * f);
    pos.setZ(i, z * f);
  }
  g.deleteAttribute("uv");
  const m = mergeVertices(g);
  m.computeVertexNormals();
  return m;
}

export function makeGummyMaterial(transmission: boolean) {
  return transmission
    ? new THREE.MeshPhysicalMaterial({
        color: "#9c1a43",
        transmission: 0.82,
        thickness: 0.9,
        roughness: 0.16,
        ior: 1.42,
        attenuationColor: new THREE.Color("#5a0820"),
        attenuationDistance: 0.55,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        envMapIntensity: 1.2,
      })
    : new THREE.MeshPhysicalMaterial({
        color: "#5e0c27",
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        sheen: 0.6,
        sheenColor: new THREE.Color("#ff4d7a"),
        emissive: new THREE.Color("#3a0616"),
        emissiveIntensity: 0.7,
        envMapIntensity: 1.3,
      });
}

const MAT = {
  strawberry: new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.18, envMapIntensity: 1.1 }),
  seed: new THREE.MeshStandardMaterial({ color: "#e7c25a", roughness: 0.5 }),
  leaf: new THREE.MeshStandardMaterial({ color: "#3d7a30", roughness: 0.62, side: THREE.DoubleSide }),
  raspberry: new THREE.MeshPhysicalMaterial({ color: "#c8204c", roughness: 0.36, clearcoat: 0.5, clearcoatRoughness: 0.3, sheen: 0.7, sheenColor: new THREE.Color("#ff9ab8"), envMapIntensity: 1 }),
  raspberryCore: new THREE.MeshStandardMaterial({ color: "#6e0c28", roughness: 0.6 }),
  blackberry: new THREE.MeshPhysicalMaterial({ color: "#26102a", roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.6 }),
  blackberryCore: new THREE.MeshStandardMaterial({ color: "#0d050f", roughness: 0.5 }),
  blueberry: new THREE.MeshPhysicalMaterial({ color: "#2f3d7e", roughness: 0.55, sheen: 1, sheenColor: new THREE.Color("#a7b4ee"), sheenRoughness: 0.55, envMapIntensity: 0.9 }),
  blueberryCrown: new THREE.MeshStandardMaterial({ color: "#1b1d3a", roughness: 0.7 }),
};
