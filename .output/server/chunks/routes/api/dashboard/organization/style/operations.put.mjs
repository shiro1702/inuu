import { y as defineEventHandler, aB as requireDashboardAccess, t as createError, aA as readBody, R as getOrganizationSettings, b1 as validateOrganizationOperationsSettings, aw as persistOrganizationSettings, a0 as getStyleRecord } from '../../../../../nitro/nitro.mjs';
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

const operations_put = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can save organization operations" });
  }
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.settings)) {
    throw createError({ statusCode: 400, statusMessage: "Organization settings payload is required" });
  }
  const current = await getOrganizationSettings(event, access.shopId);
  const nextSettings = {
    ...current,
    ops: body.settings.ops,
    locale: body.settings.locale,
    tax: body.settings.tax
  };
  const errors = validateOrganizationOperationsSettings(nextSettings);
  if (errors.length) {
    throw createError({ statusCode: 400, statusMessage: errors.join(" ") });
  }
  await persistOrganizationSettings(event, access.shopId, nextSettings);
  const style = await getStyleRecord(event, access.shopId);
  const settings = await getOrganizationSettings(event, access.shopId);
  return {
    ok: true,
    role: access.role,
    settings,
    data: style.config,
    hasRollback: !!style.prevConfig,
    auditLog: style.auditLog
  };
});

export { operations_put as default };
