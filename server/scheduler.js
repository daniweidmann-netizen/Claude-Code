// Auto-Posting: Fällige, freigegebene Videos werden veröffentlicht.
// - Supabase pg_cron ruft alle 10 Min. POST /api/cron/publish auf (weckt auch den schlafenden Gratis-Server)
// - zusätzlich prüft der Server selbst jede Minute, solange er wach ist
import { admin } from './supabaseAdmin.js';
import { publishDue } from './publish.js';
import { sendReminders } from './reminders.js';
import { sendOnboardingMails } from './onboardingMails.js';

export function startScheduler() {
  if (!admin || process.env.SCHEDULER_ENABLED === 'false') return;
  console.log('[scheduler] aktiv – prüft jede Minute fällige Posts');
  setInterval(() => publishDue().catch((e) => console.error('[scheduler]', e.message)), 60_000);
  setInterval(() => sendReminders().catch((e) => console.error('[reminder]', e.message)), 10 * 60_000);
  setInterval(() => sendOnboardingMails().catch((e) => console.error('[onboarding-mail]', e.message)), 10 * 60_000);
}
