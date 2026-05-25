import { y as defineEventHandler, aB as requireDashboardAccess, aS as serverSupabaseServiceRole } from '../../../nitro/nitro.mjs';
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

const features_get = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  const client = await serverSupabaseServiceRole(event);
  const { data: subs } = await client.from("shop_feature_subscriptions").select("feature_code,enabled,started_at,ended_at,source").eq("shop_id", access.shopId);
  const { data: catalog } = await client.from("feature_catalog").select("code,name,billing_type,price,currency,dependencies,status");
  const catalogRows = catalog != null ? catalog : [];
  const subByCode = new Map((subs != null ? subs : []).map((x) => [String(x.feature_code), x]));
  const items = catalogRows.map((row) => {
    const code = String(row.code || "");
    const sub = subByCode.get(code);
    return {
      code,
      name: String(row.name || code),
      billingType: String(row.billing_type || ""),
      price: Number(row.price || 0),
      currency: String(row.currency || "RUB"),
      dependencies: Array.isArray(row.dependencies) ? row.dependencies : [],
      catalogStatus: String(row.status || "available"),
      enabled: (sub == null ? void 0 : sub.enabled) === true,
      startedAt: (sub == null ? void 0 : sub.started_at) || null,
      endedAt: (sub == null ? void 0 : sub.ended_at) || null,
      source: (sub == null ? void 0 : sub.source) || null
    };
  });
  return { ok: true, items };
});

export { features_get as default };
