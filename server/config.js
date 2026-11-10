import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT || 8787),
  appUrl: process.env.APP_URL || 'http://localhost:5173',
  supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  stripeKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  prices: {
    hobby: { monthly: process.env.STRIPE_PRICE_HOBBY_MONTHLY, yearly: process.env.STRIPE_PRICE_HOBBY_YEARLY },
    daily: { monthly: process.env.STRIPE_PRICE_DAILY_MONTHLY, yearly: process.env.STRIPE_PRICE_DAILY_YEARLY },
    pro: { monthly: process.env.STRIPE_PRICE_PRO_MONTHLY, yearly: process.env.STRIPE_PRICE_PRO_YEARLY },
  },
  providers: {
    llm: process.env.LLM_PROVIDER || 'mock',
    image: process.env.IMAGE_PROVIDER || 'mock',
    tts: process.env.TTS_PROVIDER || 'mock',
    render: process.env.RENDER_PROVIDER || 'ffmpeg',
  },
  ffmpegPath: process.env.FFMPEG_PATH || 'ffmpeg',
};

const isPlaceholder = (v) => !v || /x{3}$/.test(v);
export const stripeEnabled = () => !isPlaceholder(config.stripeKey);
export const supabaseEnabled = () => !!(config.supabaseUrl && config.supabaseServiceKey);

// Preis-ID → { plan, interval } (für Webhooks)
export function planFromPrice(priceId) {
  for (const [plan, p] of Object.entries(config.prices)) {
    if (p.monthly === priceId) return { plan, interval: 'monthly' };
    if (p.yearly === priceId) return { plan, interval: 'yearly' };
  }
  return null;
}
