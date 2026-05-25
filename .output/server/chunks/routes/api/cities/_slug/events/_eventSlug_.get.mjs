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

const _eventSlug__get = defineEventHandler(async (event) => {
  var _a, _b;
  setResponseHeader(event, "Cache-Control", "public, max-age=60, s-maxage=120");
  const slug = typeof ((_a = event.context.params) == null ? void 0 : _a.slug) === "string" ? event.context.params.slug : "";
  const eventSlug = typeof ((_b = event.context.params) == null ? void 0 : _b.eventSlug) === "string" ? event.context.params.eventSlug : "";
  const city = await resolveCityBySlug(event, slug);
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from("events").select("*, venues:venue_id(id,slug,title,address)").eq("city_id", city.id).eq("slug", eventSlug).eq("is_published", true).maybeSingle();
  if (error) {
    console.error("[events/detail] load failed:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to load event" });
  }
  if (!data) {
    throw createError({ statusCode: 404, statusMessage: "Event not found" });
  }
  return { ok: true, event: data };
});

export { _eventSlug__get as default };
