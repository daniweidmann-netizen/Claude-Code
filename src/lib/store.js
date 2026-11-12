import { translate as tr } from '../i18n/index.jsx';
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

// Neue Zeilen per INSERT, bestehende per UPDATE (kein Upsert: der löst die
// Kontingent-Trigger der Datenbank auch beim reinen Bearbeiten aus).
async function sbSave(table, row, isNew) {
  const q = isNew
    ? supabase.from(table).insert(row)
    : supabase.from(table).update(row).eq('id', row.id);
  const { data, error } = await q.select().single();
  if (error) throw new Error(error.message);
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
  return DEMO_MODE ? lsUpsert(LS.series, row) : sbSave('series', row, !series.id);
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
// Listen laden ohne das (grosse) Projekt-JSON – das braucht nur der Editor (getVideo).
const VIDEO_LIST_COLUMNS = 'id,user_id,series_id,title,episode_key,status,platforms,scheduled_at,posted_at,created_at,updated_at,video_path';

export async function listVideos(userId, seriesId, { full = false } = {}) {
  if (DEMO_MODE) return read(LS.videos).filter((v) => v.user_id === userId && (!seriesId || v.series_id === seriesId));
  let q = supabase.from('videos').select(full ? '*' : VIDEO_LIST_COLUMNS).eq('user_id', userId).order('created_at', { ascending: false });
  if (seriesId) q = q.eq('series_id', seriesId);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function getVideo(id) {
  if (DEMO_MODE) return read(LS.videos).find((v) => v.id === id) || null;
  const { data, error } = await supabase.from('videos').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveVideo(video) {
  const row = { ...video, id: video.id || uid(), created_at: video.created_at || now(), updated_at: now() };
  return DEMO_MODE ? lsUpsert(LS.videos, row) : sbSave('videos', row, !video.id);
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

// Bild/Audio (Data-URL) in Supabase Storage ablegen und öffentliche URL zurückgeben.
// Im Demo-Modus bleibt es bei der Data-URL.
export async function uploadMedia(userId, dataUrl, kind = 'images') {
  if (DEMO_MODE || !dataUrl?.startsWith('data:')) return dataUrl;
  const blob = await (await fetch(dataUrl)).blob();
  const ext = { 'image/png': 'png', 'image/webp': 'webp', 'audio/mpeg': 'mp3', 'audio/wav': 'wav' }[blob.type] || 'jpg';
  const path = `${userId}/${kind}/${uid()}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(path, blob, { contentType: blob.type, cacheControl: '31536000' });
  if (error) { console.warn('Upload fehlgeschlagen, nutze Data-URL', error.message); return dataUrl; }
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
}

// Gespeichertes MP4 herunterladen: zeitlich begrenzter Link (10 Min.) auf die private Datei
export async function renderDownloadUrl(path, filename) {
  if (DEMO_MODE || !path) return null;
  const { data, error } = await supabase.storage.from('renders').createSignedUrl(path, 600, { download: filename || true });
  if (error) throw new Error(error.message);
  return data.signedUrl;
}

// Exportiertes MP4 für das Auto-Posting im privaten Bucket "renders" ablegen
export async function uploadRender(userId, videoId, blob) {
  if (DEMO_MODE) return null;
  const path = `${userId}/${videoId}.mp4`;
  const { error } = await supabase.storage.from('renders').upload(path, blob, { contentType: 'video/mp4', upsert: true });
  if (error) throw new Error(`${tr('Video konnte nicht gespeichert werden:')} ${error.message}`);
  return path;
}
