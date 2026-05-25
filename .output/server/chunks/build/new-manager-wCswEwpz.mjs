import { defineComponent, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { u as useDashboardAccess } from './useDashboardAccess-PseSveld.mjs';
import './server.mjs';
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
  __name: "new-manager",
  __ssrInlineRender: true,
  setup(__props) {
    const { role } = useDashboardAccess();
    const step = ref(1);
    const draft = ref({
      email: "",
      name: "",
      template: "orders"
    });
    const message = ref("");
    const messageType = ref("ok");
    watch(draft, (value) => {
      return;
    }, { deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h1 class="text-2xl font-semibold">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430</h1><p class="text-sm text-gray-600">MVP-\u043C\u0430\u0441\u0442\u0435\u0440: \u0434\u0430\u043D\u043D\u044B\u0435, \u043F\u0440\u0430\u0432\u0430 \u0438 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0438 \u0438\u043D\u0432\u0430\u0439\u0442\u0430.</p>`);
      if (unref(role) !== "owner") {
        _push(`<div class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"> \u042D\u043A\u0440\u0430\u043D \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0442\u043E\u043B\u044C\u043A\u043E Owner. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="rounded-xl border border-gray-200 bg-white p-4"><div class="mb-3 text-xs text-gray-500">\u0428\u0430\u0433 ${ssrInterpolate(step.value)} \u0438\u0437 3 \xB7 TTL invite: 72 \u0447\u0430\u0441\u0430</div>`);
      if (step.value === 1) {
        _push(`<div class="space-y-3"><input${ssrRenderAttr("value", draft.value.email)} type="email" placeholder="Email \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"><input${ssrRenderAttr("value", draft.value.name)} type="text" placeholder="\u0418\u043C\u044F (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"></div>`);
      } else if (step.value === 2) {
        _push(`<div class="space-y-2 text-sm"><label class="flex items-center gap-2"><input${ssrIncludeBooleanAttr(ssrLooseEqual(draft.value.template, "orders")) ? " checked" : ""} type="radio" value="orders"> \u041E\u043F\u0435\u0440\u0430\u0442\u043E\u0440 \u0437\u0430\u043A\u0430\u0437\u043E\u0432</label><label class="flex items-center gap-2"><input${ssrIncludeBooleanAttr(ssrLooseEqual(draft.value.template, "branch")) ? " checked" : ""} type="radio" value="branch"> \u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0444\u0438\u043B\u0438\u0430\u043B\u0430</label><label class="flex items-center gap-2"><input${ssrIncludeBooleanAttr(ssrLooseEqual(draft.value.template, "custom")) ? " checked" : ""} type="radio" value="custom"> \u041A\u0430\u0441\u0442\u043E\u043C\u043D\u044B\u0435 \u043F\u0440\u0430\u0432\u0430</label></div>`);
      } else {
        _push(`<div class="text-sm"><p>Email: <b>${ssrInterpolate(draft.value.email || "\u2014")}</b></p><p>\u0428\u0430\u0431\u043B\u043E\u043D \u043F\u0440\u0430\u0432: <b>${ssrInterpolate(draft.value.template)}</b></p></div>`);
      }
      if (message.value) {
        _push(`<p class="${ssrRenderClass([messageType.value === "error" ? "text-red-700" : "text-green-700", "mt-2 text-sm"])}">${ssrInterpolate(message.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-3 flex gap-2"><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(step.value <= 1 || unref(role) !== "owner") ? " disabled" : ""}>\u041D\u0430\u0437\u0430\u0434</button>`);
      if (step.value < 3) {
        _push(`<button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}> \u0414\u0430\u043B\u0435\u0435 </button>`);
      } else {
        _push(`<button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}> \u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435 </button>`);
      }
      _push(`</div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/team/new-manager.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
