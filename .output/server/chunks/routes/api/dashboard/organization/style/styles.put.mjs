import { y as defineEventHandler, aB as requireDashboardAccess, t as createError, aA as readBody, b3 as validateStyleConfig, a0 as getStyleRecord, b5 as withAuditEntry, ax as persistStyleRecord, R as getOrganizationSettings } from '../../../../../nitro/nitro.mjs';
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

const styles_put = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can save organization style" });
  }
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.data)) {
    throw createError({ statusCode: 400, statusMessage: "Style payload is required" });
  }
  const errors = validateStyleConfig(body.data);
  if (errors.length) {
    throw createError({ statusCode: 400, statusMessage: errors.join(" ") });
  }
  const current = await getStyleRecord(event, access.shopId);
  const nextStyle = {
    ...current.config,
    tokens: body.data.tokens,
    radii: body.data.radii,
    presetId: (_a = body.data.presetId) != null ? _a : null
  };
  const nextRecord = withAuditEntry(
    {
      config: nextStyle,
      prevConfig: current.config,
      auditLog: current.auditLog
    },
    access.userId,
    "save",
    ["\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u044B \u0441\u0442\u0438\u043B\u0438 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438"]
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

export { styles_put as default };
