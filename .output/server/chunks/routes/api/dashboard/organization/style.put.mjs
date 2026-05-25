import { y as defineEventHandler, aB as requireDashboardAccess, t as createError, aA as readBody, b3 as validateStyleConfig, b2 as validateOrganizationSettings, aS as serverSupabaseServiceRole, a0 as getStyleRecord, aw as persistOrganizationSettings, b5 as withAuditEntry, ax as persistStyleRecord, R as getOrganizationSettings } from '../../../../nitro/nitro.mjs';
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

const style_put = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can save organization style" });
  }
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.data)) {
    throw createError({ statusCode: 400, statusMessage: "Style payload is required" });
  }
  if (!(body == null ? void 0 : body.settings)) {
    throw createError({ statusCode: 400, statusMessage: "Organization settings payload is required" });
  }
  const errors = validateStyleConfig(body.data);
  errors.push(...validateOrganizationSettings(body.settings));
  if (errors.length) {
    throw createError({ statusCode: 400, statusMessage: errors.join(" ") });
  }
  const normalizedSlug = body.settings.slug.trim().toLowerCase();
  const client = await serverSupabaseServiceRole(event);
  const duplicateSlug = await client.from("shops").select("id").eq("slug", normalizedSlug).neq("id", access.shopId).limit(1).maybeSingle();
  if (duplicateSlug.error) {
    throw createError({ statusCode: 500, statusMessage: duplicateSlug.error.message || "Failed to validate slug uniqueness" });
  }
  if ((_a = duplicateSlug.data) == null ? void 0 : _a.id) {
    throw createError({ statusCode: 400, statusMessage: "\u042D\u0442\u043E\u0442 slug \u0443\u0436\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u0434\u0440\u0443\u0433\u0438\u043C \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u043E\u043C." });
  }
  const current = await getStyleRecord(event, access.shopId);
  const nextSettings = {
    ...body.settings,
    slug: normalizedSlug
  };
  await persistOrganizationSettings(event, access.shopId, nextSettings);
  const nextRecord = withAuditEntry(
    {
      config: body.data,
      prevConfig: current.config,
      auditLog: current.auditLog
    },
    access.userId,
    "save",
    ["\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u044B \u0441\u0442\u0438\u043B\u044C \u0438 \u0438\u0434\u0435\u043D\u0442\u0438\u043A\u0430 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438"]
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

export { style_put as default };
