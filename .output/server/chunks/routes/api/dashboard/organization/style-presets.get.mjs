import { y as defineEventHandler, aB as requireDashboardAccess, a1 as getSystemPresets, M as getCustomPresets } from '../../../../nitro/nitro.mjs';
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

const stylePresets_get = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  const [system, custom] = await Promise.all([
    Promise.resolve(getSystemPresets()),
    getCustomPresets(event, access.shopId)
  ]);
  return {
    ok: true,
    items: [...system, ...custom]
  };
});

export { stylePresets_get as default };
