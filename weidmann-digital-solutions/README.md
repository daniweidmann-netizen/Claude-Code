# Weidmann Digital Solutions – Corporate Website

Statische Website (HTML, CSS, JavaScript) ohne Baukasten und ohne Drittanbieter-Server:
Schriften liegen lokal in `assets/fonts`, keine Cookies, kein Tracking.

## Dateien
- `index.html` – Startseite (Deutsch, Umschalter DE/EN oben rechts)
- `styles.css`, `main.js` – Design, Animationen (Partikelfeld, 3D-Neigung, Parallax), Sprache, Kontaktformular
- `assets/*.mp4` – kurze, stumme CGI-Videoschleifen (KI-generiert); spielen nur, wenn sichtbar, im Sparmodus bleibt das Standbild
- `config.js` – **hier anpassen**: Kontaktformular-Adresse, Link zu Weidmann Digital, LinkedIn
- `impressum.html`, `datenschutz.html` – Pflichtseiten (gelb markierte Stellen ausfüllen)
- `robots.txt`, `sitemap.xml` – für Google (Domain eintragen)

## Vor dem Veröffentlichen
1. In `impressum.html` und `datenschutz.html` alle Stellen „bitte ergänzen“ ausfüllen (Name, Adresse, E-Mail, Hosting).
2. Endgültige Domain in `index.html` (canonical), `robots.txt` und `sitemap.xml` eintragen.
3. Link zu Weidmann Digital in `config.js` prüfen (`digitalUrl`).
4. Optional LinkedIn-Profil in `config.js` eintragen (sonst ist das Symbol ausgeblendet).

## Kontaktformular
Das Formular sendet an `https://truereel.ch/api/wds/contact` (TrueReel-Server). Der Server schickt die Nachricht per Brevo
an `WDS_CONTACT_TO` (Render-Umgebungsvariable, sonst die TrueReel-Kontaktadresse). Optional `WDS_ORIGINS` auf die Domain
der Website setzen (z. B. `https://weidmann-digital-solutions.onrender.com`), damit nur diese Seite das Formular nutzen kann.

## Veröffentlichen (Beispiel Render, kostenlos)
Render → New → Static Site → dieses Repository → Root Directory `weidmann-digital-solutions`, Build Command leer,
Publish Directory `.` → danach eigene Domain verbinden.
