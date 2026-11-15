-- Gratis-Test: 3 Videos statt 1 (mit Wasserzeichen)
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
  if exists (select 1 from public.profiles where id = new.user_id and is_admin) then
    return new; -- Inhaber: unbegrenzt
  end if;
  select plan into p from public.profiles where id = new.user_id;
  quota := case coalesce(p, 'free') when 'hobby' then 13 when 'daily' then 30 when 'pro' then 60 else 3 end;
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
