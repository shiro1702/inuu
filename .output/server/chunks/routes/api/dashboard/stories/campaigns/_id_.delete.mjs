import { y as defineEventHandler, aB as requireDashboardAccess, aS as serverSupabaseServiceRole, t as createError } from '../../../../../nitro/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  const client = await serverSupabaseServiceRole(event);
  const id = (_a = event.context.params) == null ? void 0 : _a.id;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "ID is required" });
  }
  const { error } = await client.from("story_campaigns").delete().eq("id", id).eq("shop_id", access.shopId);
  if (error) {
    console.error("delete story campaign:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to delete campaign" });
  }
  return { ok: true };
});

export { _id__delete as default };
