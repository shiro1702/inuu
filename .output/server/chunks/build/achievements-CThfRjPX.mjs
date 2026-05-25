import { _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "achievements",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-2xl px-4 py-10" }, _attrs))}><h1 class="text-2xl font-semibold">\u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B \u0432\u043D\u0443\u0442\u0440\u0438 \u043A\u043E\u0440\u043D\u0435\u0440\u0430</h1><p class="mt-2 text-sm text-gray-600"> \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0430 \u0444\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044F \u0438 \u043E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0435\u0433\u043E \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443, \u0447\u0442\u043E\u0431\u044B \u0432\u0438\u0434\u0435\u0442\u044C \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0434\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u0439. </p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/${String(unref(route).params.city_slug || "")}`,
        class: "mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u043A\u043E\u0440\u043D\u0435\u0440\u0430\u043C `);
          } else {
            return [
              createTextVNode(" \u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u043A\u043E\u0440\u043D\u0435\u0440\u0430\u043C ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[city_slug]/achievements.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
