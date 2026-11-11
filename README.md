# TrueReel

> Faceless Videos, die laufen – ehrlich, einfach, automatisch.

KI-SaaS, die faceless Kurzvideos (TikTok, Instagram Reels, YouTube Shorts) erstellt und auf Wunsch automatisch postet.
**Stack:** React + Vite + Tailwind · Supabase (Auth & DB) · Stripe (Abos & Kundenportal) · Express-API mit austauschbaren KI-Modulen · FFmpeg-Rendering.

## Schnellstart

```bash
npm install
cp .env.example .env     # optional – ohne Keys läuft alles im Demo-Modus
npm run dev              # Web: http://localhost:5173 · API: http://localhost:8787
```

**Demo-Modus** (keine Keys gesetzt): Anmeldung, Serien und Videos werden lokal im Browser gespeichert,
der Checkout wird simuliert, Social-Verbindungen sind Platzhalter. Der komplette Ablauf
Registrierung → Onboarding → Editor → Export (MP4) → Freigabe → Kalender ist so testbar.

## Was funktioniert (Stand Prototyp)

| Bereich | Status |
|---|---|
| Landingpage (Hero mit Live-Vorschau, 3 Schritte, Features, Beispiele nach Nische, Preise, FAQ, CTA) | ✅ DE/EN, Hell/Dunkel, responsive |
| Preisseite mit Monat/Jahr-Umschalter (−20 %) und Rechner „Kosten pro Video“ | ✅ |
| Login/Registrierung (E-Mail + Google via Supabase) | ✅ |
| Onboarding-Wizard: Nische → Stil → Stimme → Zeitplan | ✅ |
| Serien-Builder (KI plant Folgen) | ✅ Nische **Geschichte** voll ausgebaut, „Eigenes Thema“ mit LLM |
| Editor: Szenen umordnen (Drag & Drop), Text/Stimme/Bild pro Szene, 9:16-Vorschau | ✅ |
| Animierte Untertitel (Karaoke, Pop, Box, Klassisch, Minimal; Schrift/Farbe/Position/Grösse) | ✅ |
| Musik: eigene, prozedural erzeugte (lizenzfreie) Bibliothek + Upload (Pro) | ✅ |
| Export: Browser-Rendering → FFmpeg → **MP4 H.264/AAC 1080×1920**, Wasserzeichen nur im Gratis-Test | ✅ |
| Freigabe vor dem Posten (abschaltbar pro Serie), Content-Kalender mit freien Slots | ✅ |
| Dashboard: Serien, geplante Posts, Verbrauch, Basis-Statistiken (nur echte Daten) | ✅ |
| Stripe: Checkout, Webhook-Sync, Kundenportal, **Kündigung mit 1 Klick** (Portal-Flow `subscription_cancel`) | ✅ |
| Kontingente serverseitig erzwungen (DB-Trigger) | ✅ |
| DSGVO/DSG: Datenexport, Kontolöschung, selbst gehostete Schrift, keine Tracking-Cookies | ✅ |
| Social-APIs: OAuth (TikTok, Meta/Instagram, Google/YouTube) + Token-Speicherung | ✅ vorbereitet |
| Social-Upload (`publish`) | ⏳ Stub – erfordert App-Review der Plattformen |

## KI-Module (austauschbar)

Alle Module liegen in `server/providers/` und werden per `.env` gewählt. Ohne Key fällt jedes Modul automatisch auf `mock` zurück.

| Modul | Variable | Optionen |
|---|---|---|
| Skript (LLM) | `LLM_PROVIDER` | `mock` (handgeschriebene, geprüfte Geschichts-Skripte), `anthropic` (Claude, strukturierte JSON-Ausgabe) |
| Bilder | `IMAGE_PROVIDER` | `mock` (prozedurale Platzhalter-Grafiken pro Stil), `pixabay` (gratis Stockfotos/-illustrationen mit Quellenangabe), `openai` |
| Voice (TTS) | `TTS_PROVIDER` | `mock` (Browser-Stimme nur in der Vorschau), `elevenlabs`, `openai` |
| Rendering | `RENDER_PROVIDER` | `ffmpeg` (wandelt Browser-Aufnahme in MP4 um) |

Neues Modul: Datei mit gleicher Schnittstelle anlegen und in `server/providers/index.js` registrieren.

## Supabase einrichten

1. Projekt anlegen (Region EU empfohlen), `supabase/migrations/0001_init.sql` ausführen.
2. Auth → Providers: E-Mail und Google aktivieren; Redirect-URL `http://localhost:5173/app` (bzw. Produktions-URL) erlauben.
3. `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` setzen.

Das Schema enthält RLS auf allen Tabellen; Abo-Felder sind für Nutzer schreibgeschützt (nur der Stripe-Webhook setzt sie), Social-Tokens sind für den Client nicht lesbar.

## Automatisierte Einrichtung

```bash
npm run check                                   # zeigt, was konfiguriert ist und was fehlt
STRIPE_SECRET_KEY=sk_test_... npm run setup:stripe   # legt Produkte, 6 Preise, Kundenportal (+ Webhook) an und schreibt die IDs in .env
docker build --build-arg VITE_SUPABASE_URL=... --build-arg VITE_SUPABASE_ANON_KEY=... -t truereel .   # Produktions-Image inkl. FFmpeg
```

## Stripe einrichten (manuell)

1. Drei Produkte (Hobby $24, Daily $49, Pro $89) mit je einem Monats- und Jahrespreis (−20 %: $230.40 / $470.40 / $854.40) anlegen; Preis-IDs in `.env`.
2. Kundenportal aktivieren (Kündigung, Zahlungsmethode, Rechnungen, Planwechsel). Stripe Tax optional (Checkout nutzt `automatic_tax`).
3. Webhook auf `/api/stripe/webhook` mit `checkout.session.completed` und `customer.subscription.*`; lokal: `stripe listen --forward-to localhost:8787/api/stripe/webhook`.

## Vor dem Livegang

- `src/config/site.js`: Firmendaten und Kontakt-E-Mail eintragen. Platzhalter in den Rechtsseiten sind gelb markiert – **juristisch prüfen lassen**.
- Social Proof (Nutzerzahlen, Stimmen) ist bewusst leer und ausgeblendet (`showSocialProof: false`) – erst mit echten Daten aktivieren.
- Generierte Medien (Bilder/Audio) werden im Prototyp als Data-URL im Projekt-JSON gespeichert → für Produktion in Supabase Storage auslagern.
- Social-Uploads implementieren (Stubs in `server/social/platforms.js`) und `SCHEDULER_ENABLED=true` setzen.
- Weitere Nischen (Motivation, Fakten, Horror, Reddit) inhaltlich ausbauen; UI-Übersetzungen FR/IT/ES in `src/i18n/` ergänzen.

## Projektstruktur

```
src/
  pages/            Landing, Preise, Auth, Rechtliches, app/ (Dashboard, Wizard, Serien, Editor, Kalender, Konto)
  video/            Engine: project.js (Timeline), art.js (Platzhalter-Grafik), renderer.js (Frame + Untertitel),
                    audio.js (Musik), tts.js, Player.jsx, exporter.js (Aufnahme + MP4), generate.js
  config/           Pläne/Preise, Kataloge (Nischen, Stile, Stimmen …), Firmendaten
  i18n/             DE (Schweizer Schreibweise) + EN
server/
  providers/        LLM / Bild / TTS / Render-Module
  social/           OAuth + Publish-Stubs pro Plattform
  stripe.js         Checkout, Portal, Webhook
shared/             Mock-Skripte (Server + Browser-Fallback)
supabase/migrations Schema, RLS, Kontingent-Trigger
```
