import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
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
  __name: "roles",
  __ssrInlineRender: true,
  setup(__props) {
    const { role } = useDashboardAccess();
    const permissions = ref([
      { key: "orders.view", label: "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0437\u0430\u043A\u0430\u0437\u043E\u0432", manager: true, operator: true },
      { key: "orders.status.change", label: "\u0421\u043C\u0435\u043D\u0430 \u0441\u0442\u0430\u0442\u0443\u0441\u0430 \u0437\u0430\u043A\u0430\u0437\u0430", manager: true, operator: true },
      { key: "orders.kanban.move", label: "\u041F\u0435\u0440\u0435\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u043D\u0438\u0435 \u0432 \u043A\u0430\u043D\u0431\u0430\u043D\u0435", manager: false, operator: true },
      { key: "branches.view", label: "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0444\u0438\u043B\u0438\u0430\u043B\u043E\u0432", manager: true, operator: false },
      { key: "team.manage", label: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u043E\u0439", manager: false, operator: false }
    ]);
    const auditLog = ref([
      { action: "Owner \u043E\u0431\u043D\u043E\u0432\u0438\u043B \u043A\u0440\u0438\u0442\u0438\u0447\u043D\u044B\u0435 permissions", at: "2026-03-24 10:05" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h1 class="text-2xl font-semibold">\u0420\u043E\u043B\u0438 \u0438 permissions</h1><p class="text-sm text-gray-600">\u041C\u0430\u0442\u0440\u0438\u0446\u0430 \u0440\u043E\u043B\u0435\u0439 \u0438 \u0447\u0443\u0432\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u043F\u0440\u0430\u0432 \u0432 \u0440\u0430\u043C\u043A\u0430\u0445 MVP.</p>`);
      if (unref(role) !== "owner") {
        _push(`<div class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"> \u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D, \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0440\u043E\u043B\u0435\u0439 \u0438 permissions \u0442\u043E\u043B\u044C\u043A\u043E \u0434\u043B\u044F Owner. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="overflow-hidden rounded-xl border border-gray-200 bg-white"><table class="min-w-full divide-y divide-gray-200 text-sm"><thead class="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500"><tr><th class="px-3 py-2">Permission</th><th class="px-3 py-2">Owner</th><th class="px-3 py-2">Manager</th><th class="px-3 py-2">Operator</th></tr></thead><tbody class="divide-y divide-gray-100"><!--[-->`);
      ssrRenderList(permissions.value, (item) => {
        _push(`<tr><td class="px-3 py-2">${ssrInterpolate(item.label)}</td><td class="px-3 py-2">\u0414\u0430</td><td class="px-3 py-2"><input${ssrIncludeBooleanAttr(Array.isArray(item.manager) ? ssrLooseContain(item.manager, null) : item.manager) ? " checked" : ""} type="checkbox"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}></td><td class="px-3 py-2"><input${ssrIncludeBooleanAttr(Array.isArray(item.operator) ? ssrLooseContain(item.operator, null) : item.operator) ? " checked" : ""} type="checkbox"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}></td></tr>`);
      });
      _push(`<!--]--></tbody></table><div class="border-t border-gray-100 px-3 py-2"><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}> \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F </button></div></div><div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">Audit log</h2><ul class="mt-2 space-y-2 text-sm"><!--[-->`);
      ssrRenderList(auditLog.value, (entry, idx) => {
        _push(`<li class="flex items-center justify-between gap-3 border-b border-gray-100 pb-2"><span>${ssrInterpolate(entry.action)}</span><span class="text-gray-500">${ssrInterpolate(entry.at)}</span></li>`);
      });
      _push(`<!--]--></ul></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/team/roles.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
