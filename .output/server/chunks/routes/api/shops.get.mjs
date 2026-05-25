import { y as defineEventHandler, aW as setResponseHeader, T as getQuery, a$ as useRuntimeConfig, t as createError, aS as serverSupabaseServiceRole, R as getOrganizationSettings, a0 as getStyleRecord } from '../../nitro/nitro.mjs';
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

function normalizeRestaurants(raw) {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list.filter((r) => !!r && typeof r === "object" && typeof r.id === "string").map((r) => ({
    ...r,
    supports_dine_in: Boolean(r.supports_dine_in),
    festival_fulfillment_type: ["delivery", "pickup", "dine-in"].includes(String(r.festival_fulfillment_type)) ? r.festival_fulfillment_type : null
  }));
}
const shops_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  setResponseHeader(event, "Cache-Control", "public, max-age=30, s-maxage=60, stale-while-revalidate=120");
  const query = getQuery(event);
  const config = useRuntimeConfig(event);
  const requestedCitySlug = typeof query.city_slug === "string" ? query.city_slug.trim() : "";
  const requestedFestivalSlug = typeof query.festival_slug === "string" ? query.festival_slug.trim() : "";
  const defaultCitySlug = typeof ((_a = config.public) == null ? void 0 : _a.defaultCitySlug) === "string" ? config.public.defaultCitySlug.trim() : "";
  const citySlug = requestedCitySlug || defaultCitySlug;
  if (!citySlug) {
    throw createError({ statusCode: 400, message: "city_slug is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const { data: cityData, error: cityError } = await client.from("cities").select("id").eq("slug", citySlug).eq("is_active", true).maybeSingle();
  if (cityError) {
    console.error("Failed to resolve city slug:", cityError);
    throw createError({ statusCode: 500, message: "Failed to resolve city" });
  }
  if (!(cityData == null ? void 0 : cityData.id)) {
    return { ok: true, items: [] };
  }
  const cityId = cityData.id;
  let activeFestival = null;
  const nowTs = Date.now();
  const { data: festivalRows, error: festivalError } = await client.from("festivals").select("id,slug,name,description,pulse_stats,schedule,starts_at,ends_at").eq("city_id", cityId).eq("is_active", true).order("created_at", { ascending: false }).limit(10);
  if (festivalError) {
    console.error("Failed to resolve active festival:", festivalError);
  } else if (Array.isArray(festivalRows)) {
    const current = requestedFestivalSlug ? festivalRows.find((row) => typeof row.slug === "string" && row.slug.trim() === requestedFestivalSlug) : festivalRows.find((row) => {
      const startsAt = typeof row.starts_at === "string" ? Date.parse(row.starts_at) : NaN;
      const endsAt = typeof row.ends_at === "string" ? Date.parse(row.ends_at) : NaN;
      const startsOk = Number.isNaN(startsAt) || startsAt <= nowTs;
      const endsOk = Number.isNaN(endsAt) || endsAt >= nowTs;
      return startsOk && endsOk;
    });
    if (current == null ? void 0 : current.id) {
      activeFestival = current;
    }
  }
  let data = null;
  let error = null;
  const primary = await client.from("shops").select("id,slug,name,ui_settings,is_active,restaurants!restaurants_shop_id_fkey!inner(id,name,address,lat,lon,city_id,festival_id,is_festival,festival_fulfillment_type,is_active,supports_delivery,supports_pickup,supports_dine_in)").eq("is_active", true).eq("restaurants.city_id", cityId).eq("restaurants.is_active", true).order("name", { ascending: true });
  data = primary.data;
  error = primary.error;
  if (error && error.code === "42703") {
    const fallback = await client.from("shops").select("id,slug,name,ui_settings,is_active,restaurants!restaurants_shop_id_fkey!inner(id,name,address,lat,lon,city_id,is_active,supports_delivery,supports_pickup)").eq("is_active", true).eq("restaurants.city_id", cityId).eq("restaurants.is_active", true).order("name", { ascending: true });
    data = (_c = (_b = fallback.data) == null ? void 0 : _b.map((row) => ({
      ...row,
      restaurants: normalizeRestaurants(row.restaurants).map((r) => ({
        ...r,
        supports_dine_in: false,
        festival_fulfillment_type: null
      }))
    }))) != null ? _c : null;
    error = fallback.error;
  }
  if (!error && activeFestival) {
    data = (data != null ? data : []).map((row) => ({
      ...row,
      restaurants: normalizeRestaurants(row.restaurants).filter((r) => r.is_festival === true && r.festival_id === activeFestival.id)
    })).filter((row) => normalizeRestaurants(row.restaurants).length > 0);
  } else if (!error) {
    data = (data != null ? data : []).map((row) => ({
      ...row,
      restaurants: normalizeRestaurants(row.restaurants).filter((r) => r.is_festival !== true)
    })).filter((row) => normalizeRestaurants(row.restaurants).length > 0);
  }
  if (error) {
    console.error("Failed to load shops:", error);
    throw createError({ statusCode: 500, message: "Failed to load restaurants list" });
  }
  const rows = data != null ? data : [];
  const firstByShop = /* @__PURE__ */ new Map();
  const fulfillmentAgg = /* @__PURE__ */ new Map();
  for (const row of rows) {
    if (!firstByShop.has(row.id)) firstByShop.set(row.id, row);
    let agg = fulfillmentAgg.get(row.id);
    if (!agg) {
      agg = {
        hasDelivery: false,
        hasPickup: false,
        hasDineIn: false,
        pickupRestaurantIds: /* @__PURE__ */ new Set(),
        dineInRestaurantIds: /* @__PURE__ */ new Set(),
        pickupPoints: [],
        dineInPoints: []
      };
      fulfillmentAgg.set(row.id, agg);
    }
    for (const r of normalizeRestaurants(row.restaurants)) {
      const festivalMode = activeFestival ? r.festival_fulfillment_type : null;
      const supportsDelivery = festivalMode ? festivalMode === "delivery" : r.supports_delivery;
      const supportsPickup = festivalMode ? festivalMode === "pickup" : r.supports_pickup;
      const supportsDineIn = festivalMode ? festivalMode === "dine-in" : r.supports_dine_in;
      if (supportsDelivery) agg.hasDelivery = true;
      if (supportsPickup && !agg.pickupRestaurantIds.has(r.id)) {
        agg.pickupRestaurantIds.add(r.id);
        agg.hasPickup = true;
        agg.pickupPoints.push({
          restaurantId: r.id,
          name: r.name,
          address: r.address,
          lat: typeof r.lat === "number" && Number.isFinite(r.lat) ? r.lat : null,
          lon: typeof r.lon === "number" && Number.isFinite(r.lon) ? r.lon : null
        });
      }
      if (supportsDineIn && !agg.dineInRestaurantIds.has(r.id)) {
        agg.dineInRestaurantIds.add(r.id);
        agg.hasDineIn = true;
        agg.dineInPoints.push({
          restaurantId: r.id,
          name: r.name,
          address: r.address,
          lat: typeof r.lat === "number" && Number.isFinite(r.lat) ? r.lat : null,
          lon: typeof r.lon === "number" && Number.isFinite(r.lon) ? r.lon : null
        });
      }
    }
  }
  const uniqueRows = Array.from(firstByShop.values());
  const items = await Promise.all(uniqueRows.map(async (row) => {
    var _a2, _b2, _c2, _d2, _e, _f, _g, _h, _i, _j, _k, _l;
    const agg = fulfillmentAgg.get(row.id);
    let fulfillment = {
      delivery: Boolean(agg == null ? void 0 : agg.hasDelivery),
      pickup: Boolean(agg == null ? void 0 : agg.hasPickup),
      dineIn: Boolean(agg == null ? void 0 : agg.hasDineIn)
    };
    let pickupPoints = [];
    let dineInPoints = [];
    try {
      const org = await getOrganizationSettings(event, row.id);
      const modes = new Set(org.ops.fulfillmentTypes);
      fulfillment = {
        delivery: modes.has("delivery") && Boolean(agg == null ? void 0 : agg.hasDelivery),
        pickup: modes.has("pickup") && Boolean(agg == null ? void 0 : agg.hasPickup),
        dineIn: modes.has("dine-in") && Boolean(agg == null ? void 0 : agg.hasDineIn)
      };
      pickupPoints = fulfillment.pickup && ((_a2 = agg == null ? void 0 : agg.pickupPoints) == null ? void 0 : _a2.length) ? agg.pickupPoints : [];
      dineInPoints = fulfillment.dineIn && ((_b2 = agg == null ? void 0 : agg.dineInPoints) == null ? void 0 : _b2.length) ? agg.dineInPoints : [];
    } catch {
      pickupPoints = fulfillment.pickup && ((_c2 = agg == null ? void 0 : agg.pickupPoints) == null ? void 0 : _c2.length) ? agg.pickupPoints : [];
      dineInPoints = fulfillment.dineIn && ((_d2 = agg == null ? void 0 : agg.dineInPoints) == null ? void 0 : _d2.length) ? agg.dineInPoints : [];
    }
    try {
      const record = await getStyleRecord(event, row.id);
      const cfg = record.config;
      return {
        id: row.id,
        slug: row.slug,
        name: cfg.identity.name || row.name,
        logoUrl: cfg.identity.logoUrl || (typeof ((_e = row.ui_settings) == null ? void 0 : _e.logo_url) === "string" ? (_f = row.ui_settings) == null ? void 0 : _f.logo_url : null),
        description: cfg.identity.shortDescription || (typeof ((_g = row.ui_settings) == null ? void 0 : _g.description) === "string" ? (_h = row.ui_settings) == null ? void 0 : _h.description : null),
        fulfillment,
        pickupPoints,
        dineInPoints
      };
    } catch {
      return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        logoUrl: typeof ((_i = row.ui_settings) == null ? void 0 : _i.logo_url) === "string" ? (_j = row.ui_settings) == null ? void 0 : _j.logo_url : null,
        description: typeof ((_k = row.ui_settings) == null ? void 0 : _k.description) === "string" ? (_l = row.ui_settings) == null ? void 0 : _l.description : null,
        fulfillment,
        pickupPoints,
        dineInPoints
      };
    }
  }));
  return {
    ok: true,
    items,
    festival: activeFestival ? {
      id: activeFestival.id,
      slug: activeFestival.slug,
      name: activeFestival.name,
      description: activeFestival.description,
      pulseStats: (_d = activeFestival.pulse_stats) != null ? _d : {},
      schedule: Array.isArray(activeFestival.schedule) ? activeFestival.schedule : []
    } : null
  };
});

export { shops_get as default };
