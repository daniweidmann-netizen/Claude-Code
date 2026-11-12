-- Cookie-freie Besucherstatistik (eigene Lösung, keine Drittanbieter)
-- Ein Besucher wird nur über einen täglich wechselnden, gesalzenen Hash aus
-- IP-Adresse + Browserkennung erkannt. IP und Salz werden nie gespeichert,
-- dadurch ist ein Besucher nach Mitternacht (UTC) nicht mehr wiedererkennbar.
create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  type text not null default 'pageview',     -- pageview | signup | checkout | purchase
  path text,
  referrer text,                              -- nur Hostname, z. B. "www.tiktok.com"
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device text,                                -- mobile | tablet | desktop
  lang text,
  visitor text,                               -- Tages-Hash, nicht personenbeziehbar
  value numeric                               -- z. B. Betrag bei purchase (USD)
);

create index if not exists analytics_events_created_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_type_idx on public.analytics_events (type, created_at desc);

-- Nur der Server (Service-Role) schreibt und liest; keine Policies = kein Zugriff für Browser
alter table public.analytics_events enable row level security;

-- Alte Rohdaten nach 13 Monaten löschen (pg_cron ist bereits aktiv, siehe 0005)
select cron.schedule('analytics-retention', '17 3 * * *',
  $$delete from public.analytics_events where created_at < now() - interval '13 months'$$);

-- Admin-Flag für die Statistik-Seite (manuell per SQL setzen)
alter table public.profiles add column if not exists is_admin boolean not null default false;
