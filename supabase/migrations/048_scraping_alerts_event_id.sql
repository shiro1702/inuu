-- TASK-021: link scraping alerts to published events (weekend source check)

ALTER TABLE public.scraping_alerts
  ADD COLUMN IF NOT EXISTS event_id uuid REFERENCES public.events (id) ON DELETE SET NULL;

ALTER TABLE public.scraping_alerts
  ALTER COLUMN web_source_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_scraping_alerts_event_open
  ON public.scraping_alerts (event_id, reason)
  WHERE resolved_at IS NULL AND event_id IS NOT NULL;

COMMENT ON TABLE public.scraping_alerts IS 'Web crawl failures and source-vs-DB drift (source_404, source_cancelled_on_site, …)';
