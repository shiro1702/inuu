import { _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
    const { role } = useDashboardAccess();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h1 class="text-2xl font-semibold">\u041A\u043E\u043C\u0430\u043D\u0434\u0430 \u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u044B</h1><p class="text-sm text-gray-600"> \u0417\u0434\u0435\u0441\u044C \u0443\u043F\u0440\u0430\u0432\u043B\u044F\u044E\u0442\u0441\u044F \u0440\u043E\u043B\u0438 Owner/Manager, \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u044F \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432 \u0438 \u043F\u0440\u0430\u0432\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u0440\u0430\u0437\u0434\u0435\u043B\u0430\u043C \u0434\u0430\u0448\u0431\u043E\u0440\u0434\u0430. </p>`);
      if (unref(role) !== "owner") {
        _push(`<p class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"> \u0423 \u0432\u0430\u0441 \u0440\u043E\u043B\u044C \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430. \u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u043E\u0441\u0442\u0430\u0432\u043E\u043C \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u0438 \u043F\u0440\u0430\u0432\u0430\u043C\u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u0442\u043E\u043B\u044C\u043A\u043E Owner. </p>`);
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
            _push2(`<p class="text-sm font-medium text-gray-900"${_scopeId}>\u0420\u043E\u043B\u0438 \u0438 permissions</p><p class="mt-1 text-xs text-gray-600"${_scopeId}>\u041C\u0430\u0442\u0440\u0438\u0446\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u043E\u0432 Owner/Manager \u0438 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u043F\u0440\u0430\u0432.</p>`);
          } else {
            return [
              createVNode("p", { class: "text-sm font-medium text-gray-900" }, "\u0420\u043E\u043B\u0438 \u0438 permissions"),
              createVNode("p", { class: "mt-1 text-xs text-gray-600" }, "\u041C\u0430\u0442\u0440\u0438\u0446\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u043E\u0432 Owner/Manager \u0438 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u043F\u0440\u0430\u0432.")
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
            _push2(`<p class="text-sm font-medium text-gray-900"${_scopeId}>\u041F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u044F</p><p class="mt-1 text-xs text-gray-600"${_scopeId}>\u0418\u043D\u0432\u0430\u0439\u0442-\u0441\u0441\u044B\u043B\u043A\u0438, \u0441\u0442\u0430\u0442\u0443\u0441\u044B \u0442\u043E\u043A\u0435\u043D\u043E\u0432 \u0438 \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u0430\u044F \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0430.</p>`);
          } else {
            return [
              createVNode("p", { class: "text-sm font-medium text-gray-900" }, "\u041F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u044F"),
              createVNode("p", { class: "mt-1 text-xs text-gray-600" }, "\u0418\u043D\u0432\u0430\u0439\u0442-\u0441\u0441\u044B\u043B\u043A\u0438, \u0441\u0442\u0430\u0442\u0443\u0441\u044B \u0442\u043E\u043A\u0435\u043D\u043E\u0432 \u0438 \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u0430\u044F \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0430.")
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
            _push2(`<p class="text-sm font-medium text-gray-900"${_scopeId}>\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430</p><p class="mt-1 text-xs text-gray-600"${_scopeId}>\u041F\u043E\u0442\u043E\u043A \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043D\u043E\u0432\u043E\u0433\u043E \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430 \u0438 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0431\u0430\u0437\u043E\u0432\u044B\u0445 \u043F\u0440\u0430\u0432.</p>`);
          } else {
            return [
              createVNode("p", { class: "text-sm font-medium text-gray-900" }, "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430"),
              createVNode("p", { class: "mt-1 text-xs text-gray-600" }, "\u041F\u043E\u0442\u043E\u043A \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043D\u043E\u0432\u043E\u0433\u043E \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430 \u0438 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0431\u0430\u0437\u043E\u0432\u044B\u0445 \u043F\u0440\u0430\u0432.")
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

export { _sfc_main as default };
