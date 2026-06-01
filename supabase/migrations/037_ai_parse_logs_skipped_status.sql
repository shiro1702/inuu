-- TASK-001: allow skipped status for prefilter logs

comment on column public.ai_parse_logs.status is
  'success | failed | persisted | persist_failed | skipped';
