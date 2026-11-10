import { getPlan, FREE_PLAN } from '../config/plans.js';

// Zählt "verbrauchte" Videos: jedes erzeugte Video-Projekt in der aktuellen Periode.
export function periodStart(profile) {
  const d = new Date();
  if (profile?.current_period_end) {
    const end = new Date(profile.current_period_end);
    const start = new Date(end);
    start.setMonth(start.getMonth() - (profile.billing_interval === 'yearly' ? 12 : 1));
    // Bei Jahresabo trotzdem monatliches Kontingent
    if (profile.billing_interval === 'yearly') return new Date(d.getFullYear(), d.getMonth(), 1);
    return start;
  }
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function computeUsage(profile, videos) {
  const plan = getPlan(profile?.plan);
  if (plan.id === FREE_PLAN.id) {
    const used = Math.max(profile?.free_videos_used || 0, videos.length);
    return { plan, used, limit: 1, remaining: Math.max(0, 1 - used), label: 'Gratis-Test' };
  }
  const start = periodStart(profile);
  const used = videos.filter((v) => new Date(v.created_at) >= start).length;
  return { plan, used, limit: plan.videosPerMonth, remaining: Math.max(0, plan.videosPerMonth - used), label: 'diesen Monat' };
}

export function seriesLimitReached(profile, seriesCount) {
  return seriesCount >= getPlan(profile?.plan).limits.series;
}
