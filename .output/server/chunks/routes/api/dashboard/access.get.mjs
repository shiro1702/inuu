import { y as defineEventHandler, aB as requireDashboardAccess } from '../../../nitro/nitro.mjs';
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

const access_get = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  return {
    ok: true,
    userId: access.userId,
    shopId: access.shopId,
    role: access.role
  };
});

export { access_get as default };
