import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const currentPassword = ref("");
    const nextPassword = ref("");
    const errorMessage = ref("");
    const sessions = ref([
      { id: "sess-1", device: "Chrome macOS", city: "\u0423\u043B\u0430\u043D-\u0423\u0434\u044D" },
      { id: "sess-2", device: "Safari iOS", city: "\u0418\u0440\u043A\u0443\u0442\u0441\u043A" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h1 class="text-2xl font-semibold">\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u0432 \u0434\u0430\u0448\u0431\u043E\u0440\u0434\u0435</h1><p class="text-sm text-gray-600">\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430 \u0438 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u0435\u0441\u0441\u0438\u044F\u043C\u0438.</p><div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">\u0421\u043C\u0435\u043D\u0430 \u043F\u0430\u0440\u043E\u043B\u044F</h2><div class="mt-2 grid gap-2 md:grid-cols-2"><input${ssrRenderAttr("value", unref(currentPassword))} type="password" placeholder="\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" class="rounded-lg border border-gray-300 px-3 py-2 text-sm"><input${ssrRenderAttr("value", unref(nextPassword))} type="password" placeholder="\u041D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C (\u043C\u0438\u043D\u0438\u043C\u0443\u043C 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432)" class="rounded-lg border border-gray-300 px-3 py-2 text-sm"></div>`);
      if (unref(errorMessage)) {
        _push(`<p class="mt-2 text-sm text-red-700">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="mt-2 rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"> \u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C </button></div><div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0435 \u0441\u0435\u0441\u0441\u0438\u0438</h2><ul class="mt-2 space-y-2 text-sm"><!--[-->`);
      ssrRenderList(unref(sessions), (session) => {
        _push(`<li class="flex items-center justify-between gap-3 rounded border border-gray-100 px-3 py-2"><span>${ssrInterpolate(session.device)} \xB7 ${ssrInterpolate(session.city)}</span><button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50">\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044C</button></li>`);
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

export { _sfc_main as default };
