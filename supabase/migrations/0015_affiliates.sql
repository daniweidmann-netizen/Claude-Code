-- Partner-/Affiliate-Programm: Links, Zuordnung neuer Nutzer, Provision
create table if not exists public.affiliates (
  code text primary key,
  name text not null,
  note text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.affiliates enable row level security;
alter table public.profiles add column if not exists referred_by text references public.affiliates(code) on delete set null;
alter table public.profiles add column if not exists referred_at timestamptz;
insert into public.affiliates (code, name) values
  ('p016pku', 'Partner 1'),
  ('p02x29b', 'Partner 2'),
  ('p03qt3a', 'Partner 3'),
  ('p04y7hn', 'Partner 4'),
  ('p05xg99', 'Partner 5'),
  ('p06ay4n', 'Partner 6'),
  ('p07hsau', 'Partner 7'),
  ('p08dekr', 'Partner 8'),
  ('p09mt2n', 'Partner 9'),
  ('p10aycb', 'Partner 10')
on conflict do nothing;
insert into public.app_settings (key, value) values ('affiliate', '{"commissionPercent": 20}'::jsonb) on conflict (key) do nothing;
