import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { config, stripeEnabled, supabaseEnabled } from './config.js';
import { authenticate, getProfile, admin } from './supabaseAdmin.js';
import { provider, providerStatus, providerDiagnose } from './providers/index.js';
import { ffmpegAvailable, transcodeToMp4 } from './providers/render.js';
import stripeRouter, { webhookHandler } from './stripe.js';
import socialRouter from './social/router.js';
import { startScheduler } from './scheduler.js';
import { PLAN_QUOTAS } from './quotas.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Stripe-Webhook braucht den Roh-Body → vor express.json() registrieren
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), webhookHandler);

app.use(cors({ origin: config.appUrl }));
app.use(express.json({ limit: '2mb' }));

let hasFfmpeg = false;
ffmpegAvailable().then((ok) => { hasFfmpeg = ok; });

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    providers: providerStatus(),
    providerDiagnose: providerDiagnose(),
    render: hasFfmpeg ? 'ffmpeg' : 'browser-only',
    stripe: stripeEnabled(),
    supabase: supabaseEnabled(),
    // Nur Format-Diagnose, niemals Werte ausgeben
    stripeWebhookSecret: !config.stripeWebhookSecret ? 'fehlt'
      : config.stripeWebhookSecret !== config.stripeWebhookSecret.trim() ? 'enthaelt-leerzeichen'
      : /^whsec_[A-Za-z0-9]{20,}$/.test(config.stripeWebhookSecret) ? 'ok-format' : 'falsches-format',
    stripeKeyMode: config.stripeKey.startsWith('sk_test_') ? 'test' : config.stripeKey.startsWith('sk_live_') ? 'live' : 'unbekannt',
  });
});

// ── Kontingent prüfen (nur mit Supabase) ────────────────
async function checkQuota(req, res, next) {
  if (!admin) return next();
  const profile = await getProfile(req.user.id);
  const plan = profile?.plan || 'free';
  const quota = PLAN_QUOTAS[plan];
  const since = plan === 'free' ? new Date(0) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const { count } = await admin.from('videos').select('id', { count: 'exact', head: true }).eq('user_id', req.user.id).gte('created_at', since.toISOString());
  if ((count ?? 0) >= quota) {
    return res.status(402).json({ error: plan === 'free' ? 'Dein Gratis-Video ist aufgebraucht. Wähle einen Plan, um weiterzumachen.' : 'Monatliches Video-Kontingent erreicht.' });
  }
  next();
}

const handle = (fn) => async (req, res) => {
  try { res.json(await fn(req)); } catch (e) { console.error(e); res.status(500).json({ error: e.message || 'Fehler bei der Generierung' }); }
};

// ── KI-Pipeline ─────────────────────────────────────────
app.post('/api/generate/series', authenticate, handle(async (req) => ({ ...(await provider('llm').planSeries(req.body)), provider: provider('llm').name })));
app.post('/api/generate/script', authenticate, checkQuota, handle(async (req) => ({ ...(await provider('llm').writeScript(req.body)), provider: provider('llm').name })));
app.post('/api/generate/script/preview', authenticate, handle(async (req) => ({ ...(await provider('llm').writeScript(req.body)), provider: provider('llm').name })));
app.post('/api/generate/image', authenticate, handle(async (req) => ({ ...(await provider('image').generate(req.body)), provider: provider('image').name })));
app.post('/api/generate/voice', authenticate, handle(async (req) => {
  const text = String(req.body?.text || '').slice(0, 1200);
  return { ...(await provider('tts').synthesize({ ...req.body, text })), provider: provider('tts').name };
}));

// ── Rendering: Browser-Aufnahme → MP4 ───────────────────
const upload = multer({ dest: path.join(os.tmpdir(), 'truereel-uploads'), limits: { fileSize: 300 * 1024 * 1024 } });
app.post('/api/render/mp4', authenticate, upload.single('video'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Keine Datei' });
  if (!hasFfmpeg) { fs.rm(req.file.path, () => {}); return res.status(501).json({ error: 'FFmpeg ist auf dem Server nicht installiert.' }); }
  const out = `${req.file.path}.mp4`;
  try {
    await transcodeToMp4(req.file.path, out);
    res.setHeader('Content-Type', 'video/mp4');
    res.sendFile(out, () => { fs.rm(out, () => {}); fs.rm(req.file.path, () => {}); });
  } catch (e) {
    console.error(e);
    fs.rm(req.file.path, () => {});
    res.status(500).json({ error: 'MP4-Umwandlung fehlgeschlagen' });
  }
});

app.use('/api/stripe', stripeRouter);
app.use('/api/social', socialRouter);

// Konto löschen (DSGVO Art. 17 / DSG Art. 32)
app.delete('/api/account', authenticate, async (req, res) => {
  if (!admin) return res.json({ ok: true, demo: true });
  // Dateien im Speicher (Bilder, Audio) zuerst entfernen – sie hängen nicht per FK am Nutzer.
  // Schlägt das fehl, wird das Konto NICHT gelöscht (sonst blieben Dateien unbemerkt zurück).
  let removed = 0;
  try {
    for (const folder of ['images', 'audio', 'music']) {
      const prefix = `${req.user.id}/${folder}`;
      for (;;) {
        const { data: files, error: listErr } = await admin.storage.from('media').list(prefix, { limit: 100 });
        if (listErr) throw new Error(`Liste ${prefix}: ${listErr.message}`);
        if (!files?.length) break;
        const { data: gone, error: rmErr } = await admin.storage.from('media').remove(files.map((f) => `${prefix}/${f.name}`));
        if (rmErr) throw new Error(`Löschen ${prefix}: ${rmErr.message}`);
        if (!gone?.length) throw new Error(`Löschen ${prefix}: keine Datei entfernt`);
        removed += gone.length;
      }
    }
  } catch (e) {
    console.error('[account] Dateien konnten nicht gelöscht werden:', e.message);
    return res.status(500).json({ error: 'Deine Dateien konnten nicht gelöscht werden. Bitte versuche es erneut oder kontaktiere den Support.', detail: e.message });
  }
  const { error } = await admin.auth.admin.deleteUser(req.user.id); // Kaskadiert über FK auf alle Tabellen
  if (error) return res.status(500).json({ error: 'Löschen fehlgeschlagen' });
  res.json({ ok: true, filesRemoved: removed });
});

// Produktion: gebautes Frontend ausliefern
const dist = path.join(__dirname, '..', 'dist');
if (fs.existsSync(dist)) {
  // Öffentliche Laufzeit-Konfiguration ins HTML einsetzen (nur öffentliche Werte!)
  const publicConfig = JSON.stringify({ supabaseUrl: config.supabaseUrl, supabaseAnonKey: config.supabaseAnonKey }).replace(/</g, '\\u003c');
  const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
    .replace('<head>', `<head><script>window.__TRUEREEL_CONFIG__=${publicConfig}</script>`);
  const sendIndex = (_req, res) => res.type('html').send(html);
  app.get('/', sendIndex);
  app.use(express.static(dist, { index: false, maxAge: '1h' }));
  app.get(/^\/(?!api\/).*/, sendIndex);
}

app.listen(config.port, () => {
  console.log(`[TrueReel API] http://localhost:${config.port}  providers=${JSON.stringify(providerStatus())}  stripe=${stripeEnabled()}  supabase=${supabaseEnabled()}`);
  startScheduler();
});
