-- TrueReel – Grundschema
-- Ausführen mit: supabase db push  (oder im SQL-Editor des Supabase-Dashboards)

-- ── Profile ───────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  locale text default 'de',
  plan text not null default 'free' check (plan in ('free','hobby','daily','pro')),
  billing_interval text check (billing_interval in ('monthly','yearly')),
  subscription_status text,
  stripe_customer_id text unique,
  stripe_subscription_id text,
  cancel_at_period_end boolean default false,
  current_period_end timestamptz,
  free_videos_used int not null default 0,
  onboarding_done boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "profiles: eigene lesen" on public.profiles for select using (auth.uid() = id);
create policy "profiles: eigene ändern" on public.profiles for update using (auth.uid() = id);

-- Nutzer dürfen Abo-Felder NICHT selbst ändern (nur Service-Role via Stripe-Webhook)
revoke update on public.profiles from authenticated;
grant update (full_name, locale, onboarding_done) on public.profiles to authenticated;

-- Profil bei Registrierung automatisch anlegen
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'));
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Abos (Spiegel von Stripe) ─────────────────────────
create table if not exists public.subscriptions (
  id text primary key, -- Stripe subscription id
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null,
  interval text,
  status text not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  updated_at timestamptz default now()
);
alter table public.subscriptions enable row level security;
create policy "subscriptions: eigene lesen" on public.subscriptions for select using (auth.uid() = user_id);

-- ── Serien ────────────────────────────────────────────
create table if not exists public.series (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  niche text not null,
  topic text,
  language text not null default 'de',
  art_style text not null default 'cinematic',
  voice_id text not null default 'calm-m',
  captions jsonb not null default '{}'::jsonb,
  music jsonb not null default '{}'::jsonb,
  schedule jsonb not null default '{}'::jsonb,   -- { frequency: '1d', time: '18:00', timezone: 'Europe/Zurich' }
  platforms text[] not null default '{}',
  require_approval boolean not null default true,
  episodes jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.series enable row level security;
create policy "series: eigene" on public.series for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Videos ────────────────────────────────────────────
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  series_id uuid references public.series(id) on delete cascade,
  title text not null,
  episode_key text,
  status text not null default 'draft' check (status in ('draft','ready','pending_approval','scheduled','posted','failed')),
  project jsonb not null default '{}'::jsonb,
  platforms text[] not null default '{}',
  scheduled_at timestamptz,
  posted_at timestamptz,
  post_results jsonb,
  video_path text, -- Pfad im Storage-Bucket "renders"
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.videos enable row level security;
create policy "videos: eigene" on public.videos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists videos_user_created on public.videos (user_id, created_at desc);
create index if not exists videos_due on public.videos (status, scheduled_at);

-- Kontingent serverseitig erzwingen (kann vom Client nicht umgangen werden)
create or replace function public.enforce_video_quota() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  p text;
  quota int;
  used int;
begin
  select plan into p from public.profiles where id = new.user_id;
  quota := case coalesce(p, 'free') when 'hobby' then 13 when 'daily' then 30 when 'pro' then 60 else 1 end;
  if coalesce(p, 'free') = 'free' then
    select count(*) into used from public.videos where user_id = new.user_id;
  else
    select count(*) into used from public.videos where user_id = new.user_id and created_at >= date_trunc('month', now());
  end if;
  if used >= quota then
    raise exception 'Video-Kontingent erreicht' using errcode = 'P0001';
  end if;
  if coalesce(p, 'free') = 'free' then
    update public.profiles set free_videos_used = used + 1 where id = new.user_id;
  end if;
  return new;
end $$;

drop trigger if exists videos_quota on public.videos;
create trigger videos_quota before insert on public.videos
  for each row execute function public.enforce_video_quota();

-- Serien-Limit pro Plan
create or replace function public.enforce_series_limit() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  p text;
  lim int;
  used int;
begin
  select plan into p from public.profiles where id = new.user_id;
  lim := case coalesce(p, 'free') when 'daily' then 3 when 'pro' then 2147483647 else 1 end;
  select count(*) into used from public.series where user_id = new.user_id;
  if used >= lim then
    raise exception 'Serien-Limit deines Plans erreicht' using errcode = 'P0001';
  end if;
  return new;
end $$;

drop trigger if exists series_limit on public.series;
create trigger series_limit before insert on public.series
  for each row execute function public.enforce_series_limit();

-- ── Social-Verbindungen (Tokens nur für Service-Role lesbar) ──
create table if not exists public.social_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null check (platform in ('tiktok','instagram','youtube')),
  account_name text,
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, platform)
);
alter table public.social_connections enable row level security;
create policy "social: eigene lesen" on public.social_connections for select using (auth.uid() = user_id);
revoke select on public.social_connections from authenticated, anon;
grant select (id, user_id, platform, account_name, expires_at, created_at) on public.social_connections to authenticated;

-- ── Storage für gerenderte Videos ─────────────────────
insert into storage.buckets (id, name, public) values ('renders', 'renders', false) on conflict do nothing;
create policy "renders: eigene Dateien" on storage.objects for all
  using (bucket_id = 'renders' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'renders' and (storage.foldername(name))[1] = auth.uid()::text);
