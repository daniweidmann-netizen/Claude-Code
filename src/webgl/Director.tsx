"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MOODS, world } from "./state";

/**
 * The Director reads the DOM layout every frame and turns it into a camera-
 * independent "pose" for the pouch: each chapter exposes an anchor element
 * (data-stage="…"). The pouch travels from anchor to anchor while scrolling,
 * holding still while an anchor is near the viewport centre. Because poses are
 * derived from real DOM rects, the choreography follows the responsive layout
 * on every device.
 */

type Pose = { x: number; y: number; z: number; h: number; yaw: number; pitch: number; roll: number; spin: number; visible: number };

const STAGE_POSE: Record<string, Omit<Pose, "x" | "y" | "h">> = {
  hero: { z: 0, yaw: 0.38, pitch: 0.04, roll: -0.07, spin: 0, visible: 1 },
  berries: { z: -1.5, yaw: 0, pitch: 0.25, roll: 0.35, spin: 1, visible: 1 },
  product: { z: 0, yaw: -0.12, pitch: 0, roll: 0, spin: 0, visible: 1 },
  ritual: { z: -0.5, yaw: -0.42, pitch: 0.02, roll: 0.02, spin: 0, visible: 1 },
  finale: { z: 0, yaw: 0, pitch: 0, roll: 0, spin: 0, visible: 1 },
};

const tmp = { a: {} as Pose, b: {} as Pose };
const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const lerp = THREE.MathUtils.lerp;

export function Director() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  useFrame((_, dt) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const dist = camera.position.z;
    const H = 2 * dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const W = H * (vw / vh);

    // ── Pointer smoothing
    const p = world.pointer;
    const k = 1 - Math.exp(-dt * 4);
    p.x += (p.tx - p.x) * k;
    p.y += (p.ty - p.y) * k;

    // ── Drag inertia (product stage)
    const d = world.drag;
    if (!d.active) {
      d.yaw += d.vel;
      d.vel *= Math.exp(-dt * 3.2);
      d.yaw *= Math.exp(-dt * 0.6); // drift back to front-facing
    }

    // ── Stage anchors → poses
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-stage]"));
    const poses: { name: string; d: number; pose: Pose }[] = [];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      const name = el.dataset.stage!;
      const fit = Number(el.dataset.stageFit ?? 0.8);
      const base = STAGE_POSE[name] ?? STAGE_POSE.hero;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const depthScale = (dist - base.z) / dist; // keep apparent size when pushed back
      poses.push({
        name,
        d: cy - vh / 2,
        pose: {
          ...base,
          x: (cx / vw - 0.5) * W * depthScale,
          y: -(cy / vh - 0.5) * H * depthScale,
          h: Math.min((r.height / vh) * H * fit, ((r.width / vw) * W * fit) / 0.756) * depthScale,
        },
      });
    }
    if (!poses.length) return;

    let a = poses[0];
    let b = poses[0];
    let t = 0;
    if (poses[0].d >= 0) {
      a = b = poses[0];
    } else if (poses[poses.length - 1].d <= 0) {
      a = b = poses[poses.length - 1];
    } else {
      for (let i = 0; i < poses.length - 1; i++) {
        if (poses[i].d <= 0 && poses[i + 1].d > 0) {
          a = poses[i];
          b = poses[i + 1];
          t = -a.d / (b.d - a.d);
          break;
        }
      }
    }
    // Hold near each anchor, travel in between
    const e = smooth(0.18, 0.82, t);
    Object.assign(tmp.a, a.pose);
    Object.assign(tmp.b, b.pose);
    const target = world.pouch;
    const kp = 1 - Math.exp(-dt * 6);
    (Object.keys(target) as (keyof Pose)[]).forEach((key) => {
      const v = lerp(tmp.a[key], tmp.b[key], e);
      target[key] = lerp(target[key], v, kp);
    });
    for (const s of Object.keys(world.stage)) world.stage[s] = 0;
    world.stage[a.name] = (world.stage[a.name] ?? 0) + (1 - e);
    world.stage[b.name] = (world.stage[b.name] ?? 0) + e;

    // Hover: pointer over the active anchor
    const active = e < 0.5 ? a : b;
    const activeEl = els.find((el) => el.dataset.stage === active.name);
    if (activeEl) {
      const r = activeEl.getBoundingClientRect();
      const px = ((p.tx + 1) / 2) * vw;
      const py = ((1 - p.ty) / 2) * vh;
      world.hover = px > r.left && px < r.right && py > r.top && py < r.bottom;
    }

    // ── Moods: share of the viewport each section occupies
    let sum = 0;
    const m = world.mood;
    for (const id of MOODS) {
      const el = document.getElementById(id);
      let v = 0;
      if (el) {
        const r = el.getBoundingClientRect();
        v = Math.max(0, Math.min(vh, r.bottom) - Math.max(0, r.top)) / vh;
      }
      m[id] = lerp(m[id], v, kp);
      sum += m[id];
    }
    if (sum > 0) for (const id of MOODS) m[id] /= sum;

    // ── Berry chapter progress through viewport
    const be = document.getElementById("beeren");
    if (be) {
      const r = be.getBoundingClientRect();
      world.berries = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh)));
    }

    // NDC of pouch for backdrop glow
    world.pouchNdc.x = target.x / (W / 2);
    world.pouchNdc.y = target.y / (H / 2);
  }, -1);

  return null;
}
