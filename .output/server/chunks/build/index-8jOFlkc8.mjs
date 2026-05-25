import { i as useRoute, _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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
    useRoute();
    const { can } = useDashboardAccess();
    const pending = ref(true);
    const errorMessage = ref(null);
    const branchCount = ref(0);
    const hasBranches = computed(() => branchCount.value > 0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="space-y-2"><h1 class="text-2xl font-semibold">\u0414\u0430\u0448\u0431\u043E\u0440\u0434</h1><p class="text-sm text-gray-600">\u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0434\u043B\u044F \u0437\u0430\u043F\u0443\u0441\u043A\u0430 \u0440\u0430\u0431\u043E\u0442\u044B.</p></div>`);
      if (pending.value) {
        _push(`<div class="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600"> \u041F\u0440\u043E\u0432\u0435\u0440\u044F\u0435\u043C \u0434\u043E\u0441\u0442\u0443\u043F \u0438 \u0434\u0430\u043D\u043D\u044B\u0435 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438... </div>`);
      } else if (errorMessage.value) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">${ssrInterpolate(errorMessage.value)}</div>`);
      } else {
        _push(`<div class="flex flex-wrap gap-3">`);
        if (unref(can)("orders.view")) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/dashboard/orders",
            class: "rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:border-gray-300"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` \u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u0437\u0430\u043A\u0430\u0437\u0430\u043C `);
              } else {
                return [
                  createTextVNode(" \u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u0437\u0430\u043A\u0430\u0437\u0430\u043C ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(can)("settings.org.edit")) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/dashboard/settings/organization",
            class: "rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:border-gray-300"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438 `);
              } else {
                return [
                  createTextVNode(" \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438 ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(can)("branches.view")) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/dashboard/branches",
            class: "rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:border-gray-300"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` \u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0444\u0438\u043B\u0438\u0430\u043B\u044B `);
              } else {
                return [
                  createTextVNode(" \u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0444\u0438\u043B\u0438\u0430\u043B\u044B ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(can)("orders.view")) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/dashboard/moderation/city-ugc",
            class: "rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:border-gray-300"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` \u0413\u043E\u0440\u043E\u0434\u0441\u043A\u0430\u044F \u043C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F UGC `);
              } else {
                return [
                  createTextVNode(" \u0413\u043E\u0440\u043E\u0434\u0441\u043A\u0430\u044F \u043C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F UGC ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      if (!pending.value && !errorMessage.value && !hasBranches.value) {
        _push(`<div class="rounded-xl border border-blue-200 bg-blue-50 p-4"><p class="text-sm font-medium text-blue-900">\u0412 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0444\u0438\u043B\u0438\u0430\u043B\u043E\u0432.</p><p class="mt-1 text-sm text-blue-800">\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u043F\u0435\u0440\u0432\u044B\u0439 \u0444\u0438\u043B\u0438\u0430\u043B, \u0447\u0442\u043E\u0431\u044B \u043D\u0430\u0447\u0430\u0442\u044C \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u0442\u044C \u0438 \u043E\u0431\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0442\u044C \u0437\u0430\u043A\u0430\u0437\u044B.</p>`);
        if (unref(can)("branches.create")) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/dashboard/branches/new",
            class: "mt-3 inline-flex rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-sm text-blue-900 hover:bg-blue-100"
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
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="rounded-xl border border-dashed border-gray-300 bg-white p-4"><h2 class="text-sm font-semibold text-gray-900">\u0421\u043A\u043E\u0440\u043E \u043D\u0430 \u044D\u0442\u043E\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435</h2><p class="mt-1 text-sm text-gray-600"> KPI \u0438 \u0433\u0440\u0430\u0444\u0438\u043A\u0438 \u0434\u0430\u0448\u0431\u043E\u0440\u0434\u0430 \u043D\u0430\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0432 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0435. \u041F\u043E\u043A\u0430 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0440\u0430\u0437\u0434\u0435\u043B\u044B \xAB\u0417\u0430\u043A\u0430\u0437\u044B\xBB, \xAB\u0424\u0438\u043B\u0438\u0430\u043B\u044B\xBB \u0438 \xAB\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438\xBB. </p></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
