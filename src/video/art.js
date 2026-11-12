// Prozedurale Platzhalter-Grafiken pro Szene (deterministisch per Seed).
// Ersetzt durch echte KI-Bilder, sobald ein Bildmodell (IMAGE_PROVIDER) verbunden ist.
import { VIDEO_W, VIDEO_H } from './project.js';

export const ART_SCALE = 0.66; // Auflösung der Grafik relativ zum Video
export const ART_OVERSCAN = 1.15; // Reserve für Ken-Burns-Zoom

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// [skyTop, skyBottom, sun, far, mid, near, night?]
const PALETTES = {
  realistic: [
    ['#27324d', '#d39a68', '#ffe1b3', '#6d5a6a', '#47394f', '#1f1a26'],
    ['#4d6f93', '#dfe7ec', '#fffbe8', '#8195a6', '#56697a', '#2b3843'],
    ['#0d1428', '#33426b', '#e8ecff', '#283457', '#1b2440', '#0b1020', true],
  ],
  anime: [
    ['#4aa8ff', '#ffd0ea', '#fff7c4', '#93b9ef', '#6b8fda', '#3d58a8'],
    ['#ff8fb1', '#ffe3a3', '#ffffff', '#e88aa8', '#b56391', '#6b3a78'],
    ['#1b1f5e', '#6a4cb3', '#fff4d6', '#4a3d99', '#332a75', '#1a1545', true],
  ],
  comic: [
    ['#ffcf3f', '#ff7b39', '#fff7d6', '#ef476f', '#7b2d8b', '#1b1b1b'],
    ['#3fb8ff', '#b8f2ff', '#ffef5c', '#2a7fd4', '#1b4fa3', '#141414'],
    ['#2d1e5c', '#ff5d73', '#ffe066', '#7a2e8e', '#3e1a60', '#111111', true],
  ],
  manga: [
    ['#f2f2f2', '#c8c8c8', '#ffffff', '#8a8a8a', '#4a4a4a', '#111111'],
    ['#e6e6e6', '#9a9a9a', '#ffffff', '#6e6e6e', '#3a3a3a', '#0d0d0d'],
    ['#2a2a2a', '#6a6a6a', '#f5f5f5', '#4a4a4a', '#262626', '#0a0a0a', true],
  ],
  cinematic: [
    ['#0e2938', '#e0783e', '#ffd49b', '#1f4552', '#14313c', '#071820'],
    ['#091a26', '#2f5d6e', '#f2c48d', '#163845', '#0e2832', '#050f15', true],
    ['#1d2b3a', '#b9653a', '#ffcf8a', '#3d3a44', '#272630', '#0f0f15'],
  ],
  stock: [
    ['#7aa5c9', '#eaf0f3', '#fffdf2', '#8ca59d', '#62806f', '#3b5247'],
    ['#a3b8c9', '#f0e6d8', '#fff8e8', '#9e9a8c', '#76705f', '#4a463a'],
    ['#30455e', '#9fb6c8', '#f4f6f8', '#556b7d', '#3e5163', '#25313d'],
  ],
};

function ridge(ctx, w, h, baseY, amp, r, color, opts = {}) {
  const p1 = r() * 10, p2 = r() * 10, p3 = r() * 10;
  const f1 = 1 + r() * 2, f2 = 3 + r() * 4, f3 = 9 + r() * 8;
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (let x = 0; x <= w; x += w / 120) {
    const u = x / w;
    const y = baseY - amp * (0.55 * Math.sin(u * f1 * Math.PI + p1) + 0.3 * Math.sin(u * f2 * Math.PI + p2) + 0.15 * Math.sin(u * f3 * Math.PI + p3));
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  if (opts.outline) { ctx.lineWidth = opts.outline; ctx.strokeStyle = '#111'; ctx.stroke(); }
  if (opts.rim) { ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.stroke(); }
}

function motif(ctx, kind, w, h, r, color, outline) {
  const base = h * 0.7;
  const cx = w * (0.35 + r() * 0.3);
  const s = w * 0.42;
  ctx.fillStyle = color;
  ctx.beginPath();
  switch (kind) {
    case 'pyramid': {
      const tri = (x, sz) => { ctx.moveTo(x - sz, base); ctx.lineTo(x, base - sz * 0.9); ctx.lineTo(x + sz, base); };
      tri(cx, s * 0.6); tri(cx + s * 0.65, s * 0.38); tri(cx - s * 0.6, s * 0.28);
      break;
    }
    case 'temple': {
      for (let i = 0; i < 6; i++) { const bw = s * (1 - i * 0.14); ctx.rect(cx - bw / 2, base - (i + 1) * s * 0.11, bw, s * 0.11 + 1); }
      ctx.rect(cx - s * 0.1, base - s * 0.85, s * 0.2, s * 0.2);
      break;
    }
    case 'castle': {
      ctx.rect(cx - s * 0.45, base - s * 0.35, s * 0.9, s * 0.35);
      [-0.45, 0.33].forEach((o) => ctx.rect(cx + o * s, base - s * 0.62, s * 0.12, s * 0.62));
      ctx.rect(cx - s * 0.08, base - s * 0.8, s * 0.16, s * 0.8);
      for (let i = 0; i < 9; i++) ctx.rect(cx - s * 0.45 + i * s * 0.1, base - s * 0.4, s * 0.05, s * 0.06);
      ctx.moveTo(cx - s * 0.11, base - s * 0.8); ctx.lineTo(cx, base - s * 0.98); ctx.lineTo(cx + s * 0.11, base - s * 0.8);
      break;
    }
    case 'tower': {
      ctx.rect(cx - s * 0.06, base - s * 0.9, s * 0.12, s * 0.9);
      ctx.moveTo(cx - s * 0.08, base - s * 0.9); ctx.lineTo(cx, base - s * 1.15); ctx.lineTo(cx + s * 0.08, base - s * 0.9);
      for (let i = 0; i < 7; i++) { const bh = s * (0.15 + r() * 0.3); ctx.rect(cx - s * 0.9 + i * s * 0.27, base - bh, s * 0.22, bh); }
      break;
    }
    case 'wall': {
      ctx.rect(0, base - s * 0.22, w, s * 0.22);
      ctx.rect(cx - s * 0.1, base - s * 0.55, s * 0.2, s * 0.55);
      ctx.rect(cx - s * 0.14, base - s * 0.6, s * 0.28, s * 0.08);
      break;
    }
    case 'ship': {
      const y = base - s * 0.05;
      ctx.moveTo(cx - s * 0.5, y - s * 0.12); ctx.lineTo(cx + s * 0.55, y - s * 0.12); ctx.lineTo(cx + s * 0.4, y + s * 0.05); ctx.lineTo(cx - s * 0.4, y + s * 0.05);
      ctx.rect(cx - s * 0.2, y - s * 0.7, s * 0.025, s * 0.6);
      ctx.rect(cx + s * 0.15, y - s * 0.6, s * 0.025, s * 0.5);
      ctx.moveTo(cx - s * 0.18, y - s * 0.65); ctx.lineTo(cx + s * 0.1, y - s * 0.3); ctx.lineTo(cx - s * 0.18, y - s * 0.25);
      ctx.moveTo(cx + s * 0.17, y - s * 0.55); ctx.lineTo(cx + s * 0.4, y - s * 0.28); ctx.lineTo(cx + s * 0.17, y - s * 0.22);
      break;
    }
    case 'field': {
      for (let i = 0; i < 4; i++) {
        const x = cx - s * 0.6 + i * s * 0.35 + r() * s * 0.1, y = base - s * 0.05;
        ctx.ellipse(x, y - s * 0.16, s * 0.08, s * 0.06, 0, 0, Math.PI * 2);
        ctx.rect(x + s * 0.04, y - s * 0.32, s * 0.02, s * 0.16);
        ctx.ellipse(x + s * 0.06, y - s * 0.33, s * 0.025, s * 0.018, 0, 0, Math.PI * 2);
        ctx.rect(x - s * 0.02, y - s * 0.12, s * 0.012, s * 0.12);
        ctx.rect(x + s * 0.02, y - s * 0.12, s * 0.012, s * 0.12);
      }
      break;
    }
    default: { // city
      let x = 0;
      while (x < w) { const bw = s * (0.12 + r() * 0.18), bh = s * (0.2 + r() * 0.7); ctx.rect(x, base - bh, bw, bh + 2); x += bw + s * 0.02; }
    }
  }
  ctx.fill();
  if (outline) { ctx.lineWidth = outline; ctx.strokeStyle = '#111'; ctx.stroke(); }
}

const cache = new Map();

export function renderArt(seed, style = 'cinematic', kind = 'city') {
  const key = `${seed}|${style}|${kind}`;
  if (cache.has(key)) return cache.get(key);
  const w = Math.round(VIDEO_W * ART_SCALE * ART_OVERSCAN);
  const h = Math.round(VIDEO_H * ART_SCALE * ART_OVERSCAN);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const r = rng(seed);
  const pals = PALETTES[style] || PALETTES.cinematic;
  const [top, bottom, sun, far, mid, near, night] = pals[Math.floor(r() * pals.length)];
  const comic = style === 'comic' || style === 'manga', anime = style === 'anime';

  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.75);
  sky.addColorStop(0, top); sky.addColorStop(1, bottom);
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

  if (night) {
    for (let i = 0; i < 160; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.7})`;
      ctx.fillRect(r() * w, r() * h * 0.55, 1 + r() * 2, 1 + r() * 2);
    }
  }
  const sx = w * (0.25 + r() * 0.5), sy = h * (0.3 + r() * 0.18), sr = w * (0.07 + r() * 0.06);
  const glow = ctx.createRadialGradient(sx, sy, sr * 0.5, sx, sy, sr * 5);
  glow.addColorStop(0, sun + 'aa'); glow.addColorStop(1, sun + '00');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
  ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fillStyle = sun; ctx.fill();
  if (comic) { ctx.lineWidth = 6; ctx.strokeStyle = '#111'; ctx.stroke(); }

  // Wolken
  for (let i = 0; i < 6; i++) {
    const cx = r() * w, cy = h * (0.12 + r() * 0.3), cw = w * (0.15 + r() * 0.25);
    ctx.fillStyle = anime ? 'rgba(255,255,255,0.85)' : `rgba(255,255,255,${0.05 + r() * 0.12})`;
    ctx.beginPath();
    if (anime) { for (let j = 0; j < 4; j++) ctx.arc(cx + j * cw * 0.22, cy - (j % 2) * cw * 0.08, cw * 0.16, 0, Math.PI * 2); }
    else ctx.ellipse(cx, cy, cw, cw * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const outline = comic ? 6 : 0;
  ridge(ctx, w, h, h * 0.6, h * 0.06, r, far, { outline, rim: anime });
  motif(ctx, kind, w, h, r, mid, outline);
  if (kind === 'ship') {
    ctx.fillStyle = mid; ctx.fillRect(0, h * 0.7, w, h * 0.3);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    for (let i = 0; i < 40; i++) ctx.fillRect(r() * w, h * (0.71 + r() * 0.2), w * (0.03 + r() * 0.08), 2);
  } else {
    ridge(ctx, w, h, h * 0.74, h * 0.025, r, mid, { outline });
  }
  ridge(ctx, w, h, h * 0.84, h * 0.03, r, near, { outline, rim: anime });

  // Partikel / Vögel
  ctx.strokeStyle = near; ctx.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    const bx = r() * w, by = h * (0.2 + r() * 0.25), bs = w * 0.015;
    ctx.beginPath(); ctx.moveTo(bx - bs, by); ctx.quadraticCurveTo(bx - bs / 2, by - bs * 0.6, bx, by); ctx.quadraticCurveTo(bx + bs / 2, by - bs * 0.6, bx + bs, by); ctx.stroke();
  }

  // Stil-Nachbearbeitung
  if (comic) {
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    const step = 14;
    for (let y = 0; y < h; y += step) for (let x = (y / step) % 2 ? step / 2 : 0; x < w; x += step) {
      ctx.beginPath(); ctx.arc(x, y, 1 + (y / h) * 3, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (style === 'cinematic' || style === 'realistic') {
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data, amt = style === 'cinematic' ? 22 : 12;
    for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * amt; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    ctx.putImageData(img, 0, 0);
  }
  const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.75);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, `rgba(0,0,0,${style === 'cinematic' ? 0.6 : style === 'anime' ? 0.15 : 0.35})`);
  ctx.fillStyle = vig; ctx.fillRect(0, 0, w, h);

  let out = c;
  if (style === 'stock') {
    out = document.createElement('canvas');
    out.width = w; out.height = h;
    const o = out.getContext('2d');
    o.filter = 'blur(3px) saturate(0.9)';
    o.drawImage(c, 0, 0);
  }
  if (cache.size > 40) cache.delete(cache.keys().next().value);
  cache.set(key, out);
  return out;
}
