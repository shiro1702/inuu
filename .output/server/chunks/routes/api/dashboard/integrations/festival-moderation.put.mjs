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

const festivalModeration_put = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can update festival moderation settings" });
  }
  const body = await readBody(event).catch(() => ({}));
  const festivalId = (_a = body.festivalId) == null ? void 0 : _a.trim();
  if (!festivalId) {
    throw createError({ statusCode: 400, statusMessage: "festivalId is required" });
  }
  const telegramChatId = ((_b = body.telegramChatId) == null ? void 0 : _b.trim()) || null;
  const maxChatId = ((_c = body.maxChatId) == null ? void 0 : _c.trim()) || null;
  const isActive = body.isActive !== false;
  if (!telegramChatId && !maxChatId) {
    throw createError({ statusCode: 400, statusMessage: "At least one chat id is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const { data: festival } = await client.from("festivals").select("id").eq("id", festivalId).maybeSingle();
  if (!(festival == null ? void 0 : festival.id)) {
    throw createError({ statusCode: 404, statusMessage: "Festival not found" });
  }
  const { error } = await client.from("festival_moderation_chats").upsert({
    festival_id: festivalId,
    shop_id: access.shopId,
    telegram_chat_id: telegramChatId,
    max_chat_id: maxChatId,
    is_active: isActive,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }, { onConflict: "festival_id,shop_id" });
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || "Failed to save festival moderation settings" });
  }
  return { ok: true };
});

export { festivalModeration_put as default };
