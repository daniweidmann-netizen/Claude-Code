// Datenzugriff für Serien & Videos. Supabase, wenn konfiguriert – sonst localStorage (Demo).
import { supabase, DEMO_MODE } from './supabase.js';

const LS = { series: 'tr-demo-series', videos: 'tr-demo-videos' };
const read = (k) => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } };
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
export const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36));
const now = () => new Date().toISOString();

async function sbList(table, userId, extra) {
  let q = supabase.from(table).select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (extra) q = extra(q);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

async function sbUpsert(table, row) {
  const { data, error } = await supabase.from(table).upsert(row).select().single();
  if (error) throw error;
  return data;
}

function lsUpsert(key, row) {
  const all = read(key);
  const i = all.findIndex((r) => r.id === row.id);
  if (i >= 0) all[i] = row; else all.unshift(row);
  write(key, all);
  return row;
}

// ── Serien ─────────────────────────────────────────────
export async function listSeries(userId) {
  if (DEMO_MODE) return read(LS.series).filter((s) => s.user_id === userId);
  return sbList('series', userId);
}

export async function getSeries(id) {
  if (DEMO_MODE) return read(LS.series).find((s) => s.id === id) || null;
  const { data, error } = await supabase.from('series').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveSeries(series) {
  const row = { ...series, id: series.id || uid(), created_at: series.created_at || now(), updated_at: now() };
  return DEMO_MODE ? lsUpsert(LS.series, row) : sbUpsert('series', row);
}

export async function deleteSeries(id) {
  if (DEMO_MODE) {
    write(LS.series, read(LS.series).filter((s) => s.id !== id));
    write(LS.videos, read(LS.videos).filter((v) => v.series_id !== id));
    return;
  }
  const { error } = await supabase.from('series').delete().eq('id', id);
  if (error) throw error;
}

// ── Videos ─────────────────────────────────────────────
// status: draft | ready (gerendert) | pending_approval | scheduled | posted | failed
export async function listVideos(userId, seriesId) {
  if (DEMO_MODE) return read(LS.videos).filter((v) => v.user_id === userId && (!seriesId || v.series_id === seriesId));
  return sbList('videos', userId, seriesId ? (q) => q.eq('series_id', seriesId) : undefined);
}

export async function getVideo(id) {
  if (DEMO_MODE) return read(LS.videos).find((v) => v.id === id) || null;
  const { data, error } = await supabase.from('videos').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveVideo(video) {
  const row = { ...video, id: video.id || uid(), created_at: video.created_at || now(), updated_at: now() };
  return DEMO_MODE ? lsUpsert(LS.videos, row) : sbUpsert('videos', row);
}

export async function deleteVideo(id) {
  if (DEMO_MODE) { write(LS.videos, read(LS.videos).filter((v) => v.id !== id)); return; }
  const { error } = await supabase.from('videos').delete().eq('id', id);
  if (error) throw error;
}

export function clearDemoData() {
  Object.values(LS).forEach((k) => localStorage.removeItem(k));
  localStorage.removeItem('tr-demo-profile');
  localStorage.removeItem('tr-demo-connections');
}
