-- Partner-Programm: Bewerbungen mit eigenen Angaben, zwei Provisionssätze (Kollegen / externe Partner), Auszahlungen
alter table public.affiliates add column if not exists kind text not null default 'friend';
alter table public.affiliates add column if not exists status text not null default 'active';
alter table public.affiliates add column if not exists email text;
alter table public.affiliates add column if not exists country text;
alter table public.affiliates add column if not exists channel text;
alter table public.affiliates add column if not exists payout_method text;
alter table public.affiliates add column if not exists payout_details text;
alter table public.affiliates add column if not exists lang text;
alter table public.affiliates add column if not exists applied_at timestamptz;
alter table public.affiliates add column if not exists approved_at timestamptz;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'affiliates_kind_check') then
    alter table public.affiliates add constraint affiliates_kind_check check (kind in ('friend', 'external'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'affiliates_status_check') then
    alter table public.affiliates add constraint affiliates_status_check check (status in ('pending', 'active', 'rejected'));
  end if;
end $$;

-- Ausbezahlte Provisionen pro Partner und Monat (verhindert doppelte Auszahlung)
create table if not exists public.affiliate_payouts (
  id uuid primary key default gen_random_uuid(),
  code text not null references public.affiliates(code) on delete cascade,
  month text not null check (month ~ '^[0-9]{4}-[0-9]{2}$'),
  amount numeric(10,2) not null default 0,
  paid_at timestamptz not null default now(),
  unique (code, month)
);
alter table public.affiliate_payouts enable row level security; -- keine Policies: nur der Server (Service-Rolle) greift zu

-- Kollegen 30 %, externe Partner 20 % (vom Gewinn)
update public.app_settings
set value = jsonb_build_object('friendPercent', 30, 'externalPercent', 20), updated_at = now()
where key = 'affiliate' and not (value ? 'friendPercent');
insert into public.app_settings (key, value) values ('affiliate', '{"friendPercent": 30, "externalPercent": 20}'::jsonb) on conflict (key) do nothing;
