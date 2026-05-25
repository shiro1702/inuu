import { y as defineEventHandler, aB as requireDashboardAccess, t as createError, aA as readBody, b3 as validateStyleConfig, aS as serverSupabaseServiceRole, a0 as getStyleRecord, R as getOrganizationSettings, aw as persistOrganizationSettings, b5 as withAuditEntry, ax as persistStyleRecord } from '../../../../../nitro/nitro.mjs';
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

function validateIdentitySettings(settings) {
  const errors = [];
  const slug = settings.slug.trim().toLowerCase();
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push("Slug \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 lowercase-kebab-case.");
  }
  if (settings.displayName.trim().length < 2 || settings.displayName.trim().length > 60) {
    errors.push("\u041F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u043E\u0442 2 \u0434\u043E 60 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.");
  }
  if (settings.tagline.trim().length > 120) {
    errors.push("\u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0439 \u0441\u043B\u043E\u0433\u0430\u043D \u043F\u043E\u0434 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435\u043C \u043D\u0435 \u0434\u043E\u043B\u0436\u0435\u043D \u043F\u0440\u0435\u0432\u044B\u0448\u0430\u0442\u044C 120 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.");
  }
  if (settings.cuisine.trim().length > 300) {
    errors.push("\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F \u043A\u0443\u0445\u043D\u0438 \u043D\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u043F\u0440\u0435\u0432\u044B\u0448\u0430\u0442\u044C 300 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.");
  }
  return errors;
}
const identity_put = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can save organization identity" });
  }
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.data) || !(body == null ? void 0 : body.settings)) {
    throw createError({ statusCode: 400, statusMessage: "Payload is required" });
  }
  const errors = validateStyleConfig(body.data);
  errors.push(...validateIdentitySettings(body.settings));
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
  const currentStyle = await getStyleRecord(event, access.shopId);
  const currentSettings = await getOrganizationSettings(event, access.shopId);
  const nextStyle = {
    ...currentStyle.config,
    identity: body.data.identity
  };
  const nextSettings = {
    ...currentSettings,
    slug: normalizedSlug,
    displayName: body.settings.displayName,
    tagline: body.settings.tagline,
    cuisine: body.settings.cuisine
  };
  await persistOrganizationSettings(event, access.shopId, nextSettings);
  const nextRecord = withAuditEntry(
    {
      config: nextStyle,
      prevConfig: currentStyle.config,
      auditLog: currentStyle.auditLog
    },
    access.userId,
    "save",
    ["\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u044B \u0430\u0439\u0434\u0435\u043D\u0442\u0438\u043A\u0430 \u0438 \u043F\u0443\u0431\u043B\u0438\u0447\u043D\u044B\u0435 \u043F\u043E\u043B\u044F \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438"]
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

export { identity_put as default };
