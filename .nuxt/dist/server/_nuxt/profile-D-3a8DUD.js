import { defineComponent, ref, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const currentPassword = ref("");
    const nextPassword = ref("");
    const errorMessage = ref("");
    const sessions = ref([
      { id: "sess-1", device: "Chrome macOS", city: "Улан-Удэ" },
      { id: "sess-2", device: "Safari iOS", city: "Иркутск" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h1 class="text-2xl font-semibold">Профиль в дашборде</h1><p class="text-sm text-gray-600">Безопасность аккаунта и управление сессиями.</p><div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">Смена пароля</h2><div class="mt-2 grid gap-2 md:grid-cols-2"><input${ssrRenderAttr("value", unref(currentPassword))} type="password" placeholder="Текущий пароль" class="rounded-lg border border-gray-300 px-3 py-2 text-sm"><input${ssrRenderAttr("value", unref(nextPassword))} type="password" placeholder="Новый пароль (минимум 8 символов)" class="rounded-lg border border-gray-300 px-3 py-2 text-sm"></div>`);
      if (unref(errorMessage)) {
        _push(`<p class="mt-2 text-sm text-red-700">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="mt-2 rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"> Обновить пароль </button></div><div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">Активные сессии</h2><ul class="mt-2 space-y-2 text-sm"><!--[-->`);
      ssrRenderList(unref(sessions), (session) => {
        _push(`<li class="flex items-center justify-between gap-3 rounded border border-gray-100 px-3 py-2"><span>${ssrInterpolate(session.device)} · ${ssrInterpolate(session.city)}</span><button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50">Завершить</button></li>`);
      });
      _push(`<!--]--></ul></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/settings/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
