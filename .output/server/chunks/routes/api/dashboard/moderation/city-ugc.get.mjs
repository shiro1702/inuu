import { y as defineEventHandler, aB as requireDashboardAccess, t as createError, T as getQuery, aS as serverSupabaseServiceRole } from '../../../../nitro/nitro.mjs';
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

const cityUgc_get = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can access city moderation panel" });
  }
  const query = getQuery(event);
  const status = typeof query.status === "string" ? query.status.trim() : "pending";
  const cityId = typeof query.city_id === "string" ? query.city_id.trim() : "";
  const festivalId = typeof query.festival_id === "string" ? query.festival_id.trim() : "";
  const kind = typeof query.kind === "string" ? query.kind.trim() : "";
  const limit = Math.min(Math.max(Number(query.limit) || 100, 1), 300);
  const client = await serverSupabaseServiceRole(event);
  const { data: restaurants } = await client.from("restaurants").select("id,city_id,name").eq("shop_id", access.shopId);
  const restaurantRows = restaurants != null ? restaurants : [];
  restaurantRows.map((x) => x.id);
  const cityIds = Array.from(new Set(restaurantRows.map((x) => x.city_id).filter((x) => !!x)));
  const { data: cities } = cityIds.length ? await client.from("cities").select("id,name").in("id", cityIds) : { data: [] };
  const cityById = new Map((cities != null ? cities : []).map((x) => [String(x.id), String(x.name || "\u2014")]));
  const restaurantById = new Map(restaurantRows.map((x) => [x.id, x]));
  let dbQuery = client.from("festival_ugc_submissions").select("id,festival_id,shop_id,restaurant_id,order_id,kind,rating,category,media_url,status,publish_to_menu,publish_to_feed,created_at").eq("shop_id", access.shopId).order("created_at", { ascending: false }).limit(limit);
  if (status && status !== "all") dbQuery = dbQuery.eq("status", status);
  if (festivalId) dbQuery = dbQuery.eq("festival_id", festivalId);
  if (kind && kind !== "all") dbQuery = dbQuery.eq("kind", kind);
  const { data: submissions, error } = await dbQuery;
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || "Failed to load city moderation queue" });
  }
  const festivalIds = Array.from(new Set((submissions != null ? submissions : []).map((x) => String(x.festival_id || "")).filter(Boolean)));
  const { data: festivals } = festivalIds.length ? await client.from("festivals").select("id,slug,name").in("id", festivalIds) : { data: [] };
  const festivalById = new Map((festivals != null ? festivals : []).map((x) => [String(x.id), { name: String(x.name || ""), slug: String(x.slug || "") }]));
  const items = (submissions != null ? submissions : []).map((x) => {
    var _a, _b;
    const restaurant = restaurantById.get(String(x.restaurant_id || ""));
    const city = (restaurant == null ? void 0 : restaurant.city_id) ? cityById.get(restaurant.city_id) || "\u2014" : "\u2014";
    return {
      id: String(x.id),
      festivalId: String(x.festival_id || ""),
      festivalName: ((_a = festivalById.get(String(x.festival_id || ""))) == null ? void 0 : _a.name) || "\u0424\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044C",
      festivalSlug: ((_b = festivalById.get(String(x.festival_id || ""))) == null ? void 0 : _b.slug) || "",
      restaurantId: x.restaurant_id ? String(x.restaurant_id) : "",
      restaurantName: (restaurant == null ? void 0 : restaurant.name) || "\u2014",
      cityId: (restaurant == null ? void 0 : restaurant.city_id) || "",
      cityName: city,
      orderId: x.order_id ? String(x.order_id) : null,
      kind: x.kind === "story" ? "story" : "video_review",
      rating: typeof x.rating === "number" ? x.rating : null,
      category: x.category || null,
      mediaUrl: String(x.media_url || ""),
      status: String(x.status || "pending"),
      publishToMenu: x.publish_to_menu === true,
      publishToFeed: x.publish_to_feed === true,
      createdAt: String(x.created_at || "")
    };
  }).filter((x) => cityId ? x.cityId === cityId : true);
  return {
    ok: true,
    filters: {
      cities: cityIds.map((id) => ({ id, name: cityById.get(id) || id })),
      festivals: (festivals != null ? festivals : []).map((x) => ({ id: String(x.id), name: String(x.name || "\u0424\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044C"), slug: String(x.slug || "") }))
    },
    items
  };
});

export { cityUgc_get as default };
