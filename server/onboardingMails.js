// Einführungs-Mails nach der Registrierung (Tag 1, 3 und 6) – hilfreich statt Werbung, mit Abmelde-Link.
// Jede Mail hat ein Zeitfenster; wer es verpasst (z. B. ältere Konten), bekommt sie nicht nachträglich.
import { admin } from './supabaseAdmin.js';
import { config } from './config.js';
import { sendMail, unsubUrl, esc } from './reminders.js';

const APP = () => config.appUrl || 'https://truereel.ch';
const STEPS = [
  { step: 1, from: 1, to: 3 },
  { step: 2, from: 3, to: 5 },
  { step: 3, from: 6, to: 8, freeOnly: true },
];

const MAILS = {
  de: {
    1: { subject: 'So postest du dein TrueReel-Video richtig', button: 'Zu meinen Videos', path: '/app', paras: [
      'damit dein Video auch gesehen wird, hier die wichtigsten Punkte – in 1 Minute gelesen:',
      '• Exportiere in TrueReel mit „Exportieren 1080p“ – dann sind Titel, Schnitte und Untertitel drin.',
      '• Schalte beim Posten das Label „KI-generiert“ ein (TikTok: „Weitere Optionen“, Instagram: „Erweiterte Einstellungen“).',
      '• Poste am besten zwischen 18 und 21 Uhr und stelle in der Beschreibung eine Frage – Kommentare helfen der Reichweite.',
      '• Bleib bei einem Thema: Wer 2–3 Wochen regelmässig zum gleichen Thema postet, wächst deutlich schneller als mit wechselnden Themen.',
    ] },
    2: { subject: '3 Hook-Tricks, damit die Leute dranbleiben', button: 'Neues Video erstellen', path: '/app', paras: [
      'die ersten 2 Sekunden entscheiden, ob jemand weiterschaut. Drei Tricks, die TrueReel schon nutzt – und die du im Editor selbst anpassen kannst:',
      '1. Neugier statt Auflösung: „Darüber spricht kaum jemand …“ und die Pointe erst am Schluss.',
      '2. Konkret statt allgemein: „Dieses Tier hat das Weltall überlebt“ statt „Spannende Fakten über Tiere“.',
      '3. Grosser Titel am Anfang: Viele schauen ohne Ton – der Titel im ersten Bild sagt sofort, worum es geht.',
      'Tipp: Im Editor kannst du den Hook-Text ändern und nur diese Szene neu sprechen lassen.',
    ] },
    3: { subject: 'Mehr Videos mit weniger Aufwand', button: 'Pläne ansehen', path: '/app/account#plaene', paras: [
      'regelmässig posten ist das Wichtigste für Wachstum – und genau dafür ist TrueReel gebaut:',
      '• Hobby ($24/Monat): 3 Videos pro Woche, ohne Wasserzeichen.',
      '• Daily ($49/Monat): jeden Tag ein Video, bis zu 3 Serien.',
      '• Pro ($89/Monat): 2 Videos pro Tag, eigene Musik und Fotos.',
      'Alle Pläne sind monatlich kündbar, mit einem Klick im Konto. Wenn du Fragen hast, antworte einfach auf diese Mail.',
    ] },
  },
  en: {
    1: { subject: 'How to post your TrueReel video the right way', button: 'Go to my videos', path: '/app', paras: [
      'to make sure your video gets seen, here are the key points – a 1-minute read:',
      '• Export in TrueReel with “Export 1080p” – that includes the title, cuts and captions.',
      '• Turn on the “AI-generated” label when posting (TikTok: “More options”, Instagram: “Advanced settings”).',
      '• Post between 6 and 9 pm and ask a question in the caption – comments help your reach.',
      '• Stick to one topic: posting regularly on the same topic for 2–3 weeks grows much faster than switching topics.',
    ] },
    2: { subject: '3 hook tricks that keep people watching', button: 'Create a new video', path: '/app', paras: [
      'the first 2 seconds decide whether someone keeps watching. Three tricks TrueReel already uses – and you can tweak them in the editor:',
      '1. Curiosity instead of the answer: “Hardly anyone talks about this …” and the payoff at the end.',
      '2. Specific instead of generic: “This animal survived outer space” instead of “Interesting animal facts”.',
      '3. A big title at the start: many people watch without sound – the title tells them instantly what it is about.',
      'Tip: in the editor you can change the hook text and re-voice just that scene.',
    ] },
    3: { subject: 'More videos, less effort', button: 'See plans', path: '/app/account#plaene', paras: [
      'posting regularly is the most important thing for growth – and that is exactly what TrueReel is built for:',
      '• Hobby ($24/month): 3 videos per week, no watermark.',
      '• Daily ($49/month): one video every day, up to 3 series.',
      '• Pro ($89/month): 2 videos per day, your own music and photos.',
      'All plans can be cancelled monthly with one click in your account. Questions? Just reply to this email.',
    ] },
  },
};

function render(lang, step, { name, uid }) {
  const m = MAILS[lang][step];
  const hello = lang === 'en' ? (name ? `Hi ${name},` : 'Hi,') : (name ? `Hallo ${name},` : 'Hallo,');
  const footer = lang === 'en' ? 'You are getting three short tips after signing up. No more emails like this:' : 'Du bekommst nach der Registrierung drei kurze Tipps. Keine weiteren Mails dieser Art:';
  const unsub = lang === 'en' ? 'unsubscribe' : 'abmelden';
  const link = `${APP()}${m.path}`;
  const html = `<!doctype html><html><body style="margin:0;background:#f4f5f7;font-family:Inter,Arial,sans-serif;color:#14171f">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:520px;background:#fff;border-radius:16px" cellpadding="0" cellspacing="0">
<tr><td style="padding:28px 28px 8px"><img src="${APP()}/logo-email.png" alt="TrueReel" height="32" style="height:32px"></td></tr>
<tr><td style="padding:8px 28px;font-size:16px;line-height:1.6"><p>${esc(hello)}</p>${m.paras.map((p) => `<p style="margin:0 0 10px">${esc(p)}</p>`).join('')}
<p style="padding:8px 0 4px"><a href="${link}" style="display:inline-block;background:#cbef3f;color:#14171f;text-decoration:none;font-weight:700;padding:14px 26px;border-radius:999px">${esc(m.button)}</a></p>
<p>${lang === 'en' ? 'Daniel from TrueReel' : 'Daniel von TrueReel'}</p></td></tr>
<tr><td style="padding:16px 28px 28px;font-size:12px;line-height:1.6;color:#6b717d">${esc(footer)} <a href="${unsubUrl(uid)}" style="color:#6b717d">${esc(unsub)}</a><br>Truereel · Chriesiweg 4 · 8310 Grafstal · Schweiz</td></tr>
</table></td></tr></table></body></html>`;
  const text = `${hello}\n\n${m.paras.join('\n')}\n\n${m.button}: ${link}\n\n${lang === 'en' ? 'Daniel from TrueReel' : 'Daniel von TrueReel'}\n\n${footer} ${unsubUrl(uid)}\nTruereel · Chriesiweg 4 · 8310 Grafstal · Schweiz`;
  return { subject: m.subject, html, text };
}

let lastRun = 0;
export async function sendOnboardingMails({ force = false } = {}) {
  if (!admin || !process.env.BREVO_API_KEY) return { skipped: 'nicht konfiguriert' };
  if (!force && Date.now() - lastRun < 55 * 60_000) return { skipped: 'zu früh' };
  lastRun = Date.now();
  const now = Date.now();
  const { data: users, error } = await admin.from('profiles')
    .select('id,email,full_name,plan,is_admin,email_opt_out,onboarding_mail_step,created_at')
    .gt('created_at', new Date(now - 9 * 864e5).toISOString())
    .lt('created_at', new Date(now - 864e5).toISOString());
  if (error) throw error;
  let sent = 0;
  for (const p of users || []) {
    if (p.is_admin || p.email_opt_out || !p.email || /@truereel\.ch$/i.test(p.email)) continue;
    const days = (now - new Date(p.created_at).getTime()) / 864e5;
    const due = STEPS.find((s) => s.step > (p.onboarding_mail_step || 0) && days >= s.from && days < s.to);
    if (!due) continue;
    // Zuerst markieren (verhindert doppelten Versand), dann senden
    const { data: claimed } = await admin.from('profiles').update({ onboarding_mail_step: due.step })
      .eq('id', p.id).eq('onboarding_mail_step', p.onboarding_mail_step || 0).select('id');
    if (!claimed?.length) continue;
    if (due.freeOnly && (p.plan || 'free') !== 'free') continue; // zahlende Kunden brauchen keine Plan-Mail
    try {
      const { data: au } = await admin.auth.admin.getUserById(p.id);
      const lang = au?.user?.user_metadata?.lang === 'en' ? 'en' : 'de';
      const name = (p.full_name || '').split(' ')[0].slice(0, 40);
      await sendMail(p.email, render(lang, due.step, { name, uid: p.id }), p.id, `onboarding-${due.step}`);
      sent++;
    } catch (e) { console.error('[onboarding-mail]', e.message); }
  }
  if (sent) console.log(`[onboarding-mail] ${sent} Mail(s) gesendet`);
  return { sent };
}
