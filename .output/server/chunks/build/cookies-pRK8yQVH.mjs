import { _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, computed, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
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
  __name: "cookies",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const cityBase = computed(() => {
      const cs = route.params.city_slug;
      const city = Array.isArray(cs) ? cs[0] : cs;
      return typeof city === "string" && city.trim() ? `/${city.trim()}` : "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-4 py-8 text-sm leading-6 text-gray-700 sm:px-6" }, _attrs))}><h1 class="text-2xl font-semibold text-gray-900">\u0424\u0430\u0439\u043B\u044B cookie \u0438 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0435 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435</h1><p class="mt-4"> \u041F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430 pocketmenu.ru \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442 \u0444\u0430\u0439\u043B\u044B cookie \u0438 \u0430\u043D\u0430\u043B\u043E\u0433\u0438\u0447\u043D\u044B\u0435 \u0442\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0438 (\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, localStorage), \u0447\u0442\u043E\u0431\u044B \u043E\u0431\u0435\u0441\u043F\u0435\u0447\u0438\u0442\u044C \u0432\u0445\u043E\u0434 \u0432 \u0430\u043A\u043A\u0430\u0443\u043D\u0442, \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u043A\u043E\u0440\u0437\u0438\u043D\u044B, \u0441\u0435\u0441\u0441\u0438\u044E \u0438 \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C \u0441\u0435\u0440\u0432\u0438\u0441\u0430. \u0427\u0430\u0441\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0445 \u043E\u0431\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0442\u0430\u043A\u0436\u0435 \u0432 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0438 \u0441 `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `${cityBase.value}/legal/privacy`,
        class: "text-primary underline decoration-dotted hover:text-primary-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u041F\u043E\u043B\u0438\u0442\u0438\u043A\u043E\u0439 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438 `);
          } else {
            return [
              createTextVNode(" \u041F\u043E\u043B\u0438\u0442\u0438\u043A\u043E\u0439 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` \u0438 `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `${cityBase.value}/legal/consent`,
        class: "text-primary underline decoration-dotted hover:text-primary-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u0421\u043E\u0433\u043B\u0430\u0441\u0438\u0435\u043C \u043D\u0430 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0443 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445 `);
          } else {
            return [
              createTextVNode(" \u0421\u043E\u0433\u043B\u0430\u0441\u0438\u0435\u043C \u043D\u0430 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0443 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` . </p><h2 class="mt-6 text-lg font-semibold text-gray-900">\u041A\u0430\u043A \u043E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C cookie</h2><p class="mt-2"> \u0412 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430 \u0432\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0438\u043B\u0438 \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C cookie; \u044D\u0442\u043E \u043C\u043E\u0436\u0435\u0442 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0438\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u0443 \u0441\u0430\u0439\u0442\u0430 (\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044E \u0438\u043B\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u043A\u043E\u0440\u0437\u0438\u043D\u044B). </p></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[city_slug]/legal/cookies.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
