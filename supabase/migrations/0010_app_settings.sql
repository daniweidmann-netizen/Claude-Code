-- Einstellungen für den Inhaber (z. B. Fixkosten und KI-Kosten pro Video im Finanz-Rechner)
create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
-- Nur der Server (Service-Role) liest und schreibt
alter table public.app_settings enable row level security;

insert into public.app_settings (key, value) values ('finance', '{
  "aiCostPerVideo": 0.15,
  "stripePercent": 7,
  "stripeFixed": 0.30,
  "fixedCosts": [
    { "name": "Render (Server)", "amount": 7 },
    { "name": "Domain truereel.ch", "amount": 2 }
  ]
}'::jsonb) on conflict (key) do nothing;
