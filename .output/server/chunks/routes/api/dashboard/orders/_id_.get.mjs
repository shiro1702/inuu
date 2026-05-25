import { y as defineEventHandler, aB as requireDashboardAccess, Y as getRouterParam, t as createError, aS as serverSupabaseServiceRole, as as parseOrderMetadata, al as normalizeOrderItemsJson, ak as normalizeDashboardStatus, aa as isShopFeatureEnabled } from '../../../../nitro/nitro.mjs';
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

const _id__get = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const access = await requireDashboardAccess(event);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Order id is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const runLoad = async (includeOrderNumber) => {
    const selectFields = includeOrderNumber ? `
      id,
      order_number,
      shop_id,
      restaurant_id,
      city_id,
      status,
      fulfillment_type,
      payment_method,
      subtotal,
      delivery_cost,
      total,
      items,
      address,
      pickup_point,
      comment,
      metadata,
      created_at,
      updated_at,
      customer_telegram_id,
      customer_profile_id
    ` : `
      id,
      shop_id,
      restaurant_id,
      city_id,
      status,
      fulfillment_type,
      payment_method,
      subtotal,
      delivery_cost,
      total,
      items,
      address,
      pickup_point,
      comment,
      metadata,
      created_at,
      updated_at,
      customer_telegram_id,
      customer_profile_id
    `;
    return client.from("orders").select(selectFields).eq("id", id).eq("shop_id", access.shopId).maybeSingle();
  };
  let { data, error } = await runLoad(true);
  if (error && String((error == null ? void 0 : error.message) || "").includes("order_number")) {
    const fallback = await runLoad(false);
    data = fallback.data;
    error = fallback.error;
  }
  if (error) {
    console.error("dashboard order detail:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to load order" });
  }
  if (!data) {
    throw createError({ statusCode: 404, statusMessage: "Order not found" });
  }
  const row = data;
  const { timeline } = parseOrderMetadata(row.metadata);
  const normalizedItems = normalizeOrderItemsJson(row.items);
  const st = normalizeDashboardStatus(row.status);
  let restaurantName = "\u2014";
  if (row.restaurant_id) {
    const { data: r } = await client.from("restaurants").select("name").eq("id", row.restaurant_id).eq("shop_id", access.shopId).maybeSingle();
    if (r == null ? void 0 : r.name) restaurantName = r.name;
  }
  let cityName = "\u2014";
  if (row.city_id) {
    const { data: c } = await client.from("cities").select("name").eq("id", row.city_id).maybeSingle();
    if (c == null ? void 0 : c.name) cityName = c.name;
  }
  let shopName = "\u2014";
  const { data: shopRow } = await client.from("shops").select("name").eq("id", access.shopId).maybeSingle();
  if (shopRow == null ? void 0 : shopRow.name) shopName = shopRow.name;
  let reviewPrompt = {
    moduleEnabled: false,
    hasReview: false,
    reviewRating: null,
    prompts: []
  };
  const reviewsEnabled = await isShopFeatureEnabled(event, access.shopId, "reputation_reviews_pro");
  if (reviewsEnabled) {
    reviewPrompt.moduleEnabled = true;
    const [{ data: rev }, { data: prompts }] = await Promise.all([
      client.from("shop_reviews").select("id,rating").eq("order_id", id).eq("shop_id", access.shopId).maybeSingle(),
      client.from("shop_order_review_prompts").select("channel,status,scheduled_for,sent_at,last_error,trigger_kind").eq("order_id", id).eq("shop_id", access.shopId)
    ]);
    if (rev == null ? void 0 : rev.id) {
      reviewPrompt.hasReview = true;
      reviewPrompt.reviewRating = typeof rev.rating === "number" ? Number(rev.rating) : null;
    }
    reviewPrompt.prompts = (prompts != null ? prompts : []).map((p) => ({
      channel: String(p.channel || ""),
      status: String(p.status || ""),
      scheduledFor: p.scheduled_for ? String(p.scheduled_for) : null,
      sentAt: p.sent_at ? String(p.sent_at) : null,
      lastError: typeof p.last_error === "string" ? p.last_error : null,
      triggerKind: String(p.trigger_kind || "")
    }));
  }
  return {
    ok: true,
    order: {
      id: row.id,
      orderNumber: row.order_number || null,
      shopId: row.shop_id,
      restaurantId: row.restaurant_id,
      restaurantName,
      cityId: row.city_id,
      cityName,
      brand: shopName,
      status: st,
      fulfillmentType: row.fulfillment_type || "delivery",
      paymentMethod: row.payment_method || "cash",
      subtotal: (_a = row.subtotal) != null ? _a : 0,
      deliveryCost: (_b = row.delivery_cost) != null ? _b : 0,
      total: (_c = row.total) != null ? _c : 0,
      items: normalizedItems,
      address: row.address,
      pickupPoint: row.pickup_point,
      comment: row.comment,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      customerTelegramId: row.customer_telegram_id,
      customerProfileId: row.customer_profile_id,
      timeline: [...timeline].sort((a, b) => b.at.localeCompare(a.at)),
      reviewPrompt
    }
  };
});

export { _id__get as default };
