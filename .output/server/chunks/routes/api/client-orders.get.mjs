import { y as defineEventHandler, a$ as useRuntimeConfig, t as createError, aI as resolveCustomerProfileId, Q as getMessengerInitDataFromEvent, aY as uniqueNonEmptyTokens, b4 as validateWebAppInitDataAnyToken, P as getMaxBotTokenForShop, aS as serverSupabaseServiceRole, ak as normalizeDashboardStatus } from '../../nitro/nitro.mjs';
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

const clientOrders_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f;
  const config = useRuntimeConfig();
  const tenant = (_a = event.context) == null ? void 0 : _a.tenant;
  const botToken = typeof (tenant == null ? void 0 : tenant.telegramBotToken) === "string" && tenant.telegramBotToken.trim() ? tenant.telegramBotToken.trim() : String(config.botToken || "");
  if (!botToken) {
    throw createError({ statusCode: 500, statusMessage: "Bot token missing" });
  }
  const profileId = await resolveCustomerProfileId(event, botToken).catch(() => "");
  const initData = getMessengerInitDataFromEvent(event);
  const telegramCandidateTokens = uniqueNonEmptyTokens([
    typeof (tenant == null ? void 0 : tenant.telegramBotToken) === "string" ? tenant.telegramBotToken : void 0,
    botToken,
    config.botToken
  ]);
  const telegramUserId = initData ? (_c = (_b = validateWebAppInitDataAnyToken(initData, telegramCandidateTokens)) == null ? void 0 : _b.id) != null ? _c : null : null;
  const tenantIntegrationKeys = (_e = (_d = event.context) == null ? void 0 : _d.tenant) == null ? void 0 : _e.integrationKeys;
  const maxToken = getMaxBotTokenForShop(tenantIntegrationKeys, {
    maxMiniAppBotToken: config.maxMiniAppBotToken,
    maxApiToken: config.maxApiToken
  });
  const maxCandidateTokens = uniqueNonEmptyTokens([
    typeof (tenantIntegrationKeys == null ? void 0 : tenantIntegrationKeys.max_bot_token) === "string" ? tenantIntegrationKeys.max_bot_token : void 0,
    config.maxMiniAppBotToken,
    config.maxApiToken,
    maxToken
  ]);
  const maxUserId = initData ? String(((_f = validateWebAppInitDataAnyToken(initData, maxCandidateTokens)) == null ? void 0 : _f.id) || "").trim() : "";
  const hasMessengerIdentity = telegramUserId != null || !!maxUserId;
  if (!profileId && !hasMessengerIdentity) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const client = await serverSupabaseServiceRole(event);
  let ordersQuery = client.from("orders").select("id,shop_id,restaurant_id,status,fulfillment_type,payment_method,subtotal,delivery_cost,total,items,created_at").order("created_at", { ascending: false }).limit(200);
  if (profileId) {
    ordersQuery = ordersQuery.eq("customer_profile_id", profileId);
  } else if (telegramUserId != null) {
    ordersQuery = ordersQuery.eq("customer_telegram_id", telegramUserId);
  } else if (maxUserId) {
    const { data: maxProfile } = await client.from("profiles").select("id").eq("max_user_id", maxUserId).maybeSingle();
    const maxProfileId = (maxProfile == null ? void 0 : maxProfile.id) ? String(maxProfile.id) : "";
    if (!maxProfileId) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
    ordersQuery = ordersQuery.eq("customer_profile_id", maxProfileId);
  }
  const { data: ordersData, error: ordersError } = await ordersQuery;
  if (ordersError) {
    console.error("Failed to load client orders:", ordersError);
    throw createError({ statusCode: 500, statusMessage: "Failed to load orders" });
  }
  const rows = ordersData != null ? ordersData : [];
  const shopIds = Array.from(new Set(rows.map((x) => x.shop_id).filter(Boolean)));
  const restaurantIds = Array.from(new Set(rows.map((x) => x.restaurant_id).filter((x) => !!x)));
  const orderIds = rows.map((r) => r.id);
  const reviewByOrderId = /* @__PURE__ */ new Set();
  if (orderIds.length) {
    const { data: revRows } = await client.from("shop_reviews").select("order_id").in("order_id", orderIds);
    for (const rv of revRows != null ? revRows : []) {
      const oid = typeof (rv == null ? void 0 : rv.order_id) === "string" ? String(rv.order_id) : "";
      if (oid) reviewByOrderId.add(oid);
    }
  }
  const shopsMap = /* @__PURE__ */ new Map();
  if (shopIds.length) {
    const { data: shopsData } = await client.from("shops").select("id,name").in("id", shopIds);
    for (const row of shopsData != null ? shopsData : []) {
      if ((row == null ? void 0 : row.id) && (row == null ? void 0 : row.name)) shopsMap.set(row.id, row.name);
    }
  }
  const restaurantsMap = /* @__PURE__ */ new Map();
  if (restaurantIds.length) {
    const { data: restaurantsData } = await client.from("restaurants").select("id,name").in("id", restaurantIds);
    for (const row of restaurantsData != null ? restaurantsData : []) {
      if ((row == null ? void 0 : row.id) && (row == null ? void 0 : row.name)) restaurantsMap.set(row.id, row.name);
    }
  }
  const activeStatuses = /* @__PURE__ */ new Set(["new", "in_progress", "ready_for_pickup", "out_for_delivery"]);
  const items = rows.map((row) => {
    const status = normalizeDashboardStatus(row.status);
    const safeItems = Array.isArray(row.items) ? row.items : [];
    const itemsCount = safeItems.reduce((sum, item) => sum + (Number(item == null ? void 0 : item.quantity) || 0), 0);
    const itemsPreview = safeItems.slice(0, 5).map((item) => ({
      name: typeof (item == null ? void 0 : item.name) === "string" && item.name.trim() ? item.name.trim() : "\u041F\u043E\u0437\u0438\u0446\u0438\u044F",
      quantity: Number(item == null ? void 0 : item.quantity) > 0 ? Number(item.quantity) : 1
    }));
    const title = restaurantsMap.get(row.restaurant_id || "") || shopsMap.get(row.shop_id) || "\u0420\u0435\u0441\u0442\u043E\u0440\u0430\u043D";
    return {
      id: row.id,
      shopId: row.shop_id,
      restaurantId: row.restaurant_id,
      restaurantName: title,
      status,
      isActive: activeStatuses.has(status),
      fulfillmentType: row.fulfillment_type || "delivery",
      paymentMethod: row.payment_method || "cash",
      subtotal: row.subtotal || 0,
      deliveryCost: row.delivery_cost || 0,
      total: row.total || 0,
      itemsCount,
      itemsPreview,
      createdAt: row.created_at,
      hasShopReview: reviewByOrderId.has(row.id)
    };
  });
  return { ok: true, items };
});

export { clientOrders_get as default };
