import { y as defineEventHandler, aB as requireDashboardAccess, T as getQuery, aS as serverSupabaseServiceRole, t as createError, ak as normalizeDashboardStatus } from '../../../nitro/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  const q = getQuery(event);
  const period = typeof q.period === "string" ? q.period : "all";
  const statusFilter = typeof q.status === "string" && q.status !== "all" ? q.status.toLowerCase() : null;
  const restaurantId = typeof q.restaurant_id === "string" && q.restaurant_id.trim() ? q.restaurant_id.trim() : null;
  const fulfillmentType = typeof q.fulfillment_type === "string" && q.fulfillment_type.trim() ? q.fulfillment_type.trim().toLowerCase() : null;
  const client = await serverSupabaseServiceRole(event);
  const buildOrdersQuery = (includeOrderNumber) => {
    const selectFields = includeOrderNumber ? `
      id,
      order_number,
      shop_id,
      restaurant_id,
      city_id,
      status,
      fulfillment_type,
      payment_method,
      external_order_id,
      external_status,
      last_sync_error,
      subtotal,
      delivery_cost,
      total,
      items,
      created_at,
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
      external_order_id,
      external_status,
      last_sync_error,
      subtotal,
      delivery_cost,
      total,
      items,
      created_at,
      customer_telegram_id,
      customer_profile_id
    `;
    let query = client.from("orders").select(selectFields).eq("shop_id", access.shopId).order("created_at", { ascending: false }).limit(500);
    if (restaurantId) {
      query = query.eq("restaurant_id", restaurantId);
    }
    if (fulfillmentType) {
      query = query.eq("fulfillment_type", fulfillmentType);
    }
    if (statusFilter && ["new", "in_progress", "ready_for_pickup", "out_for_delivery", "handed_to_customer", "done", "cancelled"].includes(
      statusFilter
    )) {
      if (statusFilter === "handed_to_customer") {
        query = query.in("status", ["handed_to_customer", "done", "completed"]);
      } else if (statusFilter === "done") {
        query = query.in("status", ["done", "completed", "handed_to_customer"]);
      } else {
        query = query.eq("status", statusFilter);
      }
    }
    const now = /* @__PURE__ */ new Date();
    if (period === "today") {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      query = query.gte("created_at", start.toISOString());
    } else if (period === "week") {
      const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
      query = query.gte("created_at", start.toISOString());
    }
    return query;
  };
  let { data, error } = await buildOrdersQuery(true);
  if (error && String((error == null ? void 0 : error.message) || "").includes("order_number")) {
    const fallback = await buildOrdersQuery(false);
    data = fallback.data;
    error = fallback.error;
  }
  if (error) {
    console.error("dashboard orders list:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to load orders" });
  }
  const rows = data != null ? data : [];
  const restaurantIds = Array.from(new Set(rows.map((r) => r.restaurant_id).filter((x) => !!x)));
  const cityIds = Array.from(new Set(rows.map((r) => r.city_id).filter((x) => !!x)));
  const restaurantsMap = /* @__PURE__ */ new Map();
  if (restaurantIds.length) {
    const { data: rdata } = await client.from("restaurants").select("id,name").in("id", restaurantIds).eq("shop_id", access.shopId);
    for (const r of rdata != null ? rdata : []) {
      if ((r == null ? void 0 : r.id) && (r == null ? void 0 : r.name)) restaurantsMap.set(r.id, r.name);
    }
  }
  const citiesMap = /* @__PURE__ */ new Map();
  if (cityIds.length) {
    const { data: cdata } = await client.from("cities").select("id,name").in("id", cityIds);
    for (const c of cdata != null ? cdata : []) {
      if ((c == null ? void 0 : c.id) && (c == null ? void 0 : c.name)) citiesMap.set(c.id, c.name);
    }
  }
  let shopName = "\u2014";
  const { data: shopRow } = await client.from("shops").select("name").eq("id", access.shopId).maybeSingle();
  if (shopRow == null ? void 0 : shopRow.name) shopName = shopRow.name;
  const items = rows.map((row) => {
    var _a, _b, _c, _d, _e;
    const safeItems = Array.isArray(row.items) ? row.items : [];
    const itemsCount = safeItems.reduce((sum, item) => sum + (Number(item == null ? void 0 : item.quantity) || 0), 0);
    const itemsPreview = safeItems.map((item) => {
      const name = typeof (item == null ? void 0 : item.name) === "string" && item.name.trim() ? item.name.trim() : "\u0422\u043E\u0432\u0430\u0440";
      const quantity = Number(item == null ? void 0 : item.quantity) > 0 ? Math.floor(Number(item.quantity)) : 1;
      return { name, quantity };
    });
    const st = normalizeDashboardStatus(row.status);
    return {
      id: row.id,
      orderNumber: row.order_number || null,
      shopId: row.shop_id,
      restaurantId: row.restaurant_id,
      restaurantName: row.restaurant_id ? (_a = restaurantsMap.get(row.restaurant_id)) != null ? _a : "\u2014" : "\u2014",
      cityId: row.city_id,
      cityName: row.city_id ? (_b = citiesMap.get(row.city_id)) != null ? _b : "\u2014" : "\u2014",
      brand: shopName,
      status: st,
      fulfillmentType: row.fulfillment_type || "delivery",
      paymentMethod: row.payment_method || "cash",
      externalOrderId: row.external_order_id || null,
      externalStatus: row.external_status || null,
      lastSyncError: row.last_sync_error || null,
      subtotal: (_c = row.subtotal) != null ? _c : 0,
      deliveryCost: (_d = row.delivery_cost) != null ? _d : 0,
      total: (_e = row.total) != null ? _e : 0,
      itemsCount,
      itemsPreview,
      createdAt: row.created_at,
      customerTelegramId: row.customer_telegram_id,
      customerProfileId: row.customer_profile_id
    };
  });
  return { ok: true, items };
});

export { index_get as default };
