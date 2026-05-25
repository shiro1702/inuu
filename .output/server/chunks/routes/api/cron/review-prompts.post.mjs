import { y as defineEventHandler, a$ as useRuntimeConfig, t as createError, O as getHeader, ay as processDueReviewPrompts } from '../../../nitro/nitro.mjs';
import 'node:crypto';
import '@supabase/ssr';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:url';
import '@supabase/supabase-js';

const reviewPrompts_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const secret = String(config.cronReviewPromptsSecret || "").trim();
  if (!secret) {
    throw createError({ statusCode: 503, statusMessage: "Cron secret not configured" });
  }
  const header = String(getHeader(event, "x-cron-secret") || "").trim();
  if (header !== secret) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }
  const processed = await processDueReviewPrompts(event, { limit: 50 });
  return { ok: true, processed };
});

export { reviewPrompts_post as default };
