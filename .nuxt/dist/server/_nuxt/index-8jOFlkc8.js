import { i as useRoute, _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
import { u as useDashboardAccess } from "./useDashboardAccess-PseSveld.js";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unctx/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/defu/dist/defu.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ufo/dist/index.mjs";
import "@supabase/ssr";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/klona/dist/index.mjs";
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
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="space-y-2"><h1 class="text-2xl font-semibold">Дашборд</h1><p class="text-sm text-gray-600">Быстрые действия для запуска работы.</p></div>`);
      if (pending.value) {
        _push(`<div class="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600"> Проверяем доступ и данные организации... </div>`);
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
                _push2(` Перейти к заказам `);
              } else {
                return [
                  createTextVNode(" Перейти к заказам ")
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
                _push2(` Настройки организации `);
              } else {
                return [
                  createTextVNode(" Настройки организации ")
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
                _push2(` Открыть филиалы `);
              } else {
                return [
                  createTextVNode(" Открыть филиалы ")
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
                _push2(` Городская модерация UGC `);
              } else {
                return [
                  createTextVNode(" Городская модерация UGC ")
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
        _push(`<div class="rounded-xl border border-blue-200 bg-blue-50 p-4"><p class="text-sm font-medium text-blue-900">В организации пока нет филиалов.</p><p class="mt-1 text-sm text-blue-800">Создайте первый филиал, чтобы начать принимать и обрабатывать заказы.</p>`);
        if (unref(can)("branches.create")) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/dashboard/branches/new",
            class: "mt-3 inline-flex rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-sm text-blue-900 hover:bg-blue-100"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Создать филиал `);
              } else {
                return [
                  createTextVNode(" Создать филиал ")
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
      _push(`<div class="rounded-xl border border-dashed border-gray-300 bg-white p-4"><h2 class="text-sm font-semibold text-gray-900">Скоро на этой странице</h2><p class="mt-1 text-sm text-gray-600"> KPI и графики дашборда находятся в разработке. Пока используйте разделы «Заказы», «Филиалы» и «Настройки». </p></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
