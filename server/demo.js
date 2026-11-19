// Öffentlicher Test ohne Konto: Hook + Kurz-Skript zu einem Thema (nur Text, keine Bilder/Stimme).
// Schutz gegen Missbrauch: pro IP 5 pro Stunde, insgesamt 400 pro Tag.
import express from 'express';
import { provider } from './providers/index.js';
import { recordEvent } from './analytics.js';

const router = express.Router();
const perIp = new Map(); // ip → [Zeitstempel]
let day = ''; let dayCount = 0;
const LANGS = new Set(['de', 'de-CH', 'en', 'fr', 'it', 'es', 'pt', 'hr', 'sr', 'bs', 'sq', 'tr']);

// Rechte IP aus X-Forwarded-For stammt vom Render-Proxy (die linken Einträge kann der Client fälschen)
const clientIp = (req) => (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',').map((s) => s.trim()).filter(Boolean).at(-1) || 'x';

router.post('/demo/script', express.json({ limit: '2kb' }), async (req, res) => {
  const topic = String(req.body?.topic || '').replace(/\s+/g, ' ').trim();
  if (topic.length < 3 || topic.length > 120) return res.status(400).json({ error: 'Bitte gib ein Thema mit 3 bis 120 Zeichen ein.' });
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) { day = today; dayCount = 0; perIp.clear(); }
  if (dayCount >= 400) return res.status(429).json({ error: 'Der Gratis-Test ist für heute ausgelastet. Erstelle ein Konto, um direkt dein Video zu machen.' });
  const ip = clientIp(req); const now = Date.now();
  const hits = (perIp.get(ip) || []).filter((t) => now - t < 3600e3);
  if (hits.length >= 5) return res.status(429).json({ error: 'Du hast den Test gerade mehrmals genutzt. Erstelle ein Konto, um direkt dein Video zu machen.' });
  perIp.set(ip, [...hits, now]); dayCount++;
  try {
    const lang = LANGS.has(req.body?.language) ? req.body.language : 'de';
    const s = await provider('llm').writeScript({ niche: 'custom', topic, language: lang, targetSeconds: 30 });
    recordEvent('demo', { req, path: '/demo' });
    res.json({ title: s.title, hook: s.hook, scenes: (s.scenes || []).map((x) => x.text).slice(0, 5), cta: s.cta });
  } catch (e) {
    console.error('[demo]', e.message);
    res.status(500).json({ error: 'Das hat gerade nicht geklappt. Versuch es gleich nochmal.' });
  }
});

export default router;
