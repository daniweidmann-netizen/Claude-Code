# NOVA – Moderner Onlineshop

Ein vollständiger E-Commerce-Shop, gebaut mit Next.js 15 (App Router), TypeScript, Tailwind CSS,
PostgreSQL, Prisma ORM und Stripe.

## Features

- Startseite mit Hero-Bereich, Kategorien und Bestsellern
- Produktübersicht mit Suche, Kategorie-Filter, Sortierung und Pagination
- Produktdetailseiten mit Bildergalerie und strukturierten Daten (SEO)
- Warenkorb (persistiert über Cookie/DB für Gäste und eingeloggte Nutzer)
- Checkout mit Adresseingabe, Rabattcodes und Stripe Checkout
- Registrierung/Login (NextAuth/Auth.js, Credentials Provider)
- Kundenkonto mit Bestellhistorie und Adressverwaltung
- Admin-Dashboard mit Produkt-, Kategorie-, Rabattcode- und Bestellverwaltung
- Sitemap, robots.txt und Open-Graph-Metadaten

## Voraussetzungen

- Node.js 20+
- PostgreSQL (lokal oder remote)
- Ein Stripe-Testkonto für Zahlungen (optional für lokale Entwicklung ohne Checkout)

## Setup

1. Abhängigkeiten installieren:

   ```bash
   npm install
   ```

2. `.env` Datei anlegen (siehe `.env.example`) und Werte anpassen:

   ```bash
   cp .env.example .env
   ```

3. Datenbank migrieren:

   ```bash
   npx prisma migrate dev
   ```

4. Beispieldaten laden (Kategorien, Produkte, Testnutzer, Rabattcodes):

   ```bash
   npm run db:seed
   ```

5. Entwicklungsserver starten:

   ```bash
   npm run dev
   ```

   Die App läuft danach unter [http://localhost:3000](http://localhost:3000).

## Testzugänge (nach dem Seed)

- **Admin:** `admin@nova-shop.dev` / `Admin123!`
- **Kunde:** `kunde@nova-shop.dev` / `Kunde123!`

## Stripe

Für einen funktionierenden Checkout müssen echte Stripe-Testschlüssel in `.env` hinterlegt werden:

```
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

Für lokale Webhook-Tests die Stripe CLI verwenden:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Nützliche Skripte

- `npm run dev` – Entwicklungsserver
- `npm run build` – Produktions-Build
- `npm run start` – Produktionsserver
- `npm run lint` – ESLint
- `npm run db:seed` – Datenbank mit Beispieldaten befüllen
- `npx prisma studio` – Datenbank im Browser inspizieren
