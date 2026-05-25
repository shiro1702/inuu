import { y as defineEventHandler, aB as requireDashboardAccess, t as createError, aA as readBody, aS as serverSupabaseServiceRole, a$ as useRuntimeConfig } from '../../../../../nitro/nitro.mjs';
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

async function sendTelegram(botToken, chatId, text) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
  if (!response.ok) {
    throw new Error(`telegram_send_failed:${response.status}`);
  }
}
async function sendMax(baseUrl, token, conversationId, text) {
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/messages`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ conversationId, text })
  });
  if (!response.ok) {
    throw new Error(`max_send_failed:${response.status}`);
  }
}
const test_post = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can send test messages" });
  }
  const body = await readBody(event).catch(() => ({}));
  const festivalId = (_a = body.festivalId) == null ? void 0 : _a.trim();
  if (!festivalId) {
    throw createError({ statusCode: 400, statusMessage: "festivalId is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const { data: row } = await client.from("festival_moderation_chats").select("telegram_chat_id,max_chat_id").eq("shop_id", access.shopId).eq("festival_id", festivalId).eq("is_active", true).maybeSingle();
  if (!row) {
    throw createError({ statusCode: 404, statusMessage: "Festival moderation chat is not configured" });
  }
  const config = useRuntimeConfig(event);
  const tenant = event.context.tenant;
  const botToken = typeof (tenant == null ? void 0 : tenant.telegramBotToken) === "string" && tenant.telegramBotToken.trim() ? tenant.telegramBotToken.trim() : String(config.botToken || "");
  const maxBaseUrl = String(config.maxApiBaseUrl || "");
  const maxToken = String(config.maxApiToken || "");
  const text = "\u{1F9EA} Festival UGC moderation test: \u0447\u0430\u0442 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D \u0438 \u0433\u043E\u0442\u043E\u0432 \u043A \u0430\u043F\u0440\u0443\u0432\u0430\u043C.";
  const sent = [];
  if (row.telegram_chat_id && botToken) {
    await sendTelegram(botToken, String(row.telegram_chat_id), text);
    sent.push("telegram");
  }
  if (row.max_chat_id && maxBaseUrl && maxToken) {
    await sendMax(maxBaseUrl, maxToken, String(row.max_chat_id), text);
    sent.push("max");
  }
  if (!sent.length) {
    throw createError({ statusCode: 400, statusMessage: "No available transport to send test message" });
  }
  return { ok: true, sent };
});

export { test_post as default };
