import { y as defineEventHandler, T as getQuery, t as createError } from '../../nitro/nitro.mjs';
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

const cache = /* @__PURE__ */ new Map();
const MAX_CACHE = 800;
const inFlight = /* @__PURE__ */ new Map();
const NOMINATIM_UA = "TeleShop/1.0 (city aggregator; +https://pocketmenu.ru)";
function cacheKey(fullQuery) {
  return fullQuery.trim().toLowerCase();
}
function trimCache() {
  if (cache.size <= MAX_CACHE) return;
  const drop = Math.floor(cache.size / 2);
  let i = 0;
  for (const k of cache.keys()) {
    cache.delete(k);
    i++;
    if (i >= drop) break;
  }
}
async function fetchNominatim(fullQuery) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", fullQuery);
  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": NOMINATIM_UA,
      Accept: "application/json"
    }
  });
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  const first = Array.isArray(data) ? data[0] : null;
  if (!first) return null;
  const lat = Number(first.lat);
  const lon = Number(first.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
}
const geocode_get = defineEventHandler(async (event) => {
  const q = getQuery(event);
  const raw = typeof q.q === "string" ? q.q.trim() : "";
  if (!raw) {
    throw createError({ statusCode: 400, statusMessage: "q is required" });
  }
  const city = typeof q.city === "string" ? q.city.trim() : "";
  const fullQuery = city ? `${raw}, ${city}` : raw;
  const key = cacheKey(fullQuery);
  const hit = cache.get(key);
  if (hit) {
    return { ok: true, lat: hit.lat, lon: hit.lon, cached: true };
  }
  const pending = inFlight.get(key);
  if (pending) {
    const coords2 = await pending;
    if (!coords2) {
      return { ok: false, error: "not_found" };
    }
    return { ok: true, lat: coords2.lat, lon: coords2.lon, cached: true };
  }
  const promise = (async () => {
    try {
      const coords2 = await fetchNominatim(fullQuery);
      if (coords2) {
        trimCache();
        cache.set(key, coords2);
      }
      return coords2;
    } finally {
      inFlight.delete(key);
    }
  })();
  inFlight.set(key, promise);
  const coords = await promise;
  if (!coords) {
    return { ok: false, error: "not_found" };
  }
  return { ok: true, lat: coords.lat, lon: coords.lon, cached: false };
});

export { geocode_get as default };
