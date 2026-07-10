# ShopWerk

Premium-Webseite für die Webdesign-Agentur ShopWerk (Grafstal, Schweiz) — gebaut mit Next.js 16, TypeScript, Tailwind CSS 4, Framer Motion, GSAP/ScrollTrigger und Lenis Smooth Scroll.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Sprache:** TypeScript
- **Styling:** Tailwind CSS 4 (CSS-basierte `@theme`-Konfiguration in `app/globals.css`)
- **Animation:** Framer Motion, GSAP + ScrollTrigger, Lenis
- **Icons:** Lucide React

## Entwicklung

```bash
npm install
npm run dev
```

Die Seite läuft danach unter `http://localhost:3000`.

```bash
npm run build   # Produktions-Build
npm run start   # Produktions-Server
npm run lint    # ESLint
```

## Struktur

- `app/` — Routen (Homepage, `/arbeiten` inkl. dynamischer Case-Study-Seiten, Rechtliches, 404, Erfolgsseite, API-Route für das Kontaktformular, SEO-Dateien)
- `components/sections/` — Große Seitenabschnitte (Hero, Services, Prozess, Kontakt, …)
- `components/ui/` — Wiederverwendbare Animations- und UI-Primitiven (Reveal, TiltCard, MagneticButton, …)
- `components/portfolio/`, `components/contact/`, `components/legal/`, `components/layout/` — Feature-spezifische Komponenten
- `lib/data/` — Inhalte (Projekte, Leistungen, FAQ, Testimonials, Prozess, Site-Konfiguration)

## Hinweise für den Produktivbetrieb

- **Kontaktformular:** `app/api/contact/route.ts` validiert die Anfrage und loggt sie serverseitig. Für den Live-Betrieb sollte hier ein E-Mail-/CRM-Versand (z. B. Resend, SendGrid) ergänzt werden.
- **Impressum:** Handelsregisternummer und UID/MWST-Nummer sind als Platzhalter markiert und müssen vor Veröffentlichung ergänzt werden.
- **Google Maps:** Die Karte im Kontaktbereich nutzt den kostenlosen `google.com/maps/embed`-Iframe (kein API-Key nötig). In Sandbox-/CI-Umgebungen ohne Zugriff auf externe Domains bleibt die Karte leer — im echten Browser mit Internetzugang funktioniert sie normal.
- **Domain/Kontaktdaten:** URL, E-Mail und Telefonnummer sind in `lib/data/site.ts` zentral hinterlegt und sollten vor dem Launch auf die echten Werte angepasst werden.
