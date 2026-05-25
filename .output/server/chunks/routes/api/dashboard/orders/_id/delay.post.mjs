import { y as defineEventHandler, aB as requireDashboardAccess, Y as getRouterParam, t as createError, aA as readBody, aS as serverSupabaseServiceRole, a$ as useRuntimeConfig, ah as mergeMetadataWithTimeline } from '../../../../../nitro/nitro.mjs';
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

function telegramApi(token) {
  return `https://api.telegram.org/bot${token}/sendMessage`;
}
function delayText(orderNumber, kind) {
  if (kind === "delivery") {
    return `\u23F1 \u041D\u0435\u0431\u043E\u043B\u044C\u0448\u0430\u044F \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0430 \u043F\u043E \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0435 \u0437\u0430\u043A\u0430\u0437\u0430 #${orderNumber}: \u043A\u0443\u0440\u044C\u0435\u0440 \u0443\u0436\u0435 \u0432 \u043F\u0443\u0442\u0438, \u043D\u043E \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u0438\u0435\u0445\u0430\u0442\u044C \u0447\u0443\u0442\u044C \u043F\u043E\u0437\u0436\u0435. \u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0437\u0430 \u0442\u0435\u0440\u043F\u0435\u043D\u0438\u0435.`;
  }
  return `\u23F1 \u041D\u0435\u0431\u043E\u043B\u044C\u0448\u0430\u044F \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0430 \u043F\u043E \u0437\u0430\u043A\u0430\u0437\u0443 #${orderNumber}: \u043A\u0443\u0445\u043D\u044F \u0433\u043E\u0442\u043E\u0432\u0438\u0442 \u0432\u0430\u0448\u0435 \u0431\u043B\u044E\u0434\u043E \u0447\u0443\u0442\u044C \u0434\u043E\u043B\u044C\u0448\u0435 \u043E\u0431\u044B\u0447\u043D\u043E\u0433\u043E. \u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0437\u0430 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u0435.`;
}
function shortOrderRef(orderNumber) {
  const normalized = orderNumber.replace(/\s+/g, "");
  return normalized.length > 8 ? normalized.slice(0, 8) : normalized;
}
const delay_post = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Order id is required" });
  const body = await readBody(event).catch(() => ({}));
  const kind = (body == null ? void 0 : body.kind) === "delivery" ? "delivery" : "kitchen";
  const comment = typeof (body == null ? void 0 : body.comment) === "string" ? body.comment.trim() : "";
  const client = await serverSupabaseServiceRole(event);
  const { data: order, error: loadError } = await client.from("orders").select("id,shop_id,order_number,customer_telegram_id,metadata").eq("id", id).eq("shop_id", access.shopId).maybeSingle();
  if (loadError) throw createError({ statusCode: 500, statusMessage: "Failed to load order" });
  if (!order) throw createError({ statusCode: 404, statusMessage: "Order not found" });
  if (!order.customer_telegram_id) {
    throw createError({ statusCode: 400, statusMessage: "\u0423 \u0437\u0430\u043A\u0430\u0437\u0430 \u043D\u0435\u0442 Telegram \u043A\u043B\u0438\u0435\u043D\u0442\u0430 \u0434\u043B\u044F \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F" });
  }
  const { data: shop } = await client.from("shops").select("telegram_bot_token").eq("id", access.shopId).maybeSingle();
  const config = useRuntimeConfig();
  const tokenFromShop = typeof (shop == null ? void 0 : shop.telegram_bot_token) === "string" ? shop.telegram_bot_token.trim() : "";
  const botToken = tokenFromShop && tokenFromShop !== "platform-bot" ? tokenFromShop : String(config.botToken || "");
  if (!botToken) throw createError({ statusCode: 500, statusMessage: "Telegram bot token is not configured" });
  const orderNumber = shortOrderRef(order.order_number && String(order.order_number).trim() || String(order.id));
  const text = delayText(orderNumber, kind);
  const telegramRes = await fetch(telegramApi(botToken), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: Number(order.customer_telegram_id),
      text
    })
  }).catch(() => null);
  if (!(telegramRes == null ? void 0 : telegramRes.ok)) {
    throw createError({ statusCode: 502, statusMessage: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435 \u043A\u043B\u0438\u0435\u043D\u0442\u0443" });
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const entry = {
    at: now,
    label: `\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435 \u043E \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0435 (${kind === "delivery" ? "\u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430" : "\u043A\u0443\u0445\u043D\u044F"}) \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E \u043A\u043B\u0438\u0435\u043D\u0442\u0443${comment ? `: ${comment}` : ""}`,
    source: "dashboard",
    userId: access.userId,
    comment: comment || null
  };
  const newMetadata = mergeMetadataWithTimeline(order.metadata, entry);
  await client.from("orders").update({ metadata: newMetadata, updated_at: now }).eq("id", id).eq("shop_id", access.shopId);
  return { ok: true };
});

export { delay_post as default };
