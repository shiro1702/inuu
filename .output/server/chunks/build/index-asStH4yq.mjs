import { _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createTextVNode, createVNode, toDisplayString, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { u as useDashboardAccess } from './useDashboardAccess-PseSveld.mjs';
import '../nitro/nitro.mjs';
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
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { can } = useDashboardAccess();
    const pending = ref(true);
    const errorMessage = ref(null);
    const restaurants = ref([]);
    const cityFilter = ref("all");
    const statusFilter = ref("all");
    const brandFilter = ref("all");
    const cityLabel = (item) => {
      var _a;
      return ((_a = item.cityName) == null ? void 0 : _a.trim()) || "\u0411\u0435\u0437 \u0433\u043E\u0440\u043E\u0434\u0430";
    };
    const cities = computed(() => Array.from(new Set(restaurants.value.map((item) => cityLabel(item)))));
    const filteredRestaurants = computed(() => restaurants.value.filter((item) => {
      if (statusFilter.value === "active" && !item.isActive) return false;
      if (statusFilter.value === "inactive" && item.isActive) return false;
      if (cityFilter.value !== "all" && cityLabel(item) !== cityFilter.value) return false;
      if (brandFilter.value !== "all" && brandFilter.value !== "main") return false;
      return true;
    }));
    const groupedRestaurants = computed(() => {
      const map = /* @__PURE__ */ new Map();
      filteredRestaurants.value.forEach((item) => {
        const city = cityLabel(item);
        const bucket = map.get(city) || [];
        bucket.push(item);
        map.set(city, bucket);
      });
      return Array.from(map.entries()).map(([city, items]) => ({ city, items }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex items-center justify-between gap-3"><div><h1 class="text-2xl font-semibold">\u0424\u0438\u043B\u0438\u0430\u043B\u044B</h1><p class="mt-2 text-sm text-gray-600">\u0421\u043F\u0438\u0441\u043E\u043A \u0444\u0438\u043B\u0438\u0430\u043B\u043E\u0432 \u0442\u0435\u043A\u0443\u0449\u0435\u0439 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438.</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/branches/new",
        class: "rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0444\u0438\u043B\u0438\u0430\u043B `);
          } else {
            return [
              createTextVNode(" \u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0444\u0438\u043B\u0438\u0430\u043B ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-3"><label class="text-sm"><span class="mb-1 block text-gray-600">\u0413\u043E\u0440\u043E\u0434</span><select class="w-full rounded-lg border border-gray-300 px-2 py-2"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(cityFilter.value) ? ssrLooseContain(cityFilter.value, "all") : ssrLooseEqual(cityFilter.value, "all")) ? " selected" : ""}>\u0412\u0441\u0435</option><!--[-->`);
      ssrRenderList(cities.value, (city) => {
        _push(`<option${ssrRenderAttr("value", city)}${ssrIncludeBooleanAttr(Array.isArray(cityFilter.value) ? ssrLooseContain(cityFilter.value, city) : ssrLooseEqual(cityFilter.value, city)) ? " selected" : ""}>${ssrInterpolate(city)}</option>`);
      });
      _push(`<!--]--></select></label><label class="text-sm"><span class="mb-1 block text-gray-600">\u0421\u0442\u0430\u0442\u0443\u0441</span><select class="w-full rounded-lg border border-gray-300 px-2 py-2"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "all") : ssrLooseEqual(statusFilter.value, "all")) ? " selected" : ""}>\u0412\u0441\u0435</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "active") : ssrLooseEqual(statusFilter.value, "active")) ? " selected" : ""}>\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0435</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "inactive") : ssrLooseEqual(statusFilter.value, "inactive")) ? " selected" : ""}>\u041D\u0435\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0435</option></select></label><label class="text-sm"><span class="mb-1 block text-gray-600">\u0411\u0440\u0435\u043D\u0434</span><select class="w-full rounded-lg border border-gray-300 px-2 py-2"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(brandFilter.value) ? ssrLooseContain(brandFilter.value, "all") : ssrLooseEqual(brandFilter.value, "all")) ? " selected" : ""}>\u0412\u0441\u0435</option><option value="main"${ssrIncludeBooleanAttr(Array.isArray(brandFilter.value) ? ssrLooseContain(brandFilter.value, "main") : ssrLooseEqual(brandFilter.value, "main")) ? " selected" : ""}>\u041E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u0431\u0440\u0435\u043D\u0434</option></select></label></div><div class="rounded-xl border border-gray-200 bg-white">`);
      if (pending.value) {
        _push(`<div class="px-4 py-4 text-sm text-gray-600"> \u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C \u0444\u0438\u043B\u0438\u0430\u043B\u044B... </div>`);
      } else if (errorMessage.value) {
        _push(`<div class="px-4 py-4 text-sm text-red-600">${ssrInterpolate(errorMessage.value)}</div>`);
      } else if (!restaurants.value.length) {
        _push(`<div class="px-4 py-4 text-sm text-gray-600"> \u0424\u0438\u043B\u0438\u0430\u043B\u044B \u0435\u0449\u0435 \u043D\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u044B. </div>`);
      } else {
        _push(`<div class="divide-y divide-gray-100"><!--[-->`);
        ssrRenderList(groupedRestaurants.value, (group) => {
          _push(`<div class="px-4 py-3"><p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">${ssrInterpolate(group.city)}</p><ul class="space-y-2"><!--[-->`);
          ssrRenderList(group.items, (item) => {
            _push(`<li class="rounded-lg border border-gray-100 px-2 py-2"><div class="flex items-center justify-between gap-3">`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/dashboard/branches/${item.id}`,
              class: "min-w-0 flex-1 rounded-lg transition hover:bg-gray-50"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<p class="text-sm font-medium text-gray-900"${_scopeId}>${ssrInterpolate(item.name)}</p><p class="text-xs text-gray-600"${_scopeId}>${ssrInterpolate(item.address)}</p><p class="mt-1 text-xs text-primary"${_scopeId}>\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435</p>`);
                } else {
                  return [
                    createVNode("p", { class: "text-sm font-medium text-gray-900" }, toDisplayString(item.name), 1),
                    createVNode("p", { class: "text-xs text-gray-600" }, toDisplayString(item.address), 1),
                    createVNode("p", { class: "mt-1 text-xs text-primary" }, "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435")
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`<div class="flex items-center gap-2"><span class="${ssrRenderClass([item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700", "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"])}">${ssrInterpolate(item.isActive ? "Active" : "Inactive")}</span>`);
            if (unref(can)("branches.archive")) {
              _push(`<button class="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"> \u0410\u0440\u0445\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u0442\u044C </button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div></li>`);
          });
          _push(`<!--]--></ul></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/branches/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
