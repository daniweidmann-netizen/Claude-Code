-- Willkommensangebot nach dem ersten Gratis-Export (einmalig, 48 Stunden) + Einführungs-Mails (Tag 1/3/6)
alter table public.profiles add column if not exists offer_until timestamptz;
alter table public.profiles add column if not exists onboarding_mail_step int not null default 0;
insert into public.app_settings (key, value) values ('offer', '{"couponId":"OSUGnGYd","percent":30,"hours":48}')
  on conflict (key) do nothing;
