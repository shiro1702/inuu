import { y as defineEventHandler, aB as requireDashboardAccess, t as createError, a0 as getStyleRecord, b5 as withAuditEntry, ax as persistStyleRecord, R as getOrganizationSettings } from '../../../../../nitro/nitro.mjs';
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

const rollback_post = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can rollback organization style" });
  }
  const current = await getStyleRecord(event, access.shopId);
  if (!current.prevConfig) {
    throw createError({ statusCode: 400, statusMessage: "No previous style state for rollback" });
  }
  const nextRecord = withAuditEntry(
    {
      config: current.prevConfig,
      prevConfig: null,
      auditLog: current.auditLog
    },
    access.userId,
    "rollback",
    ["\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D rollback \u0441\u0442\u0438\u043B\u044F \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438"]
  );
  await persistStyleRecord(event, access.shopId, nextRecord);
  const settings = await getOrganizationSettings(event, access.shopId);
  return {
    ok: true,
    role: access.role,
    settings,
    data: nextRecord.config,
    hasRollback: !!nextRecord.prevConfig,
    auditLog: nextRecord.auditLog
  };
});

export { rollback_post as default };
