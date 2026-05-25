import { y as defineEventHandler, aB as requireDashboardAccess, t as createError, Y as getRouterParam, aA as readBody, aS as serverSupabaseServiceRole, an as normalizeWeeklyWorkingHours, N as getDefaultOrganizationSettings } from '../../../../nitro/nitro.mjs';
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
const _id__put = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can update branch settings" });
  }
  const branchId = getRouterParam(event, "id");
  if (!branchId) {
    throw createError({ statusCode: 400, statusMessage: "Branch id is required" });
  }
  const body = await readBody(event);
  const name = (_a = body == null ? void 0 : body.name) == null ? void 0 : _a.trim();
  const address = (_b = body == null ? void 0 : body.address) == null ? void 0 : _b.trim();
  const lat = typeof (body == null ? void 0 : body.lat) === "number" && Number.isFinite(body.lat) ? body.lat : null;
  const lon = typeof (body == null ? void 0 : body.lon) === "number" && Number.isFinite(body.lon) ? body.lon : null;
  const isFestivalBranch = (body == null ? void 0 : body.isFestival) === true;
  const festivalFulfillmentType = normalizeFestivalFulfillmentType(body == null ? void 0 : body.festivalFulfillmentType) || "pickup";
  if (!name || !address) {
    throw createError({ statusCode: 400, statusMessage: "name and address are required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const fallbackWorkingHours = getDefaultOrganizationSettings().ops.workingHours;
  const normalizedWorkingHours = normalizeWeeklyWorkingHours(body == null ? void 0 : body.workingHours, fallbackWorkingHours);
  let update = await client.from("restaurants").update({
    name,
    address,
    lat,
    lon,
    supports_delivery: (body == null ? void 0 : body.supportsDelivery) === true,
    supports_pickup: (body == null ? void 0 : body.supportsPickup) === true,
    supports_dine_in: (body == null ? void 0 : body.supportsDineIn) === true,
    supports_qr_menu: (body == null ? void 0 : body.supportsQrMenu) === true,
    supports_showcase_order: (body == null ? void 0 : body.supportsShowcaseOrder) === true,
    festival_id: (body == null ? void 0 : body.festivalId) || null,
    is_festival: isFestivalBranch,
    festival_fulfillment_type: isFestivalBranch ? festivalFulfillmentType : null,
    use_organization_working_hours: (body == null ? void 0 : body.useOrganizationWorkingHours) !== false,
    working_hours: normalizedWorkingHours
  }).eq("id", branchId).eq("shop_id", access.shopId).select("id,name,address,lat,lon,supports_delivery,supports_pickup,supports_dine_in,supports_qr_menu,supports_showcase_order,festival_id,is_festival,festival_fulfillment_type,use_organization_working_hours,working_hours,is_active").maybeSingle();
  if (update.error && update.error.code === "42703") {
    update = await client.from("restaurants").update({
      name,
      address,
      lat,
      lon,
      supports_delivery: (body == null ? void 0 : body.supportsDelivery) === true,
      supports_pickup: (body == null ? void 0 : body.supportsPickup) === true,
      supports_dine_in: (body == null ? void 0 : body.supportsDineIn) === true,
      supports_qr_menu: (body == null ? void 0 : body.supportsQrMenu) === true,
      supports_showcase_order: (body == null ? void 0 : body.supportsShowcaseOrder) === true,
      festival_id: (body == null ? void 0 : body.festivalId) || null,
      is_festival: isFestivalBranch,
      festival_fulfillment_type: isFestivalBranch ? festivalFulfillmentType : null
    }).eq("id", branchId).eq("shop_id", access.shopId).select("id,name,address,lat,lon,supports_delivery,supports_pickup,supports_dine_in,supports_qr_menu,supports_showcase_order,festival_id,is_festival,festival_fulfillment_type,is_active").maybeSingle();
    if (update.data) {
      update.data.use_organization_working_hours = true;
      update.data.working_hours = fallbackWorkingHours;
    }
  }
  if (update.error || !update.data) {
    throw createError({ statusCode: 400, statusMessage: ((_c = update.error) == null ? void 0 : _c.message) || "Failed to update branch" });
  }
  return {
    ok: true,
    item: {
      id: update.data.id,
      name: update.data.name,
      address: update.data.address,
      lat: update.data.lat,
      lon: update.data.lon,
      supportsDelivery: update.data.supports_delivery,
      supportsPickup: update.data.supports_pickup,
      supportsDineIn: update.data.supports_dine_in,
      supportsQrMenu: update.data.supports_qr_menu,
      supportsShowcaseOrder: update.data.supports_showcase_order,
      festivalId: (_d = update.data.festival_id) != null ? _d : null,
      isFestival: update.data.is_festival === true,
      festivalFulfillmentType: ["delivery", "pickup", "dine-in"].includes(String(update.data.festival_fulfillment_type)) ? update.data.festival_fulfillment_type : null,
      useOrganizationWorkingHours: update.data.use_organization_working_hours !== false,
      workingHours: normalizeWeeklyWorkingHours(update.data.working_hours, fallbackWorkingHours),
      isActive: update.data.is_active
    }
  };
});

export { _id__put as default };
