-- Auto-Posting: alle 10 Minuten fällige Posts verarbeiten lassen.
-- Weckt dabei auch den schlafenden Gratis-Server bei Render.
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule(jobid) from cron.job where jobname = 'truereel-publish';
select cron.schedule(
  'truereel-publish',
  '*/10 * * * *',
  $$ select net.http_post(
       url := 'https://truereel-der5.onrender.com/api/cron/publish',
       headers := '{"Content-Type":"application/json"}'::jsonb,
       body := '{}'::jsonb,
       timeout_milliseconds := 60000
     ) $$
);
