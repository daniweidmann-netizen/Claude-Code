// Zeitplan-Logik für Auto-Posting (lokale Zeitzone des Browsers).
export const DEFAULT_SCHEDULE = { frequency: '1d', times: ['18:00'], days: [1, 3, 5] };

export function normalizeSchedule(s = {}) {
  const sch = { ...DEFAULT_SCHEDULE, ...s };
  if (sch.frequency === '2d' && sch.times.length < 2) sch.times = [sch.times[0] || '12:00', '19:00'];
  if (sch.frequency !== '2d') sch.times = [sch.times[0] || '18:00'];
  return sch;
}

export function slotsForSeries(series, from = new Date(), days = 35) {
  const sch = normalizeSchedule(series.schedule);
  const out = [];
  const d0 = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  for (let i = 0; i < days; i++) {
    const day = new Date(d0);
    day.setDate(d0.getDate() + i);
    if (sch.frequency === '3w' && !sch.days.includes(day.getDay())) continue;
    for (const t of sch.times) {
      const [h, m] = t.split(':').map(Number);
      const slot = new Date(day);
      slot.setHours(h, m, 0, 0);
      if (slot > from) out.push(slot);
    }
  }
  return out;
}

export function nextFreeSlot(series, videos) {
  const taken = new Set(videos.filter((v) => v.series_id === series.id && v.scheduled_at && ['scheduled', 'posted', 'pending_approval'].includes(v.status)).map((v) => new Date(v.scheduled_at).getTime()));
  return slotsForSeries(series, new Date(Date.now() + 5 * 60 * 1000), 120).find((s) => !taken.has(s.getTime())) || null;
}

export const fmtDateTime = (d) => new Date(d).toLocaleString('de-CH', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
