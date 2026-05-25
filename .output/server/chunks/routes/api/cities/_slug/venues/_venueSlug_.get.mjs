import { y as defineEventHandler, aW as setResponseHeader, aG as resolveCityBySlug, aS as serverSupabaseServiceRole, t as createError } from '../../../../../nitro/nitro.mjs';
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

const _venueSlug__get = defineEventHandler(async (event) => {
  var _a, _b;
  setResponseHeader(event, "Cache-Control", "public, max-age=60, s-maxage=120");
  const slug = typeof ((_a = event.context.params) == null ? void 0 : _a.slug) === "string" ? event.context.params.slug : "";
  const venueSlug = typeof ((_b = event.context.params) == null ? void 0 : _b.venueSlug) === "string" ? event.context.params.venueSlug : "";
  const city = await resolveCityBySlug(event, slug);
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from("venues").select("*").eq("city_id", city.id).eq("slug", venueSlug).eq("is_published", true).eq("is_active", true).maybeSingle();
  if (error) {
    console.error("[venues/detail] load failed:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to load venue" });
  }
  if (!data) {
    throw createError({ statusCode: 404, statusMessage: "Venue not found" });
  }
  const { data: upcomingEvents } = await client.from("events").select("id,slug,title,starts_at,cover_media_url,price,currency").eq("city_id", city.id).eq("venue_id", data.id).eq("is_published", true).gte("starts_at", (/* @__PURE__ */ new Date()).toISOString()).order("starts_at", { ascending: true }).limit(8);
  return { ok: true, venue: data, upcomingEvents: upcomingEvents != null ? upcomingEvents : [] };
});

export { _venueSlug__get as default };
