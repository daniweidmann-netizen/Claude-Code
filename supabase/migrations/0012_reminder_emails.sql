-- Einmalige Erinnerungs-Mail für erstellte, aber nicht exportierte Videos
alter table public.profiles add column if not exists reminder_sent_at timestamptz;
alter table public.profiles add column if not exists email_opt_out boolean not null default false;
