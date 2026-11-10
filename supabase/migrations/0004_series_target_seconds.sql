-- Ziel-Videolänge pro Serie (Sekunden). 65 = sicher über 60 s (TikTok-Monetarisierung).
alter table public.series add column if not exists target_seconds int not null default 65
  check (target_seconds between 15 and 180);
