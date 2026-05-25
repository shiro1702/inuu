import { y as defineEventHandler, aM as resolveShopIdFromEvent, aS as serverSupabaseServiceRole } from '../../../nitro/nitro.mjs';
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

const cities_get = defineEventHandler(async (event) => {
  var _a;
  const tenantShopId = ((_a = event.context.tenant) == null ? void 0 : _a.shopId) || await resolveShopIdFromEvent(event);
  if (!tenantShopId) return { ok: true, items: [] };
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from("restaurants").select("cities(id,name,slug)").eq("shop_id", tenantShopId).eq("is_active", true);
  if (error) {
    return { ok: true, items: [] };
  }
  const seen = /* @__PURE__ */ new Set();
  const items = [];
  for (const row of data != null ? data : []) {
    const city = row == null ? void 0 : row.cities;
    const slug = typeof (city == null ? void 0 : city.slug) === "string" ? city.slug.trim() : "";
    const id = typeof (city == null ? void 0 : city.id) === "string" ? city.id : "";
    const name = typeof (city == null ? void 0 : city.name) === "string" ? city.name : slug;
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    items.push({ id, name, slug });
  }
  return { ok: true, items };
});

export { cities_get as default };
