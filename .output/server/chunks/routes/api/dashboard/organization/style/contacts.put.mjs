import { y as defineEventHandler, aB as requireDashboardAccess, t as createError, aA as readBody, R as getOrganizationSettings, b0 as validateOrganizationContactsSettings, aw as persistOrganizationSettings, a0 as getStyleRecord } from '../../../../../nitro/nitro.mjs';
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

const contacts_put = defineEventHandler(async (event) => {
  var _a, _b;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can save organization contacts" });
  }
  const body = await readBody(event);
  if (!((_a = body == null ? void 0 : body.settings) == null ? void 0 : _a.contacts)) {
    throw createError({ statusCode: 400, statusMessage: "Organization contacts payload is required" });
  }
  const current = await getOrganizationSettings(event, access.shopId);
  const nextSettings = {
    ...current,
    contacts: body.settings.contacts,
    legal: (_b = body.settings.legal) != null ? _b : current.legal
  };
  const errors = validateOrganizationContactsSettings(nextSettings);
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

export { contacts_put as default };
