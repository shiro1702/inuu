import { a as __nuxt_component_0, _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, computed, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs } from 'vue/server-renderer';
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
  __name: "integrations",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const isNotificationSettingsRoute = computed(
      () => route.path.includes("/dashboard/integrations/notifications/")
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$2;
      if (isNotificationSettingsRoute.value) {
        _push(ssrRenderComponent(_component_NuxtPage, _attrs, null, _parent));
      } else {
        _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h1 class="text-2xl font-semibold">\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F</h1><p class="text-sm text-gray-600"> \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u043E\u043C\u043D\u0438\u043A\u0430\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0439 \u0434\u043B\u044F \u043A\u043E\u043C\u0430\u043D\u0434\u044B. \u0418\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438 POS \u0438 \u043C\u0435\u043D\u044E \u0432 INUU \u043D\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u044E\u0442\u0441\u044F. </p><p class="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700"> \u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0439 \u0434\u043B\u044F \u0444\u0438\u043B\u0438\u0430\u043B\u0430 \u0438\u0437 \u0440\u0430\u0437\u0434\u0435\u043B\u0430 `);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/branches",
          class: "font-medium text-primary underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u0422\u043E\u0447\u043A\u0438`);
            } else {
              return [
                createTextVNode("\u0422\u043E\u0447\u043A\u0438")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(` \u0438\u043B\u0438 \u043F\u0435\u0440\u0435\u0439\u0434\u0438\u0442\u0435 \u043F\u043E \u043F\u0440\u044F\u043C\u043E\u0439 \u0441\u0441\u044B\u043B\u043A\u0435 \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430 \u0444\u0438\u043B\u0438\u0430\u043B\u043E\u0432. </p></section>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/integrations.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
