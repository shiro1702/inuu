import { y as defineEventHandler, aB as requireDashboardAccess, a0 as getStyleRecord, R as getOrganizationSettings } from '../../../../nitro/nitro.mjs';
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

const style_get = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  const [record, settings] = await Promise.all([
    getStyleRecord(event, access.shopId),
    getOrganizationSettings(event, access.shopId)
  ]);
  return {
    ok: true,
    role: access.role,
    settings,
    data: record.config,
    hasRollback: !!record.prevConfig,
    auditLog: record.auditLog
  };
});

export { style_get as default };
