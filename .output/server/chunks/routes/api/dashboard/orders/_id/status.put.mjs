import { y as defineEventHandler, a$ as useRuntimeConfig, aB as requireDashboardAccess, Y as getRouterParam, t as createError, aA as readBody, aS as serverSupabaseServiceRole, ak as normalizeDashboardStatus, K as getAllowedOrderStatusTransitions, ah as mergeMetadataWithTimeline, a as accrueLoyaltyEarnForPaidOrder, B as dispatchNotificationEvent, w as dashboardOrderStatusLabels } from '../../../../../nitro/nitro.mjs';
import crypto from 'node:crypto';
import '@supabase/ssr';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:url';
import '@supabase/supabase-js';

const statusLabels = dashboardOrderStatusLabels;
function resolveReviewReminderDelayMs(raw) {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return 5 * 60 * 1e3;
  return Math.max(1e4, parsed);
}
async function sendReviewReminder(args) {
  if (!args.restaurantId) return;
  const { data: restaurant } = await args.client.from("restaurants").select("festival_id,name").eq("id", args.restaurantId).maybeSingle();
  const festivalId = restaurant == null ? void 0 : restaurant.festival_id;
  if (!festivalId) return;
  const { data: festival } = await args.client.from("festivals").select("name,slug").eq("id", festivalId).maybeSingle();
  const orderRef = String(args.orderNumber || args.orderId).slice(0, 12);
  const festivalName = String((festival == null ? void 0 : festival.name) || "\u0444\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044F");
  const reminderText = [
    `\u041A\u0430\u043A \u0432\u0430\u043C \u0437\u0430\u043A\u0430\u0437 #${orderRef}?`,
    `\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u0435\u0441\u044C \u043A\u043E\u0440\u043E\u0442\u043A\u0438\u043C \u0432\u0438\u0434\u0435\u043E\u043E\u0442\u0437\u044B\u0432\u043E\u043C \u043E \u0431\u043B\u044E\u0434\u0435 \u0434\u043B\u044F ${festivalName} \u0438 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 \u0431\u043E\u043D\u0443\u0441\u043D\u044B\u0435 \u0431\u0430\u043B\u043B\u044B.`,
    '\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u043C\u0438\u043D\u0438\u0430\u043F\u043F, \u0440\u0430\u0437\u0434\u0435\u043B "\u041C\u043E\u0438 \u0437\u0430\u043A\u0430\u0437\u044B" \u0438 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432\u0438\u0434\u0435\u043E\u043E\u0442\u0437\u044B\u0432".'
  ].join("\n");
  const botToken = String(args.config.botToken || "");
  if (args.customerTelegramId && botToken) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: args.customerTelegramId,
        text: reminderText
      })
    }).catch((err) => {
      console.error("festival review reminder telegram send failed:", err);
    });
  }
  const maxBaseUrl = String(args.config.maxApiBaseUrl || "").replace(/\/$/, "");
  const maxToken = String(args.config.maxApiToken || "");
  const hasMaxConversation = typeof args.customerMaxConversationId === "string" && args.customerMaxConversationId.trim();
  const hasMaxUserId = typeof args.customerMaxUserId === "string" && args.customerMaxUserId.trim();
  if ((hasMaxConversation || hasMaxUserId) && maxBaseUrl && maxToken) {
    const url = hasMaxConversation ? `${maxBaseUrl}/messages` : `${maxBaseUrl}/messages?user_id=${encodeURIComponent(String(args.customerMaxUserId))}`;
    const body = hasMaxConversation ? { conversationId: String(args.customerMaxConversationId), text: reminderText } : { text: reminderText };
    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: maxToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }).catch((err) => {
      console.error("festival review reminder max send failed:", err);
    });
  }
}
const status_put = defineEventHandler(async (event) => {
  var _a;
  const config = useRuntimeConfig(event);
  const access = await requireDashboardAccess(event);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Order id is required" });
  }
  const body = await readBody(event).catch(() => ({}));
  const nextRaw = typeof (body == null ? void 0 : body.nextStatus) === "string" ? body.nextStatus.trim().toLowerCase() : "";
  const comment = typeof (body == null ? void 0 : body.comment) === "string" ? body.comment.trim() : "";
  const nextStatus = nextRaw === "in_progress" || nextRaw === "in-progress" ? "in_progress" : nextRaw === "ready_for_pickup" || nextRaw === "ready-for-pickup" ? "ready_for_pickup" : nextRaw === "out_for_delivery" || nextRaw === "out-for-delivery" ? "out_for_delivery" : nextRaw === "handed_to_customer" || nextRaw === "handed-to-customer" || nextRaw === "done" ? "handed_to_customer" : nextRaw === "cancelled" || nextRaw === "canceled" ? "cancelled" : nextRaw === "new" ? "new" : null;
  if (!nextStatus) {
    throw createError({ statusCode: 400, statusMessage: "Invalid nextStatus" });
  }
  if (nextStatus === "cancelled" && !comment) {
    throw createError({ statusCode: 400, statusMessage: "Comment is required for cancellation" });
  }
  const client = await serverSupabaseServiceRole(event);
  const { data: existing, error: loadError } = await client.from("orders").select("id,order_number,status,metadata,fulfillment_type,total,restaurant_id,city_id,customer_telegram_id,customer_profile_id").eq("id", id).eq("shop_id", access.shopId).maybeSingle();
  if (loadError) {
    console.error("dashboard order status load:", loadError);
    throw createError({ statusCode: 500, statusMessage: "Failed to load order" });
  }
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: "Order not found" });
  }
  const current = normalizeDashboardStatus(existing.status);
  const allowed = getAllowedOrderStatusTransitions(current, existing.fulfillment_type);
  if (!allowed.includes(nextStatus)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid status transition" });
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const entry = {
    at: now,
    label: `\u0421\u0442\u0430\u0442\u0443\u0441: ${statusLabels[current]} \u2192 ${statusLabels[nextStatus]}${comment ? ` (${comment})` : ""}`,
    from: current,
    to: nextStatus,
    source: "dashboard",
    userId: access.userId,
    comment: comment || null
  };
  const newMetadata = mergeMetadataWithTimeline(existing.metadata, entry);
  const { error: updateError } = await client.from("orders").update({
    status: nextStatus,
    metadata: newMetadata,
    updated_at: now
  }).eq("id", id).eq("shop_id", access.shopId);
  if (updateError) {
    console.error("dashboard order status update:", updateError);
    throw createError({ statusCode: 500, statusMessage: "Failed to update order" });
  }
  if (nextStatus === "handed_to_customer") {
    await accrueLoyaltyEarnForPaidOrder(client, String(existing.id), access.shopId);
  }
  const customerProfileId = (existing == null ? void 0 : existing.customer_profile_id) ? String(existing.customer_profile_id) : "";
  let customerMaxUserId = null;
  let customerMaxConversationId = null;
  if (customerProfileId) {
    const { data: profile } = await client.from("profiles").select("max_user_id,max_conversation_id").eq("id", customerProfileId).maybeSingle();
    const rawUserId = profile == null ? void 0 : profile.max_user_id;
    const rawConversationId = profile == null ? void 0 : profile.max_conversation_id;
    customerMaxUserId = typeof rawUserId === "string" && rawUserId.trim() ? rawUserId.trim() : null;
    customerMaxConversationId = typeof rawConversationId === "string" && rawConversationId.trim() ? rawConversationId.trim() : null;
  }
  await dispatchNotificationEvent(event, {
    eventId: crypto.randomUUID(),
    eventType: "ORDER_STATUS_CHANGED",
    occurredAt: now,
    tenantContext: {
      shopId: access.shopId,
      restaurantId: String(existing.restaurant_id || ""),
      cityId: existing.city_id ? String(existing.city_id) : null
    },
    orderContext: {
      orderId: String(existing.id),
      orderNumber: String(existing.order_number || existing.id).slice(0, 32),
      totalAmount: Number(existing.total || 0),
      status: nextStatus,
      fulfillmentType: String(existing.fulfillment_type || "delivery")
    },
    actorContext: {
      customerTelegramId: (_a = existing.customer_telegram_id) != null ? _a : null,
      customerMaxUserId,
      customerMaxConversationId
    }
  });
  if (nextStatus === "handed_to_customer") {
    const reminderDelayMs = resolveReviewReminderDelayMs(config.festivalReviewReminderDelayMs);
    const orderId = String(existing.id);
    const orderNumber = String(existing.order_number || orderId);
    const restaurantId = (existing == null ? void 0 : existing.restaurant_id) ? String(existing.restaurant_id) : null;
    const customerTelegramIdRaw = Number(existing == null ? void 0 : existing.customer_telegram_id);
    const customerTelegramId = Number.isFinite(customerTelegramIdRaw) && customerTelegramIdRaw > 0 ? customerTelegramIdRaw : null;
    setTimeout(() => {
      void sendReviewReminder({
        client,
        config,
        orderId,
        orderNumber,
        shopId: access.shopId,
        restaurantId,
        customerTelegramId,
        customerMaxUserId,
        customerMaxConversationId
      });
    }, reminderDelayMs);
  }
  return { ok: true, status: nextStatus };
});

export { status_put as default };
