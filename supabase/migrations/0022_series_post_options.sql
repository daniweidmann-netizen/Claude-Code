-- Vom Serien-Inhaber gewählte Standard-Einstellungen fürs Posten (z. B. TikTok-Sichtbarkeit),
-- damit Videos einer Serie ohne Rückfrage zum geplanten Zeitpunkt hochgeladen werden können.
alter table public.series add column if not exists post_options jsonb;
