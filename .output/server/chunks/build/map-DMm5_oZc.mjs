import { _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, ref, watch, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { $ as $fetch$1 } from '../nitro/nitro.mjs';
import { u as useCity } from './useCity-C2MHSDmF.mjs';
import { u as useHead } from './v3-AVe7cZyq.mjs';
import 'vue-router';
import '@supabase/ssr';
import 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:url';
import '@supabase/supabase-js';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

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
            ...(cityName == null ? void 0 : cityName.trim()) ? { city: cityName.trim() } : {}
          }
        });
        if ((res == null ? void 0 : res.ok) && typeof res.lat === "number" && typeof res.lon === "number") {
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
      var _a, _b;
      pending.value = true;
      try {
        const [venuesRes, eventsRes] = await Promise.all([
          $fetch(`/api/cities/${slug.value}/venues`),
          $fetch(`/api/cities/${slug.value}/events`)
        ]);
        const inputs = [];
        for (const v of (_a = venuesRes == null ? void 0 : venuesRes.items) != null ? _a : []) {
          inputs.push({
            id: `venue-${v.id}`,
            title: v.title,
            subtitle: v.address || "\u041C\u0435\u0441\u0442\u043E",
            address: v.address || v.title,
            lat: v.lat,
            lon: v.lng
          });
        }
        const { resolved } = await geocodeMarkers(inputs, ((_b = city.value) == null ? void 0 : _b.name) || displayName.value);
        mapPoints.value = resolved.map((p) => {
          var _a2, _b2;
          return {
            id: p.id,
            title: p.title,
            subtitle: p.subtitle,
            lat: p.lat,
            lon: p.lon,
            href: p.id.startsWith("venue-") ? `${cityBasePath.value}/venues/${((_b2 = ((_a2 = venuesRes == null ? void 0 : venuesRes.items) != null ? _a2 : []).find((v) => `venue-${v.id}` === p.id)) == null ? void 0 : _b2.slug) || ""}` : cityBasePath.value
          };
        }).filter((p) => p.href && !p.href.endsWith("/venues/"));
      } finally {
        pending.value = false;
      }
    }, { immediate: true });
    useHead({ title: () => `\u041A\u0430\u0440\u0442\u0430 \u2014 ${displayName.value}` });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-bold text-gray-900">\u041A\u0430\u0440\u0442\u0430</h1><p class="mt-2 text-sm text-gray-600">\u041C\u0435\u0441\u0442\u0430 \u0438 \u0441\u043E\u0431\u044B\u0442\u0438\u044F \u0441 \u043A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0442\u0430\u043C\u0438 \u0432 ${ssrInterpolate(unref(displayName))}</p>`);
      if (unref(pending)) {
        _push(`<p class="mt-6 text-sm text-gray-500">\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0442\u043E\u0447\u0435\u043A\u2026</p>`);
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
        _push(`<p class="mt-6 text-sm text-gray-500"> \u041D\u0435\u0442 \u0442\u043E\u0447\u0435\u043A \u0441 \u0430\u0434\u0440\u0435\u0441\u043E\u043C \u043D\u0430 \u043A\u0430\u0440\u0442\u0435. </p>`);
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

export { _sfc_main as default };
