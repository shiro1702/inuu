import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "restaurants",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-semibold">\u0420\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u044B \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u044B</h1><p class="mt-2 text-sm text-gray-600">TODO: \u043C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0439, \u0431\u0440\u0435\u043D\u0434\u043E\u0432 \u0438 \u0444\u0438\u043B\u0438\u0430\u043B\u043E\u0432.</p></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/platform/restaurants.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
