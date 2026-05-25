import { _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from "vue/server-renderer";
import { u as useCity } from "./useCity-C2MHSDmF.js";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unctx/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/defu/dist/defu.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ufo/dist/index.mjs";
import "@supabase/ssr";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/klona/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "city",
  __ssrInlineRender: true,
  setup(__props) {
    const { cityBasePath, displayName } = useCity();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 text-gray-900" }, _attrs))}><header class="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur"><div class="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(cityBasePath),
        class: "truncate text-base font-semibold text-gray-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(displayName))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(displayName)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="flex items-center gap-1 text-sm sm:gap-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `${unref(cityBasePath)}/events`,
        class: "rounded-lg px-2 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        "active-class": "bg-gray-100 font-medium text-gray-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Афиша `);
          } else {
            return [
              createTextVNode(" Афиша ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `${unref(cityBasePath)}/venues`,
        class: "rounded-lg px-2 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        "active-class": "bg-gray-100 font-medium text-gray-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Места `);
          } else {
            return [
              createTextVNode(" Места ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `${unref(cityBasePath)}/map`,
        class: "hidden rounded-lg px-2 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 sm:inline-flex",
        "active-class": "bg-gray-100 font-medium text-gray-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Карта `);
          } else {
            return [
              createTextVNode(" Карта ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/login",
        class: "rounded-lg border border-gray-200 px-2 py-1.5 text-gray-700 hover:bg-gray-50"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Войти `);
          } else {
            return [
              createTextVNode(" Войти ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div></header><main class="mx-auto max-w-6xl px-4 py-6 sm:px-6">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/city.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
