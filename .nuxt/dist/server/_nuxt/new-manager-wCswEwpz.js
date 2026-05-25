import { defineComponent, ref, watch, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseEqual, ssrRenderClass } from "vue/server-renderer";
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
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h1 class="text-2xl font-semibold">Добавить менеджера</h1><p class="text-sm text-gray-600">MVP-мастер: данные, права и подтверждение отправки инвайта.</p>`);
      if (unref(role) !== "owner") {
        _push(`<div class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"> Экран доступен только Owner. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="rounded-xl border border-gray-200 bg-white p-4"><div class="mb-3 text-xs text-gray-500">Шаг ${ssrInterpolate(step.value)} из 3 · TTL invite: 72 часа</div>`);
      if (step.value === 1) {
        _push(`<div class="space-y-3"><input${ssrRenderAttr("value", draft.value.email)} type="email" placeholder="Email менеджера" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"><input${ssrRenderAttr("value", draft.value.name)} type="text" placeholder="Имя (опционально)" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"></div>`);
      } else if (step.value === 2) {
        _push(`<div class="space-y-2 text-sm"><label class="flex items-center gap-2"><input${ssrIncludeBooleanAttr(ssrLooseEqual(draft.value.template, "orders")) ? " checked" : ""} type="radio" value="orders"> Оператор заказов</label><label class="flex items-center gap-2"><input${ssrIncludeBooleanAttr(ssrLooseEqual(draft.value.template, "branch")) ? " checked" : ""} type="radio" value="branch"> Менеджер филиала</label><label class="flex items-center gap-2"><input${ssrIncludeBooleanAttr(ssrLooseEqual(draft.value.template, "custom")) ? " checked" : ""} type="radio" value="custom"> Кастомные права</label></div>`);
      } else {
        _push(`<div class="text-sm"><p>Email: <b>${ssrInterpolate(draft.value.email || "—")}</b></p><p>Шаблон прав: <b>${ssrInterpolate(draft.value.template)}</b></p></div>`);
      }
      if (message.value) {
        _push(`<p class="${ssrRenderClass([messageType.value === "error" ? "text-red-700" : "text-green-700", "mt-2 text-sm"])}">${ssrInterpolate(message.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-3 flex gap-2"><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(step.value <= 1 || unref(role) !== "owner") ? " disabled" : ""}>Назад</button>`);
      if (step.value < 3) {
        _push(`<button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}> Далее </button>`);
      } else {
        _push(`<button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}> Отправить приглашение </button>`);
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
export {
  _sfc_main as default
};
