import { _ as __nuxt_component_0, k as useRuntimeConfig } from "../server.mjs";
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import { u as useDashboardAccess } from "./useDashboardAccess-PseSveld.js";
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
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const { can, error } = useDashboardAccess();
    const config = useRuntimeConfig();
    const defaultCity = typeof config.public.defaultCitySlug === "string" && config.public.defaultCitySlug.trim() ? config.public.defaultCitySlug.trim() : "ulan-ude";
    const storefrontPath = ref(`/${defaultCity}`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
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
              _push2(`Записи`);
            } else {
              return [
                createTextVNode("Записи")
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
              _push2(`Отзывы`);
            } else {
              return [
                createTextVNode("Отзывы")
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
              _push2(`Сториз`);
            } else {
              return [
                createTextVNode("Сториз")
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
              _push2(`Точки`);
            } else {
              return [
                createTextVNode("Точки")
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
              _push2(`Команда`);
            } else {
              return [
                createTextVNode("Команда")
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
              _push2(`Настройки`);
            } else {
              return [
                createTextVNode("Настройки")
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
              _push2(`Уведомления`);
            } else {
              return [
                createTextVNode("Уведомления")
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
            _push2(` На витрину `);
          } else {
            return [
              createTextVNode(" На витрину ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></header><main class="mx-auto max-w-7xl px-4 py-6 sm:px-6">`);
      if (unref(error)) {
        _push(`<p class="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700"> Не удалось определить доступы. Разделы могут отображаться частично. </p>`);
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
export {
  _sfc_main as default
};
