import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cities",
  __ssrInlineRender: true,
  setup(__props) {
    const pending = ref(true);
    const errorMessage = ref(null);
    const cities = ref([]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><header><h1 class="text-2xl font-semibold">\u0413\u043E\u0440\u043E\u0434\u0430 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u044B</h1><p class="mt-2 text-sm text-gray-600"> Read-only \u0441\u043F\u0438\u0441\u043E\u043A \u0433\u043E\u0440\u043E\u0434\u043E\u0432 \u0438 \u0442\u0435\u043A\u0443\u0449\u0438\u0439 \u0441\u0442\u0430\u0442\u0443\u0441 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0438. </p></header>`);
      if (pending.value) {
        _push(`<div class="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600"> \u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C \u0441\u043F\u0438\u0441\u043E\u043A \u0433\u043E\u0440\u043E\u0434\u043E\u0432... </div>`);
      } else if (errorMessage.value) {
        _push(`<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">${ssrInterpolate(errorMessage.value)}</div>`);
      } else if (!cities.value.length) {
        _push(`<div class="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600"> \u0413\u043E\u0440\u043E\u0434\u0430 \u043F\u043E\u043A\u0430 \u043D\u0435 \u0437\u0430\u0432\u0435\u0434\u0435\u043D\u044B. </div>`);
      } else {
        _push(`<div class="overflow-hidden rounded-xl border border-gray-200 bg-white"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">\u0413\u043E\u0440\u043E\u0434</th><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Slug</th><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">\u0421\u0442\u0430\u0442\u0443\u0441</th></tr></thead><tbody class="divide-y divide-gray-100"><!--[-->`);
        ssrRenderList(cities.value, (city) => {
          _push(`<tr><td class="px-4 py-3 text-sm text-gray-900">${ssrInterpolate(city.name)}</td><td class="px-4 py-3 font-mono text-sm text-gray-600">${ssrInterpolate(city.slug)}</td><td class="px-4 py-3"><span class="${ssrRenderClass([city.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700", "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"])}">${ssrInterpolate(city.isActive ? "Active" : "Inactive")}</span></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/cities.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
