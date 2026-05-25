import { y as defineEventHandler, aB as requireDashboardAccess, t as createError, aA as readBody, aS as serverSupabaseServiceRole } from '../../../../nitro/nitro.mjs';
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

const toggle_post = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can toggle modules" });
  }
  const body = await readBody(event).catch(() => ({}));
  const featureCode = typeof body.featureCode === "string" ? body.featureCode.trim() : "";
  const enabled = body.enabled === true;
  if (!featureCode) {
    throw createError({ statusCode: 400, statusMessage: "featureCode is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const { data: catalogRow } = await client.from("feature_catalog").select("code").eq("code", featureCode).maybeSingle();
  if (!(catalogRow == null ? void 0 : catalogRow.code)) {
    throw createError({ statusCode: 404, statusMessage: "Unknown feature code" });
  }
  const { error } = await client.from("shop_feature_subscriptions").upsert({
    shop_id: access.shopId,
    feature_code: featureCode,
    enabled,
    source: "manual",
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }, { onConflict: "shop_id,feature_code" });
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || "Failed to update subscription" });
  }
  await client.from("shop_feature_events").insert({
    shop_id: access.shopId,
    feature_code: featureCode,
    action: enabled ? "enabled" : "disabled",
    payload: {},
    actor_user_id: access.userId
  });
  return { ok: true, enabled };
});

export { toggle_post as default };
