-- TASK-020: lifecycle status for cancel / sold out / postpone on storefront

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS event_status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS status_updated_at timestamptz,
  ADD COLUMN IF NOT EXISTS status_note text;

ALTER TABLE public.events
  DROP CONSTRAINT IF EXISTS events_event_status_check;

ALTER TABLE public.events
  ADD CONSTRAINT events_event_status_check
  CHECK (event_status IN ('active', 'cancelled', 'sold_out', 'postponed'));

CREATE INDEX IF NOT EXISTS idx_events_city_event_status
  ON public.events (city_id, event_status);

COMMENT ON COLUMN public.events.event_status IS 'active | cancelled | sold_out | postponed — витрина показывает плашку, карточка не скрывается';
