import { y as defineEventHandler, aB as requireDashboardAccess, T as getQuery, aS as serverSupabaseServiceRole, t as createError, R as getOrganizationSettings, an as normalizeWeeklyWorkingHours, N as getDefaultOrganizationSettings } from '../../../nitro/nitro.mjs';
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

let cachedRestaurantsSelectMode = "primary";
function isMissingColumnError(error) {
  if (!error || typeof error !== "object") return false;
  const code = typeof error.code === "string" ? error.code : "";
  const message = typeof error.message === "string" ? error.message.toLowerCase() : "";
  const details = typeof error.details === "string" ? error.details.toLowerCase() : "";
  return code === "42703" || code === "PGRST204" || message.includes("column") || details.includes("column");
}
const restaurants_get = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  const query = getQuery(event);
  const compact = query.compact === "1" || query.compact === "true";
  const branchList = query.branchList === "1" || query.branchList === "true";
  const clientPromise = serverSupabaseServiceRole(event);
  if (compact) {
    const client2 = await clientPromise;
    const page = Math.max(Number(query.page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(query.pageSize) || 100, 1), 200);
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const { data: data2, error: error2 } = await client2.from("restaurants").select("id,name").eq("shop_id", access.shopId).order("created_at", { ascending: false }).range(from, to);
    if (error2) {
      console.error("Failed to load compact dashboard restaurants:", error2);
      throw createError({ statusCode: 500, statusMessage: "Failed to load restaurants" });
    }
    const rows2 = data2 != null ? data2 : [];
    return {
      ok: true,
      shopId: access.shopId,
      items: rows2.slice(0, pageSize).map((row) => ({
        id: row.id,
        name: row.name
      })),
      pagination: {
        page,
        pageSize,
        hasNext: rows2.length > pageSize,
        hasPrev: page > 1
      }
    };
  }
  if (branchList) {
    const client2 = await clientPromise;
    const { data: data2, error: error2 } = await client2.from("restaurants").select("id,name,address,city_id,cities(name),is_active,created_at").eq("shop_id", access.shopId).order("created_at", { ascending: false });
    if (error2) {
      console.error("Failed to load branch-list dashboard restaurants:", error2);
      throw createError({ statusCode: 500, statusMessage: "Failed to load restaurants" });
    }
    return {
      ok: true,
      shopId: access.shopId,
      items: (data2 != null ? data2 : []).map((row) => {
        const cityRow = Array.isArray(row.cities) ? row.cities[0] : row.cities;
        const cityName = typeof (cityRow == null ? void 0 : cityRow.name) === "string" && cityRow.name.trim().length ? cityRow.name.trim() : null;
        return {
          id: row.id,
          name: row.name,
          address: row.address,
          cityId: typeof row.city_id === "string" ? row.city_id : null,
          cityName,
          isActive: row.is_active === true,
          createdAt: row.created_at
        };
      })
    };
  }
  const [org, client] = await Promise.all([
    getOrganizationSettings(event, access.shopId),
    clientPromise
  ]);
  const allowedSet = new Set(org.ops.fulfillmentTypes);
  const hallMode = org.ops.dineInHallMode;
  const hallOrderingEnabled = allowedSet.has("dine-in") && hallMode !== "qr-menu-browse";
  let data = null;
  let error = null;
  const runRestaurantsQuery = async (mode) => {
    const selectByMode = {
      primary: "id,name,address,city_id,cities(name),lat,lon,supports_delivery,supports_pickup,supports_dine_in,supports_qr_menu,supports_showcase_order,festival_id,is_festival,festival_fulfillment_type,use_organization_working_hours,working_hours,is_active,created_at",
      fallback: "id,name,address,city_id,cities(name),lat,lon,supports_delivery,supports_pickup,supports_dine_in,supports_qr_menu,supports_showcase_order,is_active,created_at",
      legacy: "id,name,address,city_id,cities(name),lat,lon,supports_delivery,supports_pickup,supports_dine_in,is_active,created_at"
    };
    return client.from("restaurants").select(selectByMode[mode]).eq("shop_id", access.shopId).order("created_at", { ascending: false });
  };
  const modesInOrder = ["primary", "fallback", "legacy"];
  const startIndex = modesInOrder.indexOf(cachedRestaurantsSelectMode);
  const modesToTry = [...modesInOrder.slice(startIndex), ...modesInOrder.slice(0, startIndex)];
  for (const mode of modesToTry) {
    const result = await runRestaurantsQuery(mode);
    data = result.data;
    error = result.error;
    if (!error) {
      cachedRestaurantsSelectMode = mode;
      break;
    }
    if (!isMissingColumnError(error)) {
      break;
    }
  }
  if (error) {
    console.error("Failed to load dashboard restaurants:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to load restaurants" });
  }
  const rows = data != null ? data : [];
  const fallbackWorkingHours = getDefaultOrganizationSettings().ops.workingHours;
  return {
    ok: true,
    shopId: access.shopId,
    items: rows.map((row) => {
      const cityRow = Array.isArray(row.cities) ? row.cities[0] : row.cities;
      const cityName = typeof (cityRow == null ? void 0 : cityRow.name) === "string" && cityRow.name.trim().length ? cityRow.name.trim() : null;
      return {
        id: row.id,
        name: row.name,
        address: row.address,
        cityId: typeof row.city_id === "string" ? row.city_id : null,
        cityName,
        lat: typeof row.lat === "number" && Number.isFinite(row.lat) ? row.lat : null,
        lon: typeof row.lon === "number" && Number.isFinite(row.lon) ? row.lon : null,
        supportsDelivery: row.supports_delivery === true && allowedSet.has("delivery"),
        supportsPickup: row.supports_pickup === true && allowedSet.has("pickup"),
        supportsDineIn: row.supports_dine_in === true && allowedSet.has("dine-in"),
        supportsQrMenu: row.supports_qr_menu === true && hallOrderingEnabled && hallMode === "to-table",
        supportsShowcaseOrder: row.supports_showcase_order === true && hallOrderingEnabled && hallMode === "pickup-point",
        festivalId: typeof row.festival_id === "string" ? row.festival_id : null,
        isFestival: row.is_festival === true,
        festivalFulfillmentType: ["delivery", "pickup", "dine-in"].includes(String(row.festival_fulfillment_type)) ? row.festival_fulfillment_type : null,
        useOrganizationWorkingHours: row.use_organization_working_hours !== false,
        workingHours: normalizeWeeklyWorkingHours(row.working_hours, fallbackWorkingHours),
        isActive: row.is_active,
        createdAt: row.created_at
      };
    })
  };
});

export { restaurants_get as default };
