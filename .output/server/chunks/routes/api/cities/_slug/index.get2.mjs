import { y as defineEventHandler, aW as setResponseHeader, aG as resolveCityBySlug, T as getQuery, aS as serverSupabaseServiceRole } from '../../../../nitro/nitro.mjs';
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
  var _a;
  setResponseHeader(event, "Cache-Control", "public, max-age=60, s-maxage=120");
  const slug = typeof ((_a = event.context.params) == null ? void 0 : _a.slug) === "string" ? event.context.params.slug : "";
  const city = await resolveCityBySlug(event, slug);
  const query = getQuery(event);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 24));
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from("venues").select("id,slug,title,description,address,lat,lng,cover_media_url,vibe_tags,rating_avg,editorial_quote,phone,instagram_url").eq("city_id", city.id).eq("is_published", true).eq("is_active", true).order("rating_avg", { ascending: false }).limit(limit);
  if (error) {
    console.error("[venues/index] load failed:", error);
    return { ok: false, items: [] };
  }
  return { ok: true, items: data != null ? data : [] };
});

export { index_get as default };
