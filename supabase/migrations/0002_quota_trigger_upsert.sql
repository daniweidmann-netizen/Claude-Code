-- Kontingent-/Limit-Trigger: Bestehende Zeilen (Upsert = Bearbeiten) nicht mitzählen.
create or replace function public.enforce_video_quota() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  p text;
  quota int;
  used int;
begin
  if exists (select 1 from public.videos where id = new.id) then
    return new; -- Bearbeitung eines vorhandenen Videos
  end if;
  select plan into p from public.profiles where id = new.user_id;
  quota := case coalesce(p, 'free') when 'hobby' then 13 when 'daily' then 30 when 'pro' then 60 else 1 end;
  if coalesce(p, 'free') = 'free' then
    select count(*) into used from public.videos where user_id = new.user_id;
    used := greatest(used, (select coalesce(free_videos_used, 0) from public.profiles where id = new.user_id));
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

create or replace function public.enforce_series_limit() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  p text;
  lim int;
  used int;
begin
  if exists (select 1 from public.series where id = new.id) then
    return new;
  end if;
  select plan into p from public.profiles where id = new.user_id;
  lim := case coalesce(p, 'free') when 'daily' then 3 when 'pro' then 2147483647 else 1 end;
  select count(*) into used from public.series where user_id = new.user_id;
  if used >= lim then
    raise exception 'Serien-Limit deines Plans erreicht' using errcode = 'P0001';
  end if;
  return new;
end $$;
