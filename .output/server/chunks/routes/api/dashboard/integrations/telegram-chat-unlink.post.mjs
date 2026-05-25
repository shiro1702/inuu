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

const telegramChatUnlink_post = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can unlink chat" });
  }
  const body = await readBody(event).catch(() => ({}));
  const restaurantId = typeof body.restaurantId === "string" ? body.restaurantId.trim() : "";
  if (!restaurantId) {
    throw createError({ statusCode: 400, statusMessage: "restaurantId is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const { error } = await client.from("restaurants").update({ manager_group_chat_id: null }).eq("id", restaurantId).eq("shop_id", access.shopId);
  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Failed to unlink telegram chat" });
  }
  return { ok: true };
});

export { telegramChatUnlink_post as default };
