import { y as defineEventHandler, aA as readBody, t as createError, aS as serverSupabaseServiceRole, O as getHeader } from '../../../nitro/nitro.mjs';
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

const yookassa_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const payload = await readBody(event);
  const providerPaymentId = typeof ((_a = payload == null ? void 0 : payload.object) == null ? void 0 : _a.id) === "string" ? payload.object.id.trim() : "";
  const eventName = typeof (payload == null ? void 0 : payload.event) === "string" ? payload.event : "";
  const eventIdRaw = typeof (payload == null ? void 0 : payload.id) === "string" ? payload.id : "";
  const eventId = eventIdRaw || `${eventName}:${providerPaymentId}:${((_b = payload == null ? void 0 : payload.object) == null ? void 0 : _b.status) || "unknown"}`;
  if (!providerPaymentId) {
    throw createError({ statusCode: 400, statusMessage: "Invalid YooKassa webhook payload: object.id is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const insertEvent = await client.from("payment_webhook_events").insert({
    provider: "yookassa",
    event_id: eventId,
    provider_payment_id: providerPaymentId,
    payload: payload != null ? payload : {},
    processed: false
  });
  if (insertEvent.error && insertEvent.error.code !== "23505") {
    throw createError({ statusCode: 500, statusMessage: "Failed to persist webhook event" });
  }
  if (insertEvent.error && insertEvent.error.code === "23505") {
    return { ok: true, duplicate: true };
  }
  const { data: intent, error: intentError } = await client.from("order_payment_intents").select("id,order_id,shop_id,status").eq("provider", "yookassa").eq("provider_payment_id", providerPaymentId).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (intentError || !intent) {
    throw createError({ statusCode: 404, statusMessage: "Payment intent not found for webhook event" });
  }
  const paymentStatus = String(((_c = payload == null ? void 0 : payload.object) == null ? void 0 : _c.status) || "").toLowerCase();
  const nextOrderPaymentStatus = paymentStatus === "succeeded" ? "paid" : paymentStatus === "canceled" ? "canceled" : paymentStatus === "pending" ? "pending" : "failed";
  const orderUpdatePayload = {
    payment_status: nextOrderPaymentStatus,
    payment_provider: "yookassa",
    payment_id: providerPaymentId
  };
  if (nextOrderPaymentStatus === "paid") {
    orderUpdatePayload.paid_at = (/* @__PURE__ */ new Date()).toISOString();
  }
  const { error: updateOrderError } = await client.from("orders").update(orderUpdatePayload).eq("id", intent.order_id).eq("shop_id", intent.shop_id);
  if (updateOrderError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to update order payment status" });
  }
  const { error: updateIntentError } = await client.from("order_payment_intents").update({
    status: paymentStatus || "unknown",
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", intent.id);
  if (updateIntentError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to update payment intent status" });
  }
  const signature = getHeader(event, "x-yookassa-signature") || "";
  const { error: markProcessedError } = await client.from("payment_webhook_events").update({
    processed: true,
    processed_at: (/* @__PURE__ */ new Date()).toISOString(),
    payload: { ...payload != null ? payload : {}, __headers: { x_yookassa_signature: signature } }
  }).eq("provider", "yookassa").eq("event_id", eventId);
  if (markProcessedError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to mark webhook event as processed" });
  }
  return { ok: true };
});

export { yookassa_post as default };
