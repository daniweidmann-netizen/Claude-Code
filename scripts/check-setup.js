// Prüft, welche Teile konfiguriert sind und was noch fehlt:  npm run check
import 'dotenv/config';
import { spawnSync } from 'node:child_process';

const has = (k) => !!process.env[k] && !/x{3}$/.test(process.env[k]);
const rows = [
  ['Supabase (Login & Datenbank)', ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']],
  ['Stripe (Zahlungen)', ['STRIPE_SECRET_KEY', 'STRIPE_PRICE_HOBBY_MONTHLY', 'STRIPE_PRICE_DAILY_MONTHLY', 'STRIPE_PRICE_PRO_MONTHLY']],
  ['Stripe-Webhook', ['STRIPE_WEBHOOK_SECRET']],
  ['KI-Skript (Claude)', ['ANTHROPIC_API_KEY']],
  ['Gratis-Stockbilder (Pixabay)', ['PIXABAY_API_KEY']],
  ['KI-Bilder (OpenAI)', ['OPENAI_API_KEY']],
  ['KI-Stimme (ElevenLabs)', ['ELEVENLABS_API_KEY']],
  ['TikTok', ['TIKTOK_CLIENT_KEY', 'TIKTOK_CLIENT_SECRET']],
  ['Instagram (Meta)', ['META_APP_ID', 'META_APP_SECRET']],
  ['YouTube (Google)', ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']],
];
console.log('\nTrueReel – Einrichtungsstatus\n');
for (const [label, keys] of rows) {
  const missing = keys.filter((k) => !has(k));
  console.log(`${missing.length ? '✗' : '✓'} ${label}${missing.length ? `  – fehlt: ${missing.join(', ')}` : ''}`);
}
const ff = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', ['-version']);
console.log(`${ff.status === 0 ? '✓' : '✗'} FFmpeg (MP4-Export)`);
console.log(`\nAktive Module: Skript=${process.env.LLM_PROVIDER || 'mock'}, Bild=${process.env.IMAGE_PROVIDER || 'mock'}, Stimme=${process.env.TTS_PROVIDER || 'mock'}\n`);
