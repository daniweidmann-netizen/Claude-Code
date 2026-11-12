-- Figuren-Geschichten: wiederkehrende Hauptfigur pro Serie
-- { description: text, imageUrl: text (Referenzbild im media-Bucket) }
alter table public.series add column if not exists character jsonb;
