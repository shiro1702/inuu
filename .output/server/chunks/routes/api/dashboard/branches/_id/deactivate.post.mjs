import { y as defineEventHandler, aB as requireDashboardAccess, t as createError, Y as getRouterParam, aS as serverSupabaseServiceRole } from '../../../../../nitro/nitro.mjs';
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

const deactivate_post = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can deactivate branch" });
  }
  const branchId = getRouterParam(event, "id");
  if (!branchId) {
    throw createError({ statusCode: 400, statusMessage: "Branch id is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const update = await client.from("restaurants").update({ is_active: false }).eq("id", branchId).eq("shop_id", access.shopId).select("id,is_active").maybeSingle();
  if (update.error || !update.data) {
    throw createError({ statusCode: 400, statusMessage: ((_a = update.error) == null ? void 0 : _a.message) || "Failed to deactivate branch" });
  }
  return { ok: true };
});

export { deactivate_post as default };
