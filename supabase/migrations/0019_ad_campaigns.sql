-- Werbe-Test: Kampagnen mit eigenem Link, Ausgaben und Auswertung (Besucher → Konten → zahlende Kunden)
create table if not exists public.ad_campaigns (
  code text primary key,
  name text not null,
  platform text not null default 'other',
  target text not null default 'start',
  spend numeric not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.ad_campaigns enable row level security; -- nur Server (Service-Role)
alter table public.profiles add column if not exists campaign text;
alter table public.profiles add column if not exists campaign_at timestamptz;
alter table public.business_leads add column if not exists campaign text;
