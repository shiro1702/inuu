import { c as _export_sfc, _ as __nuxt_component_0$2 } from './server.mjs';
import { mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
import 'vue-router';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0$2;
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-2xl px-4 py-10" }, _attrs))}><h1 class="text-2xl font-semibold">\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D</h1><p class="mt-2 text-sm text-gray-600"> \u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F \u0444\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u044E\u0442\u0441\u044F \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435 \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u043E\u0433\u043E \u043A\u043E\u0440\u043D\u0435\u0440\u0430. </p>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` \u041D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E `);
      } else {
        return [
          createTextVNode(" \u041D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</section>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/achievements.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const achievements = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { achievements as default };
