-- Anfragen von Firmen für den Video-Service (nur der Server liest/schreibt)
create table if not exists public.business_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text, company text, email text not null, phone text, industry text, package text, message text, lang text
);
alter table public.business_leads enable row level security;
