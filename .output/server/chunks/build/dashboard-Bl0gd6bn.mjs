import { _ as __nuxt_component_0$2, k as useRuntimeConfig } from './server.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
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
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const { can, error } = useDashboardAccess();
    const config = useRuntimeConfig();
    const defaultCity = typeof config.public.defaultCitySlug === "string" && config.public.defaultCitySlug.trim() ? config.public.defaultCitySlug.trim() : "ulan-ude";
    const storefrontPath = ref(`/${defaultCity}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 text-gray-900" }, _attrs))}><header class="border-b border-gray-200 bg-white"><div class="overflow-x-auto"><div class="mx-auto flex min-w-max max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:min-w-0 sm:px-6"><div class="flex items-center gap-5">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "text-sm font-semibold text-gray-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` INUU Dashboard `);
          } else {
            return [
              createTextVNode(" INUU Dashboard ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="flex items-center gap-4 whitespace-nowrap text-sm text-gray-600">`);
      if (unref(can)("orders.view")) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/orders",
          class: "hover:text-gray-900"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u0417\u0430\u043F\u0438\u0441\u0438`);
            } else {
              return [
                createTextVNode("\u0417\u0430\u043F\u0438\u0441\u0438")
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
          to: "/dashboard/reviews",
          class: "hover:text-gray-900"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u041E\u0442\u0437\u044B\u0432\u044B`);
            } else {
              return [
                createTextVNode("\u041E\u0442\u0437\u044B\u0432\u044B")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(can)("menu.manage")) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/stories",
          class: "hover:text-gray-900"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u0421\u0442\u043E\u0440\u0438\u0437`);
            } else {
              return [
                createTextVNode("\u0421\u0442\u043E\u0440\u0438\u0437")
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
          class: "hover:text-gray-900"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u0422\u043E\u0447\u043A\u0438`);
            } else {
              return [
                createTextVNode("\u0422\u043E\u0447\u043A\u0438")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(can)("team.manage")) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/team",
          class: "hover:text-gray-900"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u041A\u043E\u043C\u0430\u043D\u0434\u0430`);
            } else {
              return [
                createTextVNode("\u041A\u043E\u043C\u0430\u043D\u0434\u0430")
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
          class: "hover:text-gray-900"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438`);
            } else {
              return [
                createTextVNode("\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(can)("integrations.manage")) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/integrations",
          class: "hover:text-gray-900"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F`);
            } else {
              return [
                createTextVNode("\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</nav></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: storefrontPath.value,
        class: "whitespace-nowrap text-sm text-gray-600 hover:text-gray-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u041D\u0430 \u0432\u0438\u0442\u0440\u0438\u043D\u0443 `);
          } else {
            return [
              createTextVNode(" \u041D\u0430 \u0432\u0438\u0442\u0440\u0438\u043D\u0443 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></header><main class="mx-auto max-w-7xl px-4 py-6 sm:px-6">`);
      if (unref(error)) {
        _push(`<p class="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700"> \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u044C \u0434\u043E\u0441\u0442\u0443\u043F\u044B. \u0420\u0430\u0437\u0434\u0435\u043B\u044B \u043C\u043E\u0433\u0443\u0442 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0442\u044C\u0441\u044F \u0447\u0430\u0441\u0442\u0438\u0447\u043D\u043E. </p>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
