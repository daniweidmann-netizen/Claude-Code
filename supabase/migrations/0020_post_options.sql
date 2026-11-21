-- Einstellungen pro Plattform, die der Nutzer vor dem Posten wählt (z. B. TikTok: Sichtbarkeit, Kommentare, Werbe-Kennzeichnung)
alter table public.videos add column if not exists post_options jsonb;
