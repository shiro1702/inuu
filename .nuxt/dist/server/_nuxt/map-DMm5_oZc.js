import { _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, ref, watch, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import { $fetch as $fetch$1 } from "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ofetch/dist/node.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
import { u as useCity } from "./useCity-C2MHSDmF.js";
import { u as useHead } from "./v3-AVe7cZyq.js";
import "#internal/nuxt/paths";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unctx/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/defu/dist/defu.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ufo/dist/index.mjs";
import "@supabase/ssr";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/klona/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/@unhead/vue/dist/index.mjs";
async function geocodeMarkers(points, cityName, concurrency = 3) {
  const resolved = [];
  let failed = 0;
  const queue = [];
  for (const p of points) {
    const lat = typeof p.lat === "number" && Number.isFinite(p.lat) ? p.lat : null;
    const lon = typeof p.lon === "number" && Number.isFinite(p.lon) ? p.lon : null;
    if (lat != null && lon != null) {
      resolved.push({ ...p, lat, lon });
      continue;
    }
    queue.push(p);
  }
  if (!queue.length) {
    return { resolved, failed };
  }
  const workers = Array.from({ length: Math.min(concurrency, Math.max(1, queue.length)) }, async () => {
    while (queue.length) {
      const p = queue.shift();
      if (!p) break;
      try {
        const res = await $fetch$1("/api/geocode", {
          query: {
            q: p.address,
            ...cityName?.trim() ? { city: cityName.trim() } : {}
          }
        });
        if (res?.ok && typeof res.lat === "number" && typeof res.lon === "number") {
          resolved.push({ ...p, lat: res.lat, lon: res.lon });
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }
  });
  await Promise.all(workers);
  return { resolved, failed };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "map",
  __ssrInlineRender: true,
  setup(__props) {
    const { slug, cityBasePath, displayName, city } = useCity();
    const pending = ref(true);
    const mapPoints = ref([]);
    watch(slug, async () => {
      pending.value = true;
      try {
        const [venuesRes, eventsRes] = await Promise.all([
          $fetch(`/api/cities/${slug.value}/venues`),
          $fetch(`/api/cities/${slug.value}/events`)
        ]);
        const inputs = [];
        for (const v of venuesRes?.items ?? []) {
          inputs.push({
            id: `venue-${v.id}`,
            title: v.title,
            subtitle: v.address || "Место",
            address: v.address || v.title,
            lat: v.lat,
            lon: v.lng
          });
        }
        const { resolved } = await geocodeMarkers(inputs, city.value?.name || displayName.value);
        mapPoints.value = resolved.map((p) => ({
          id: p.id,
          title: p.title,
          subtitle: p.subtitle,
          lat: p.lat,
          lon: p.lon,
          href: p.id.startsWith("venue-") ? `${cityBasePath.value}/venues/${(venuesRes?.items ?? []).find((v) => `venue-${v.id}` === p.id)?.slug || ""}` : cityBasePath.value
        })).filter((p) => p.href && !p.href.endsWith("/venues/"));
      } finally {
        pending.value = false;
      }
    }, { immediate: true });
    useHead({ title: () => `Карта — ${displayName.value}` });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-bold text-gray-900">Карта</h1><p class="mt-2 text-sm text-gray-600">Места и события с координатами в ${ssrInterpolate(unref(displayName))}</p>`);
      if (unref(pending)) {
        _push(`<p class="mt-6 text-sm text-gray-500">Загрузка точек…</p>`);
      } else {
        _push(`<ul class="mt-6 space-y-3"><!--[-->`);
        ssrRenderList(unref(mapPoints), (point) => {
          _push(`<li class="rounded-xl border border-gray-200 bg-white p-4">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: point.href,
            class: "font-medium text-primary hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(point.title)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(point.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          if (point.subtitle) {
            _push(`<p class="text-sm text-gray-500">${ssrInterpolate(point.subtitle)}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (point.lat != null) {
            _push(`<p class="mt-1 text-xs text-gray-400">${ssrInterpolate(point.lat.toFixed(4))}, ${ssrInterpolate(point.lon.toFixed(4))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul>`);
      }
      if (!unref(pending) && !unref(mapPoints).length) {
        _push(`<p class="mt-6 text-sm text-gray-500"> Нет точек с адресом на карте. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[city_slug]/map.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
