-- Kundenbewertungen: nur der Server liest/schreibt; veröffentlicht wird nur mit Erlaubnis + Freigabe durch den Inhaber
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  text text,
  display_name text,
  publish_ok boolean not null default false,
  approved boolean not null default false,
  lang text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
