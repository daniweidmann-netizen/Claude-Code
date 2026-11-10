// Zeichnet einen Frame des Videos (Szene + Ken Burns + Übergang + Untertitel).
import { VIDEO_W, VIDEO_H, sceneAt, wordTimings } from './project.js';
import { renderArt, ART_OVERSCAN } from './art.js';

const FADE = 0.35;

function drawCover(ctx, src, W, H, zoom, panX, panY) {
  const sw = src.naturalWidth || src.width, sh = src.naturalHeight || src.height;
  const scale = Math.max(W / sw, H / sh) * zoom;
  const dw = sw * scale, dh = sh * scale;
  ctx.drawImage(src, (W - dw) / 2 + panX * W, (H - dh) / 2 + panY * H, dw, dh);
}

function drawScene(ctx, project, item, t, W, H, getImage) {
  const s = item.scene;
  const p = Math.min(1, Math.max(0, (t - item.start) / item.duration));
  const dir = s.seed % 4;
  const zoom = (dir % 2 ? 1.0 + 0.08 * p : 1.08 - 0.08 * p);
  const pan = (dir < 2 ? 1 : -1) * 0.02 * (p - 0.5);
  const img = getImage?.(s);
  if (img) drawCover(ctx, img, W, H, zoom, pan, 0);
  else {
    const art = renderArt(s.seed, project.artStyle, project.motif);
    drawCover(ctx, art, W, H, (zoom / ART_OVERSCAN) * 1.15, pan, 0);
  }
}

function chunkWords(timings, maxChars = 20) {
  const chunks = [];
  let cur = [];
  let len = 0;
  timings.forEach((w) => {
    if (cur.length && (len + w.word.length > maxChars || cur.length >= 4)) { chunks.push(cur); cur = []; len = 0; }
    cur.push(w); len += w.word.length + 1;
    if (/[.!?,:;]$/.test(w.word) && len > 8) { chunks.push(cur); cur = []; len = 0; }
  });
  if (cur.length) chunks.push(cur);
  return chunks;
}

function wrap(ctx, words, maxW) {
  const lines = [[]];
  words.forEach((w) => {
    const line = lines.at(-1);
    const test = [...line.map((x) => x.text), w.text].join(' ');
    if (line.length && ctx.measureText(test).width > maxW) lines.push([w]); else line.push(w);
  });
  return lines;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function drawCaptions(ctx, project, item, t, W, H) {
  const c = project.captions;
  const k = W / VIDEO_W;
  const timings = wordTimings(item.scene.text, item.start, item.duration);
  if (!timings.length) return;
  const activeIdx = Math.max(0, timings.findIndex((w) => t >= w.start && t < w.end) === -1
    ? (t < timings[0].start ? 0 : timings.length - 1)
    : timings.findIndex((w) => t >= w.start && t < w.end));
  const style = c.style;
  const sizeFactor = (style === 'minimal' ? 0.62 : style === 'box' ? 0.78 : 1) * (c.size || 1);
  const fontPx = Math.round(78 * k * sizeFactor);
  const weight = style === 'minimal' ? 600 : 800;
  ctx.font = `${weight} ${fontPx}px "${c.font}", Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const centerY = { top: 0.2, middle: 0.5, bottom: 0.72 }[c.position] * H;
  const fmt = (s) => (c.uppercase ? s.toUpperCase() : s);

  let words;
  if (style === 'box') words = timings.map((w, i) => ({ text: fmt(w.word), i }));
  else {
    const chunks = chunkWords(timings);
    let ci = 0, count = 0;
    for (let j = 0; j < chunks.length; j++) { if (activeIdx < count + chunks[j].length) { ci = j; break; } count += chunks[j].length; }
    let offset = 0;
    for (let j = 0; j < ci; j++) offset += chunks[j].length;
    words = chunks[ci].map((w, i) => ({ text: fmt(w.word), i: offset + i }));
    if (style === 'pop') words = words.filter((w) => w.i <= activeIdx);
  }

  const maxW = W * 0.84;
  const lines = wrap(ctx, words, maxW);
  const lh = fontPx * 1.22;
  const startY = centerY - ((lines.length - 1) * lh) / 2;

  if (style === 'box') {
    const widest = Math.max(...lines.map((l) => ctx.measureText(l.map((w) => w.text).join(' ')).width));
    const pad = 28 * k;
    ctx.fillStyle = 'rgba(8,12,28,0.68)';
    roundRect(ctx, W / 2 - widest / 2 - pad, startY - lh / 2 - pad * 0.6, widest + pad * 2, lines.length * lh + pad * 1.2, 22 * k);
    ctx.fill();
  }

  lines.forEach((line, li) => {
    const y = startY + li * lh;
    const space = ctx.measureText(' ').width;
    const widths = line.map((w) => ctx.measureText(w.text).width);
    const total = widths.reduce((a, b) => a + b, 0) + space * (line.length - 1);
    let x = W / 2 - total / 2;
    line.forEach((w, wi) => {
      const cx = x + widths[wi] / 2;
      const active = w.i === activeIdx;
      ctx.save();
      ctx.translate(cx, y);
      if (style === 'pop' && active) {
        const ws = timings[w.i];
        const p = Math.min(1, (t - ws.start) / 0.12);
        const sc = 0.7 + 0.45 * p - 0.15 * Math.max(0, p - 0.7) / 0.3;
        ctx.scale(sc, sc);
      }
      if (style !== 'minimal' && style !== 'box') {
        ctx.lineJoin = 'round';
        ctx.lineWidth = fontPx * 0.16;
        ctx.strokeStyle = 'rgba(0,0,0,0.9)';
        ctx.strokeText(w.text, 0, 0);
      } else {
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 12 * k;
      }
      const highlight = (style === 'karaoke' || style === 'pop' || style === 'box') && active;
      ctx.fillStyle = highlight ? c.highlight : c.color;
      ctx.fillText(w.text, 0, 0);
      ctx.restore();
      x += widths[wi] + space;
    });
  });
}

export function drawFrame(ctx, project, tl, t, { W = VIDEO_W, H = VIDEO_H, getImage, watermark = false } = {}) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  if (!tl.items.length) return;
  const item = sceneAt(tl, Math.min(t, tl.total - 0.001));
  drawScene(ctx, project, item, t, W, H, getImage);
  const idx = tl.items.indexOf(item);
  if (idx > 0 && t - item.start < FADE) {
    ctx.save();
    ctx.globalAlpha = 1 - (t - item.start) / FADE;
    drawScene(ctx, project, tl.items[idx - 1], t, W, H, getImage);
    ctx.restore();
  }
  // leichter Verlauf unten für Lesbarkeit
  const g = ctx.createLinearGradient(0, H * 0.55, 0, H);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.35)');
  ctx.fillStyle = g;
  ctx.fillRect(0, H * 0.55, W, H * 0.45);

  drawCaptions(ctx, project, item, t, W, H);

  if (watermark) {
    const k = W / VIDEO_W;
    ctx.font = `700 ${Math.round(34 * k)}px Inter, sans-serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fillText('Made with TrueReel', W - 36 * k, H - 60 * k);
  }
}
