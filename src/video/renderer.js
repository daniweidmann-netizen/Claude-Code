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

// Echtes Produktfoto: nichts abschneiden – unscharfer, abgedunkelter Hintergrund + ganzes Foto mit sanftem Zoom
function drawProduct(ctx, src, W, H, p, zoom) {
  const sw = src.naturalWidth || src.width, sh = src.naturalHeight || src.height;
  ctx.save();
  if ('filter' in ctx) ctx.filter = 'blur(36px) brightness(0.55)';
  drawCover(ctx, src, W, H, 1.15, 0, 0);
  ctx.restore();
  if (!('filter' in ctx)) { ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(0, 0, W, H); }
  // Hochformat-Fotos füllen das Bild fast ganz, Querformat bleibt vollständig sichtbar
  const scale = Math.min(W / sw, (H * 0.78) / sh) * zoom;
  const dw = sw * scale, dh = sh * scale;
  const y = (H - dh) / 2 - H * 0.06 - 0.02 * H * p;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 40;
  ctx.drawImage(src, (W - dw) / 2, y, dw, dh);
  ctx.restore();
}

function drawScene(ctx, project, item, t, W, H, getImage) {
  const s = item.scene;
  const local = t - item.start;
  const p = Math.min(1, Math.max(0, local / item.duration));
  const dir = s.seed % 4;
  // Mehr Bewegung: stärkerer Zoom; erste Szene startet mit einem schnellen „Punch-in“
  let zoom = (dir % 2 ? 1.0 + 0.12 * p : 1.12 - 0.12 * p);
  if (item.index === 0) zoom = 1.18 - 0.18 * Math.min(1, local / 0.6) ** 0.5 + 0.10 * p;
  // Lange Szenen: in der Mitte ein Schnitt auf einen engeren Bildausschnitt (wirkt wie ein zweiter Kamerawinkel)
  if (item.duration > 4.2 && p > 0.5) zoom *= 1.22;
  const pan = (dir < 2 ? 1 : -1) * 0.03 * (p - 0.5) + (item.duration > 4.2 && p > 0.5 ? (dir % 2 ? 0.04 : -0.04) : 0);
  const img = getImage?.(s);
  if (img && s.productPhoto) drawProduct(ctx, img, W, H, p, item.index === 0 ? zoom : 1 + 0.08 * p);
  else if (img) drawCover(ctx, img, W, H, zoom, pan, 0);
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

// Grosser Titel in den ersten Sekunden – damit Zuschauer sofort wissen, worum es geht
const TITLE_SECONDS = 2.8;
function drawTitleCard(ctx, project, tl, t, W, H) {
  const text = String(project.hookTitle || project.title || '').trim();
  if (!text || t > TITLE_SECONDS) return;
  const k = W / VIDEO_W;
  const appear = Math.min(1, t / 0.22);
  const fade = t > TITLE_SECONDS - 0.35 ? (TITLE_SECONDS - t) / 0.35 : 1;
  const sc = 0.86 + 0.14 * (1 - (1 - appear) ** 3);
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, appear, fade));
  ctx.font = `900 ${Math.round(86 * k)}px Inter, sans-serif`;
  const words = text.split(/\s+/).map((w) => ({ text: w }));
  const lines = wrap(ctx, words, W * 0.8).map((l) => l.map((w) => w.text).join(' ')).slice(0, 4);
  const lh = 100 * k; const padX = 34 * k; const padY = 22 * k;
  const blockH = lines.length * lh + padY * 2;
  const cy = H * 0.3;
  ctx.translate(W / 2, cy); ctx.scale(sc, sc); ctx.translate(-W / 2, -cy);
  const maxW = Math.max(...lines.map((l) => ctx.measureText(l).width));
  ctx.fillStyle = '#cbef3f';
  roundRect(ctx, W / 2 - maxW / 2 - padX, cy - blockH / 2, maxW + padX * 2, blockH, 28 * k);
  ctx.fill();
  ctx.fillStyle = '#14171f'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  lines.forEach((l, i) => ctx.fillText(l, W / 2, cy - blockH / 2 + padY + lh * (i + 0.5)));
  ctx.restore();
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
  if (project.titleCard !== false) drawTitleCard(ctx, project, tl, t, W, H);

  if (watermark) {
    const k = W / VIDEO_W;
    ctx.font = `700 ${Math.round(34 * k)}px Inter, sans-serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fillText('Made with TrueReel', W - 36 * k, H - 60 * k);
  }
}
