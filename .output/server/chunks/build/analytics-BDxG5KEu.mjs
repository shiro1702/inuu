import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "analytics",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-semibold">\u0410\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0430</h1><p class="mt-2 text-sm text-gray-600">TODO: \u043E\u0442\u0447\u0435\u0442\u044B \u043F\u043E \u0437\u0430\u043A\u0430\u0437\u0430\u043C, \u0432\u044B\u0440\u0443\u0447\u043A\u0435 \u0438 \u0441\u0440\u0435\u0434\u043D\u0435\u043C\u0443 \u0447\u0435\u043A\u0443.</p></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/analytics.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
