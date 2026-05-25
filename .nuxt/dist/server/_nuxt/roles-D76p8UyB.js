import { defineComponent, ref, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain } from "vue/server-renderer";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
import { u as useDashboardAccess } from "./useDashboardAccess-PseSveld.js";
import "../server.mjs";
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
  __name: "roles",
  __ssrInlineRender: true,
  setup(__props) {
    const { role } = useDashboardAccess();
    const permissions = ref([
      { key: "orders.view", label: "Просмотр заказов", manager: true, operator: true },
      { key: "orders.status.change", label: "Смена статуса заказа", manager: true, operator: true },
      { key: "orders.kanban.move", label: "Перетаскивание в канбане", manager: false, operator: true },
      { key: "branches.view", label: "Просмотр филиалов", manager: true, operator: false },
      { key: "team.manage", label: "Управление командой", manager: false, operator: false }
    ]);
    const auditLog = ref([
      { action: "Owner обновил критичные permissions", at: "2026-03-24 10:05" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h1 class="text-2xl font-semibold">Роли и permissions</h1><p class="text-sm text-gray-600">Матрица ролей и чувствительных прав в рамках MVP.</p>`);
      if (unref(role) !== "owner") {
        _push(`<div class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"> Просмотр доступен, изменение ролей и permissions только для Owner. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="overflow-hidden rounded-xl border border-gray-200 bg-white"><table class="min-w-full divide-y divide-gray-200 text-sm"><thead class="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500"><tr><th class="px-3 py-2">Permission</th><th class="px-3 py-2">Owner</th><th class="px-3 py-2">Manager</th><th class="px-3 py-2">Operator</th></tr></thead><tbody class="divide-y divide-gray-100"><!--[-->`);
      ssrRenderList(permissions.value, (item) => {
        _push(`<tr><td class="px-3 py-2">${ssrInterpolate(item.label)}</td><td class="px-3 py-2">Да</td><td class="px-3 py-2"><input${ssrIncludeBooleanAttr(Array.isArray(item.manager) ? ssrLooseContain(item.manager, null) : item.manager) ? " checked" : ""} type="checkbox"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}></td><td class="px-3 py-2"><input${ssrIncludeBooleanAttr(Array.isArray(item.operator) ? ssrLooseContain(item.operator, null) : item.operator) ? " checked" : ""} type="checkbox"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}></td></tr>`);
      });
      _push(`<!--]--></tbody></table><div class="border-t border-gray-100 px-3 py-2"><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}> Сохранить изменения </button></div></div><div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">Audit log</h2><ul class="mt-2 space-y-2 text-sm"><!--[-->`);
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
export {
  _sfc_main as default
};
