// Veröffentlicht gerenderte Videos auf den verbundenen Plattformen.
// Das MP4 liegt im privaten Storage-Bucket "renders" (Pfad in videos.video_path).
import { admin } from './supabaseAdmin.js';
import { PLATFORMS } from './social/platforms.js';

const CATEGORY = { history: '27', facts: '27', motivation: '22', horror: '24', reddit: '24', custom: '22' }; // 27 Bildung, 24 Unterhaltung, 22 Menschen & Blogs
const TAGS = {
  history: ['Geschichte', 'History', 'Wissen'], facts: ['Fakten', 'Wissen', 'Facts'], motivation: ['Motivation', 'Mindset'],
  horror: ['Horror', 'Gruselgeschichte', 'Fiktion'], reddit: ['Storytime', 'Geschichte'], custom: [],
};

function describe(video, series) {
  const p = video.project || {};
  const scenes = p.scenes || [];
  const hook = scenes[0]?.text || '';
  const credits = [...new Map(scenes.filter((s) => s.credit).map((s) => [s.credit.url, s.credit])).values()]
    .map((c) => `• ${c.author} / ${c.source}${c.license ? ` (${c.license})` : ''}: ${c.url}`);
  return [
    hook,
    '',
    '#Shorts',
    '',
    'Erstellt mit TrueReel. Sprecherstimme und Skript wurden mit KI erzeugt.',
    credits.length ? `\nBildquellen:\n${credits.join('\n')}` : '',
  ].join('\n').trim();
}

let running = false;

export async function publishVideo(videoId, { userId } = {}) {
  if (!admin) throw new Error('Server nicht vollständig konfiguriert (Supabase).');
  let q = admin.from('videos').select('*').eq('id', videoId);
  if (userId) q = q.eq('user_id', userId);
  const { data: video } = await q.maybeSingle();
  if (!video) throw new Error('Video nicht gefunden.');
  if (!video.video_path) throw new Error('Noch kein exportiertes MP4 gespeichert – bitte zuerst exportieren.');
  const platforms = video.platforms?.length ? video.platforms : [];
  if (!platforms.length) throw new Error('Für diese Serie ist keine Plattform ausgewählt.');
  const { data: series } = video.series_id ? await admin.from('series').select('*').eq('id', video.series_id).maybeSingle() : { data: null };

  const { data: blob, error: dlErr } = await admin.storage.from('renders').download(video.video_path);
  if (dlErr) throw new Error(`Video-Datei nicht gefunden: ${dlErr.message}`);
  const file = Buffer.from(await blob.arrayBuffer());

  const results = { ...(video.post_results || {}) };
  for (const platform of platforms) {
    if (results[platform]?.id) continue; // schon gepostet
    const p = PLATFORMS[platform];
    try {
      const { data: conn } = await admin.from('social_connections').select('*').eq('user_id', video.user_id).eq('platform', platform).maybeSingle();
      if (!conn) throw new Error(`${p?.label || platform} ist nicht verbunden.`);
      if (p.refresh) {
        const upd = await p.refresh(conn);
        if (upd) { Object.assign(conn, upd); await admin.from('social_connections').update({ ...upd, updated_at: new Date().toISOString() }).eq('id', conn.id); }
      }
      const r = await p.publish({
        connection: conn,
        file,
        title: `${video.title} #Shorts`,
        description: describe(video, series),
        tags: TAGS[series?.niche] || [],
        categoryId: CATEGORY[series?.niche] || '22',
      });
      results[platform] = { ...r, at: new Date().toISOString() };
    } catch (e) {
      results[platform] = { error: e.message, at: new Date().toISOString() };
    }
  }
  const ok = platforms.every((pl) => results[pl]?.id);
  await admin.from('videos').update({
    status: ok ? 'posted' : 'failed',
    posted_at: ok ? new Date().toISOString() : null,
    post_results: results,
  }).eq('id', video.id);
  return { ok, results };
}

// Fällige, freigegebene Posts abarbeiten (vom Supabase-Cron oder Intervall aufgerufen)
export async function publishDue() {
  if (!admin || running) return { skipped: true };
  running = true;
  try {
    const { data: due } = await admin.from('videos').select('id').eq('status', 'scheduled')
      .lte('scheduled_at', new Date().toISOString()).not('video_path', 'is', null).limit(10);
    const out = [];
    for (const v of due || []) out.push({ id: v.id, ...(await publishVideo(v.id).catch((e) => ({ ok: false, error: e.message }))) });
    return { processed: out.length, out };
  } finally {
    running = false;
  }
}
