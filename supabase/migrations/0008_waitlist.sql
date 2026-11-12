-- Interessentenliste für geplante Funktionen (z. B. Cinematic-Plan mit KI-Videoclips)
create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  feature text not null default 'cinematic',
  email text not null,
  user_id uuid references auth.users(id) on delete set null,
  lang text,
  unique (feature, email)
);
-- Nur der Server (Service-Role) liest und schreibt
alter table public.waitlist enable row level security;
