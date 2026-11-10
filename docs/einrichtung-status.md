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
| Hobby | $17.00 | $163.20 |
| Daily | $35.00 | $336.00 |
| Pro | $62.00 | $595.20 |

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
