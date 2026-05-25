import { y as defineEventHandler, aW as setResponseHeader, aG as resolveCityBySlug, aS as serverSupabaseServiceRole } from '../../../../nitro/nitro.mjs';
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

const home_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f;
  setResponseHeader(event, "Cache-Control", "public, max-age=60, s-maxage=120, stale-while-revalidate=300");
  const slug = typeof ((_a = event.context.params) == null ? void 0 : _a.slug) === "string" ? event.context.params.slug : "";
  const city = await resolveCityBySlug(event, slug);
  const client = await serverSupabaseServiceRole(event);
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const [storiesRes, eventsRes, venuesRes, listsRes, hotSlotsRes] = await Promise.all([
    client.from("story_campaigns").select("id,title,preview_url,placement,author_type,link_url").eq("city_id", city.id).eq("is_active", true).in("placement", ["top_bar", "home_hero"]).order("created_at", { ascending: false }).limit(12),
    client.from("events").select("id,slug,title,description,starts_at,ends_at,price,currency,cover_media_url,is_promoted,venue_id").eq("city_id", city.id).eq("is_published", true).gte("starts_at", nowIso).order("starts_at", { ascending: true }).limit(12),
    client.from("venues").select("id,slug,title,description,address,lat,lng,cover_media_url,vibe_tags,rating_avg,editorial_quote").eq("city_id", city.id).eq("is_published", true).eq("is_active", true).order("rating_avg", { ascending: false }).limit(12),
    client.from("curated_lists").select("id,slug,title,description,sort_order").eq("city_id", city.id).eq("is_published", true).order("sort_order", { ascending: true }).limit(6),
    client.from("hot_slots").select("id,starts_at,expires_at,price,discount_price,provider_id,service_id").eq("city_id", city.id).eq("is_active", true).gte("expires_at", nowIso).order("starts_at", { ascending: true }).limit(8)
  ]);
  return {
    ok: true,
    city: {
      id: city.id,
      name: city.name,
      slug: city.slug,
      timezone: city.timezone,
      editorialName: city.editorial_name
    },
    stories: (_b = storiesRes.data) != null ? _b : [],
    events: (_c = eventsRes.data) != null ? _c : [],
    venues: (_d = venuesRes.data) != null ? _d : [],
    curatedLists: (_e = listsRes.data) != null ? _e : [],
    hotSlots: (_f = hotSlotsRes.data) != null ? _f : []
  };
});

export { home_get as default };
