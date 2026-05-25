import { y as defineEventHandler, aB as requireDashboardAccess, aA as readBody, t as createError, aS as serverSupabaseServiceRole, a$ as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

function normalizeFestivalFulfillmentType(value) {
  return value === "delivery" || value === "pickup" || value === "dine-in" ? value : null;
}
const branches_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const access = await requireDashboardAccess(event);
  const body = await readBody(event);
  const name = (_a = body == null ? void 0 : body.name) == null ? void 0 : _a.trim();
  const address = (_b = body == null ? void 0 : body.address) == null ? void 0 : _b.trim();
  if (!name || !address) {
    throw createError({ statusCode: 400, statusMessage: "name and address are required" });
  }
  const lat = typeof (body == null ? void 0 : body.lat) === "number" && Number.isFinite(body.lat) ? body.lat : null;
  const lon = typeof (body == null ? void 0 : body.lon) === "number" && Number.isFinite(body.lon) ? body.lon : null;
  const isFestivalBranch = (body == null ? void 0 : body.isFestival) === true;
  const festivalFulfillmentType = normalizeFestivalFulfillmentType(body == null ? void 0 : body.festivalFulfillmentType) || "pickup";
  const client = await serverSupabaseServiceRole(event);
  const config = useRuntimeConfig(event);
  const citySlug = typeof ((_c = config.public) == null ? void 0 : _c.defaultCitySlug) === "string" ? config.public.defaultCitySlug : "ulan-ude";
  const { data: cityData, error: cityError } = await client.from("cities").select("id").eq("slug", citySlug).maybeSingle();
  if (cityError || !(cityData == null ? void 0 : cityData.id)) {
    throw createError({ statusCode: 500, statusMessage: "Default city is missing" });
  }
  const { data, error } = await client.from("restaurants").insert({
    shop_id: access.shopId,
    city_id: cityData.id,
    name,
    address,
    lat,
    lon,
    supports_delivery: (body == null ? void 0 : body.supportsDelivery) !== false,
    supports_pickup: (body == null ? void 0 : body.supportsPickup) !== false,
    supports_dine_in: (body == null ? void 0 : body.supportsDineIn) === true,
    supports_qr_menu: (body == null ? void 0 : body.supportsQrMenu) === true,
    supports_showcase_order: (body == null ? void 0 : body.supportsShowcaseOrder) === true,
    festival_id: (body == null ? void 0 : body.festivalId) || null,
    is_festival: isFestivalBranch,
    festival_fulfillment_type: isFestivalBranch ? festivalFulfillmentType : null,
    is_active: true
  }).select("id,name,address,lat,lon,supports_delivery,supports_pickup,supports_dine_in,supports_qr_menu,supports_showcase_order,festival_id,is_festival,festival_fulfillment_type,is_active").single();
  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message || "Failed to create branch" });
  }
  return { ok: true, item: data };
});

export { branches_post as default };
