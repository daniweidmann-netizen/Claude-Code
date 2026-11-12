// Cookie-freie Besucherstatistik.
// - Kein Cookie, kein localStorage, keine Drittanbieter.
// - Besucher-Erkennung nur innerhalb eines Tages über HMAC(Tagesschlüssel, IP + Browserkennung).
//   Die IP-Adresse wird nie gespeichert.
import crypto from 'node:crypto';
import express from 'express';
import { admin, authenticate, getProfile } from './supabaseAdmin.js';

const router = express.Router();
const SECRET = process.env.ANALYTICS_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || crypto.randomBytes(32).toString('hex');
const OWN_HOSTS = /(^|\.)truereel\.ch$|onrender\.com$|^localhost$/;
const BOTS = /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|lighthouse|pingdom|uptime|monitor|curl|wget|python|node-fetch|axios/i;
const TYPES = new Set(['pageview', 'signup', 'checkout']);

const today = () => new Date().toISOString().slice(0, 10);
const clip = (v, n = 120) => (v == null ? null : String(v).slice(0, n));

function visitorHash(req) {
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const ua = req.headers['user-agent'] || '';
  const dayKey = crypto.createHmac('sha256', SECRET).update(`analytics:${today()}`).digest();
  return crypto.createHmac('sha256', dayKey).update(`${ip}|${ua}`).digest('base64url').slice(0, 16);
}

function device(ua = '') {
  if (/ipad|tablet/i.test(ua)) return 'tablet';
  if (/mobi|iphone|android/i.test(ua)) return 'mobile';
  return 'desktop';
}

function refHost(ref) {
  try {
    const h = new URL(ref).hostname.replace(/^www\./, '');
    return OWN_HOSTS.test(h) ? null : h;
  } catch { return null; }
}

// IDs aus Pfaden entfernen, damit gleiche Seiten zusammengezählt werden
const normPath = (p) => clip(String(p || '/').split('?')[0].replace(/\/[0-9a-f-]{16,}/gi, '/:id'), 200);

export async function recordEvent(type, { req, path, value } = {}) {
  if (!admin) return;
  const row = { type, path: normPath(path), value: value ?? null };
  if (req) Object.assign(row, { visitor: visitorHash(req), device: device(req.headers['user-agent']) });
  await admin.from('analytics_events').insert(row).then(() => {}, () => {});
}

// Browser meldet Seitenaufrufe (sendBeacon / fetch keepalive)
router.post('/track', express.json({ limit: '4kb' }), async (req, res) => {
  res.status(204).end();
  if (!admin || BOTS.test(req.headers['user-agent'] || '') || req.headers['dnt'] === '1') return;
  const b = req.body || {};
  const type = TYPES.has(b.type) ? b.type : 'pageview';
  await admin.from('analytics_events').insert({
    type,
    path: normPath(b.path),
    referrer: refHost(b.referrer),
    utm_source: clip(b.utm_source, 60),
    utm_medium: clip(b.utm_medium, 60),
    utm_campaign: clip(b.utm_campaign, 80),
    device: device(req.headers['user-agent']),
    lang: clip(b.lang, 5),
    visitor: visitorHash(req),
  }).then(() => {}, () => {});
});

// Auswertung – nur für Admins (profiles.is_admin)
router.get('/stats', authenticate, async (req, res) => {
  if (!admin) return res.json({ demo: true });
  const profile = await getProfile(req.user.id);
  if (!profile?.is_admin) return res.status(403).json({ error: 'Kein Zugriff' });
  const days = Math.min(Math.max(Number(req.query.days) || 30, 1), 365);
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const rows = [];
  for (let from = 0; from < 200000; from += 1000) {
    const { data, error } = await admin.from('analytics_events')
      .select('created_at,type,path,referrer,utm_source,device,visitor,value')
      .gte('created_at', since).order('created_at', { ascending: true }).range(from, from + 999);
    if (error) return res.status(500).json({ error: error.message });
    rows.push(...data);
    if (data.length < 1000) break;
  }
  const views = rows.filter((r) => r.type === 'pageview');
  const visitorsOf = (list) => new Set(list.map((r) => `${r.created_at.slice(0, 10)}:${r.visitor}`)).size;
  const count = (list, key) => Object.entries(list.reduce((m, r) => { const k = r[key] || '(direkt)'; m[k] = (m[k] || 0) + 1; return m; }, {}))
    .sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, n]) => ({ name, n }));
  const byDay = {};
  for (let i = days - 1; i >= 0; i--) byDay[new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)] = { views: 0, visitors: new Set(), signups: 0, purchases: 0 };
  for (const r of rows) {
    const d = byDay[r.created_at.slice(0, 10)]; if (!d) continue;
    if (r.type === 'pageview') { d.views++; d.visitors.add(r.visitor); }
    if (r.type === 'signup') d.signups++;
    if (r.type === 'purchase') d.purchases++;
  }
  const sources = views.map((r) => ({ ...r, src: r.utm_source || r.referrer }));
  const signups = rows.filter((r) => r.type === 'signup').length;
  const purchases = rows.filter((r) => r.type === 'purchase');
  const visitors = visitorsOf(views);
  res.json({
    days,
    totals: {
      visitors, pageviews: views.length, signups,
      checkouts: rows.filter((r) => r.type === 'checkout').length,
      purchases: purchases.length,
      revenue: purchases.reduce((s, r) => s + Number(r.value || 0), 0),
      signupRate: visitors ? signups / visitors : 0,
    },
    daily: Object.entries(byDay).map(([date, d]) => ({ date, views: d.views, visitors: d.visitors.size, signups: d.signups, purchases: d.purchases })),
    pages: count(views, 'path'),
    sources: count(sources, 'src'),
    devices: count(views, 'device'),
  });
});

export default router;
