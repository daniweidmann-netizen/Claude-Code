# Stripe – Testmodus (angelegt mit `npm run setup:stripe`)

Diese IDs sind **nicht geheim** und gehören beim Hosting in die Umgebungsvariablen.
Für den Livebetrieb das Skript mit dem Live-Schlüssel (`sk_live_…`) erneut ausführen – dort entstehen neue IDs.

```
STRIPE_PRICE_HOBBY_MONTHLY=price_1UaDvXCAr5FN2JA9BkjIw8tz
STRIPE_PRICE_HOBBY_YEARLY=price_1UaDvYCAr5FN2JA9ljtChrXb
STRIPE_PRICE_DAILY_MONTHLY=price_1UaDvYCAr5FN2JA9Bp56DdWH
STRIPE_PRICE_DAILY_YEARLY=price_1UaDvZCAr5FN2JA9iuQXEdum
STRIPE_PRICE_PRO_MONTHLY=price_1UaDvZCAr5FN2JA9Oa6Rlvtm
STRIPE_PRICE_PRO_YEARLY=price_1UaDvaCAr5FN2JA9DFlpYuSn
STRIPE_PORTAL_CONFIG=bpc_1UaDvaCAr5FN2JA9K2VPfAby
```

| Plan | Monatlich | Jährlich (−20 %) |
|---|---|---|
| Hobby | $24.00 | $230.40 |
| Daily | $49.00 | $470.40 |
| Pro | $89.00 | $854.40 |

Kundenportal: Kündigung zum Periodenende, Planwechsel (anteilig), Zahlungsmethode, Rechnungen.

Noch offen: Webhook (sobald die App eine öffentliche https-Adresse hat, Skript erneut ausführen)
und Stripe Tax / Steuerregistrierung vor dem Livegang prüfen.

---

# Supabase

- Projekt-Ref: `rocgdmpjiwytnsjgjpcj` · Region: eu-north-1 (Stockholm)
- URL: `https://rocgdmpjiwytnsjgjpcj.supabase.co`
- Schema `supabase/migrations/0001_init.sql` eingespielt (Tabellen, RLS, Kontingent-Trigger)
- Auth: Site-URL `http://localhost:5173`, Redirects `http://localhost:5173/**`, Passwort min. 8 Zeichen
- E-Mail-Bestätigung vorübergehend AUS (Testphase) – vor dem Start eigenes SMTP einrichten und wieder einschalten
- Migration `0002_quota_trigger_upsert.sql` eingespielt (Bearbeiten zählt nicht als neues Video)
- Getestet: Registrierung, Profil, Serie/Video speichern, Limits, RLS, Login
- Offen: Google-Login; nach dem Hosting Site-URL/Redirects auf die echte Domain umstellen
- Anon-Key: Supabase Dashboard → Project Settings → API (öffentlich). Service-Role-Key: dort, **geheim**, nur beim Hoster eintragen.

---

# Pixabay (gratis Stockbilder)

- `IMAGE_PROVIDER=pixabay` und `PIXABAY_API_KEY` (Schlüssel: pixabay.com/api/docs, nur beim Hoster eintragen – nicht ins Repo)
- Getestet: Bilder werden beim Erstellen automatisch gesucht (~6 s für 6 Szenen), Quellenangabe pro Szene, bleibt nach Reload erhalten
- Hinweis: Stockfotos passen nicht immer zur historischen Epoche → Bildbeschreibung anpassen oder „Bild“ neu suchen

---

# Hosting (Render, kostenlos)

- `render.yaml` (Blueprint) + `Dockerfile` (inkl. FFmpeg); öffentliche Supabase-Werte setzt der Server zur Laufzeit ins HTML
- Migration `0003_media_bucket.sql` eingespielt: Bilder/Audio liegen im Storage-Bucket `media` (Video-Datensatz 2 KB statt 2,6 MB)
- Produktionsmodus lokal getestet: Registrierung, Speichern, Limits, Login, MP4-Export mit Storage-Bildern
- Aufräumen: 6 Testbilder im Bucket `media` (Supabase → Storage → media) können gelöscht werden

---

# Live: https://truereel.ch (Render Free, Frankfurt; alt: https://truereel-der5.onrender.com)

Getestet am Live-System:
- Startseite (~1,4 s), Registrierung, Login, Onboarding, Video mit 6 Pixabay-Bildern
- MP4-Export (H.264 wird nur neu verpackt – Render Free schafft kein Full-HD-Neukodieren)
- Stripe: Checkout-Weiterleitung, Webhook → Plan „Daily“ aktiv, Kündigung zum Periodenende → markiert,
  Abo-Ende → zurück auf Gratis; 1-Klick-Kündigung öffnet den Kündigungs-Flow im Portal
- Konto löschen entfernt Daten und Dateien (filesRemoved)
- Statusseite: /api/health (inkl. Format-Check des Webhook-Secrets, ohne Werte)

Offen / vor dem echten Start:
- E-Mail-Versand (SMTP) einrichten und „Confirm email“ in Supabase wieder einschalten
- Stripe Live-Modus (Bankdaten, Steuern), danach `npm run setup:stripe` mit Live-Schlüssel + Werte bei Render ersetzen
- 11 verwaiste Testbilder in Supabase → Storage → media löschen (Ordner gelöschter Testkonten)
- Rechtstexte prüfen lassen, eigene Domain + E-Mail-Adresse

---

# Inhalte (Stand)

- Skripte: Claude (`LLM_PROVIDER=anthropic`), alle Nischen, 5 Sprachen; Mock-Fallback mit 6 Geschichts-Folgen in DE/EN/FR/IT/ES
- Stimme: OpenAI (`TTS_PROVIDER=openai`), Sprech-Anweisungen je Sprache/Stil, automatisch beim Erstellen und vor dem Export
- Bilder: Nische Geschichte → Wikimedia Commons (nur Public Domain/CC0, Quelle+Lizenz pro Szene), sonst/Rückfall Pixabay; keine Wiederholung pro Video
- Hinweis: Einstellungen mit `value:` in render.yaml überschreiben Dashboard-Werte – dort ändern

## Stripe: live und Sandbox

render.yaml enthält die **Live**-IDs (Konto Truereel, acct_1UajYhPcZaD5KrkX). Zum Testen mit der **Truereel Sandbox** (acct_1UZdlqB41s0DKjW8) in Render `STRIPE_SECRET_KEY`=sk_test_…, das Sandbox-Webhook-Geheimnis und diese IDs setzen:

- `STRIPE_PRICE_HOBBY_MONTHLY` = `price_1UajngB41s0DKjW8VRHTa1Um`
- `STRIPE_PRICE_HOBBY_YEARLY` = `price_1UajnhB41s0DKjW8lGwg1AbK`
- `STRIPE_PRICE_DAILY_MONTHLY` = `price_1UajnhB41s0DKjW8wIdEtQPZ`
- `STRIPE_PRICE_DAILY_YEARLY` = `price_1UajniB41s0DKjW8vFyWeoMq`
- `STRIPE_PRICE_PRO_MONTHLY` = `price_1UajnjB41s0DKjW8ycgY3IfJ`
- `STRIPE_PRICE_PRO_YEARLY` = `price_1UajnkB41s0DKjW8ZnG59z5Y`
- `STRIPE_PORTAL_CONFIG` = `bpc_1UajnkB41s0DKjW8zlR96zad`

Managed Payments ist aktiv (`STRIPE_MANAGED_PAYMENTS=true`); Produkte haben den Steuercode `txcd_10103000`.
