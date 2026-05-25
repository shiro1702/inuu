import { y as defineEventHandler, aB as requireDashboardAccess, aS as serverSupabaseServiceRole, a$ as useRuntimeConfig, t as createError } from '../../../nitro/nitro.mjs';
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

const storefront_get = defineEventHandler(async (event) => {
  var _a, _b;
  const access = await requireDashboardAccess(event);
  const client = await serverSupabaseServiceRole(event);
  const config = useRuntimeConfig(event);
  const defaultCitySlug = typeof ((_a = config.public) == null ? void 0 : _a.defaultCitySlug) === "string" && config.public.defaultCitySlug.trim() ? config.public.defaultCitySlug.trim() : "ulan-ude";
  const { data, error } = await client.from("shops").select("slug").eq("id", access.shopId).maybeSingle();
  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Failed to resolve storefront path" });
  }
  const cityRes = await client.from("restaurants").select("cities(slug)").eq("shop_id", access.shopId).eq("is_active", true).limit(1);
  if (cityRes.error) {
    throw createError({ statusCode: 500, statusMessage: "Failed to resolve storefront city" });
  }
  const firstRow = Array.isArray(cityRes.data) ? cityRes.data[0] : null;
  const citySlug = typeof ((_b = firstRow == null ? void 0 : firstRow.cities) == null ? void 0 : _b.slug) === "string" && firstRow.cities.slug.trim() ? firstRow.cities.slug.trim() : defaultCitySlug;
  const slug = typeof (data == null ? void 0 : data.slug) === "string" ? data.slug.trim() : "";
  return {
    ok: true,
    path: slug ? `/${citySlug}/${slug}` : "/"
  };
});

export { storefront_get as default };
