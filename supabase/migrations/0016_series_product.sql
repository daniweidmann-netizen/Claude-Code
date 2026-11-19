-- Werbung für ein Produkt: echte Produktfotos der Serie ({ images: [{ url, label }] })
alter table public.series add column if not exists product jsonb;
