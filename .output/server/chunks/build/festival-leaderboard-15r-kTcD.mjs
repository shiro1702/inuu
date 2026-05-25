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
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h1 class="text-2xl font-semibold text-gray-900">\u041B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434 \u043F\u0435\u0440\u0435\u043D\u0435\u0441\u0435\u043D</h1><p class="text-sm text-gray-600"> \u041F\u0443\u0431\u043B\u0438\u0447\u043D\u044B\u0439 \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434 \u0444\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044F \u0442\u0435\u043F\u0435\u0440\u044C \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0432 \u0433\u043E\u0441\u0442\u0435\u0432\u043E\u0439 \u0447\u0430\u0441\u0442\u0438. </p>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/ulan-ude/festival/amtatai-2026/leaderboard",
    class: "inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` \u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0443\u0431\u043B\u0438\u0447\u043D\u044B\u0439 \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434 `);
      } else {
        return [
          createTextVNode(" \u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0443\u0431\u043B\u0438\u0447\u043D\u044B\u0439 \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434 ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/festival-leaderboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const festivalLeaderboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { festivalLeaderboard as default };
