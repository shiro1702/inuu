import { _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, mergeProps, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
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
    const { role } = useDashboardAccess();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h1 class="text-2xl font-semibold">Команда и доступы</h1><p class="text-sm text-gray-600"> Здесь управляются роли Owner/Manager, приглашения сотрудников и права доступа к разделам дашборда. </p>`);
      if (unref(role) !== "owner") {
        _push(`<p class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"> У вас роль менеджера. Управление составом команды и правами доступно только Owner. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid gap-3 sm:grid-cols-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/team/roles",
        class: "rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm font-medium text-gray-900"${_scopeId}>Роли и permissions</p><p class="mt-1 text-xs text-gray-600"${_scopeId}>Матрица доступов Owner/Manager и правила изменения прав.</p>`);
          } else {
            return [
              createVNode("p", { class: "text-sm font-medium text-gray-900" }, "Роли и permissions"),
              createVNode("p", { class: "mt-1 text-xs text-gray-600" }, "Матрица доступов Owner/Manager и правила изменения прав.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/team/invitations",
        class: "rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm font-medium text-gray-900"${_scopeId}>Приглашения</p><p class="mt-1 text-xs text-gray-600"${_scopeId}>Инвайт-ссылки, статусы токенов и повторная отправка.</p>`);
          } else {
            return [
              createVNode("p", { class: "text-sm font-medium text-gray-900" }, "Приглашения"),
              createVNode("p", { class: "mt-1 text-xs text-gray-600" }, "Инвайт-ссылки, статусы токенов и повторная отправка.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/team/new-manager",
        class: "rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 sm:col-span-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-sm font-medium text-gray-900"${_scopeId}>Добавить менеджера</p><p class="mt-1 text-xs text-gray-600"${_scopeId}>Поток добавления нового менеджера и назначение базовых прав.</p>`);
          } else {
            return [
              createVNode("p", { class: "text-sm font-medium text-gray-900" }, "Добавить менеджера"),
              createVNode("p", { class: "mt-1 text-xs text-gray-600" }, "Поток добавления нового менеджера и назначение базовых прав.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/team/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
