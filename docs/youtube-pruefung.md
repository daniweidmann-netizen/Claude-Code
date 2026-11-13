# YouTube-Prüfung bei Google – Anleitung und Texte

Ziel: TrueReel darf Videos **öffentlich** hochladen, und **alle** Nutzer (nicht nur Testnutzer) können ihren Kanal verbinden.

Dafür braucht es zwei Schritte bei Google. Beide sind kostenlos.

| Schritt | Wozu | Dauer (typisch) |
|---|---|---|
| 1. OAuth-Verifizierung | Jeder darf YouTube verbinden, ohne Warnung „Google hat diese App nicht überprüft“ | einige Tage bis ca. 4 Wochen |
| 2. YouTube API Audit | Uploads sind nicht mehr automatisch „privat“ | einige Wochen |

Die Formulare sind auf Englisch. Die Texte unten können 1:1 kopiert werden.

---

## Vorbereitung (erledigt)

- [x] Eigene Domain `truereel.ch`, in der Google Search Console bestätigt
- [x] Branding: Startseite `https://truereel.ch`, Datenschutz `https://truereel.ch/datenschutz`, AGB `https://truereel.ch/agb`
- [x] Datenschutzerklärung erwähnt YouTube API Services, Google-Datenschutzerklärung, YouTube-Nutzungsbedingungen, Widerruf über myaccount.google.com/permissions und die „Limited Use“-Regeln
- [x] In der App steht beim Verbinden ein Hinweis auf die YouTube-Nutzungsbedingungen
- [x] **Demo-Video**: https://www.youtube.com/watch?v=gG9N6uQjKjY (nicht gelistet)

---

## Demo-Video (ca. 2–3 Minuten, Bildschirmaufnahme)

Google will sehen, wie die App die Berechtigungen nutzt. Am einfachsten mit der Bildschirmaufnahme des iPhones (Kontrollzentrum → Aufnahme) oder am Computer. Ton ist nicht nötig, aber hilfreich.

1. Browser zeigt **https://truereel.ch** (Adresse sichtbar!).
2. Einloggen → **Konto** → bei YouTube auf **Verbinden** tippen.
3. Google-Zustimmungsdialog zeigen: App-Name **TrueReel** und die Berechtigungen sind sichtbar → **Zulassen**.
4. Zurück in TrueReel: „YouTube ist verbunden“.
5. Ein Video öffnen → **Exportieren** → **Freigeben & posten** → **Jetzt posten**.
6. Den YouTube-Link anklicken: das Video ist auf dem eigenen Kanal.
7. Kurz zeigen: **Konto → YouTube → Trennen** (Zugriff entziehen).

Das Video auf YouTube als **„Nicht gelistet“** hochladen und den Link im Formular angeben.

---

## Schritt 1: OAuth-Verifizierung

Google Cloud → ☰ → **Google Auth Platform**

1. **Zielgruppe** → Veröffentlichungsstatus von „Testing“ auf **„In Produktion“** setzen (Publish app).
2. **Datenzugriff** → prüfen, dass genau diese Bereiche (Scopes) eingetragen sind:
   - `https://www.googleapis.com/auth/youtube.upload`
   - `https://www.googleapis.com/auth/youtube.readonly`
3. **Prüfzentrum** (Verification Center) → **Zur Überprüfung einreichen**.

### Texte für das Formular

**Scope justification – youtube.upload**
> TrueReel is a tool that helps creators produce short vertical videos (YouTube Shorts) with AI-generated scripts, images, voiceover and captions. The youtube.upload scope is used only to upload a video to the user's own channel when the user explicitly approves the video in TrueReel and clicks "Post now", or when the user has scheduled the approved video for a specific time. TrueReel never uploads anything without the user's approval and never modifies or deletes existing videos.

**Scope justification – youtube.readonly**
> The youtube.readonly scope is used only once after connecting, to read the name of the user's own channel so the user can see which channel is connected in their TrueReel account settings. No other channel data is read, stored or shared.

**How will the data be used? (allgemein)**
> Access tokens are stored encrypted in our database (Supabase, EU region) and are used only to perform the uploads described above on the user's behalf. Users can disconnect YouTube in TrueReel at any time, which deletes the stored tokens, or revoke access at myaccount.google.com/permissions. We do not sell or share Google user data, do not use it for advertising, and do not use it to train AI models. Our use complies with the Google API Services User Data Policy, including the Limited Use requirements.

**Demo video link:** (Link zum nicht gelisteten Demo-Video)

---

## Schritt 2: YouTube API Audit (öffentliche Uploads)

Formular: **YouTube API Services – Audit and Quota Extension Form**
https://support.google.com/youtube/contact/yt_api_form

Angaben:
- **Organisation:** Truereel (Einzelunternehmen), Daniel Weidmann, Chriesiweg 4, 8310 Grafstal, Schweiz
- **Website:** https://truereel.ch
- **Google Cloud Project Number:** (in Google Cloud → Dashboard/Projektinfo ablesen)
- **API client:** Web application, https://truereel.ch
- **Which API services:** YouTube Data API v3 – `videos.insert` (Upload), `channels.list` (eigener Kanalname)
- **Quota needed:** Standard (10'000 Einheiten/Tag) reicht für den Start (ein Upload kostet ca. 1'600 Einheiten → ca. 6 Uploads/Tag). Für mehr Nutzer später eine Erhöhung beantragen, z. B. 100'000.

**Use case description**
> TrueReel (https://truereel.ch) lets creators produce short vertical videos with AI-generated scripts, visuals, voiceover and captions. Users connect their own YouTube channel via OAuth and can publish an approved video to their own channel as a YouTube Short, either immediately or at a time they schedule. Each upload happens only after explicit user approval; by default every video requires manual approval before posting. Videos include an AI-content disclosure in the description. We only call videos.insert (upload) and channels.list (to show the connected channel's name). We do not access analytics, comments or other channels, and we do not store YouTube data beyond the upload result (video ID and URL) shown to the user.

**Demo video:** gleicher Link wie bei Schritt 1.

---

## Status (13.11.2026)

- [x] Branding von Google geprüft und veröffentlicht
- [x] OAuth-Datenzugriff (youtube.upload, youtube.readonly) zur Prüfung eingereicht
- [x] YouTube API Audit-Formular eingereicht (Standardkontingent 10'000, Nachweise 1–6 hochgeladen)
- [x] OAuth-Tokens werden AES-256-GCM-verschlüsselt gespeichert
- [ ] Antwort von Google abwarten (Mails an info@truereel.ch)

## Danach

- Sobald das Audit genehmigt ist, in Render `YOUTUBE_PRIVACY` von `private` auf `public` (oder auf die Wahl des Nutzers) stellen – das übernimmt Claude.
- Google schreibt manchmal mit Rückfragen per E-Mail – einfach weiterleiten bzw. hier einfügen.
