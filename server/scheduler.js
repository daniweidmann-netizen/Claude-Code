// Auto-Posting-Scheduler: veröffentlicht fällige, freigegebene Videos.
// Nur aktiv mit SCHEDULER_ENABLED=true und Supabase. Für Produktion besser als
// eigener Worker / Cron (z. B. Supabase Scheduled Functions) betreiben.
import { admin } from './supabaseAdmin.js';
import { PLATFORMS } from './social/platforms.js';

export function startScheduler() {
  if (!admin || process.env.SCHEDULER_ENABLED !== 'true') return;
  console.log('[scheduler] aktiv – prüft jede Minute fällige Posts');
  setInterval(async () => {
    const { data: due } = await admin.from('videos').select('*').eq('status', 'scheduled').lte('scheduled_at', new Date().toISOString()).limit(20);
    for (const v of due || []) {
      const results = {};
      for (const platform of v.platforms || []) {
        try {
          const { data: conn } = await admin.from('social_connections').select('*').eq('user_id', v.user_id).eq('platform', platform).maybeSingle();
          if (!conn) throw new Error('Plattform nicht verbunden');
          results[platform] = await PLATFORMS[platform].publish({ connection: conn, video: v });
        } catch (e) {
          results[platform] = { error: e.message };
        }
      }
      const failed = Object.values(results).some((r) => r?.error);
      await admin.from('videos').update({
        status: failed ? 'failed' : 'posted',
        posted_at: failed ? null : new Date().toISOString(),
        post_results: results,
      }).eq('id', v.id);
    }
  }, 60_000);
}
