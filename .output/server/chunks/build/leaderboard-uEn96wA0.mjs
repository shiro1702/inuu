import { i as useRoute, _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "leaderboard",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const citySlug = String(route.params.city_slug || "ulan-ude");
    const festivalSlug = String(route.params.festival_slug || "amtatai-2026");
    const topByItems = [
      { name: "Smash&Go", value: 3180 },
      { name: "Plov Point", value: 2640 },
      { name: "Bao Hub", value: 2415 }
    ];
    const topByRating = [
      { name: "Bao Hub", value: "4.9 (126)" },
      { name: "Smash&Go", value: "4.8 (214)" },
      { name: "Sushi Garage", value: "4.8 (119)" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-slate-950 text-white" }, _attrs))}><main class="mx-auto max-w-5xl px-4 py-8 pb-12 sm:px-6 sm:py-10">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/${unref(citySlug)}/festival/${unref(festivalSlug)}/`,
        class: "inline-flex text-sm font-medium text-amber-200 hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u2190 \u041D\u0430 \u0444\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044C `);
          } else {
            return [
              createTextVNode(" \u2190 \u041D\u0430 \u0444\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044C ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<header class="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-7"><p class="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">\u041F\u0443\u0431\u043B\u0438\u0447\u043D\u044B\u0439 \u044D\u043A\u0440\u0430\u043D</p><h1 class="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">\u041B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434 \u0444\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044F</h1><p class="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base"> \u0420\u0435\u0439\u0442\u0438\u043D\u0433 \u043A\u043E\u0440\u043D\u0435\u0440\u043E\u0432 \u0434\u043B\u044F \u0433\u043E\u0441\u0442\u0435\u0439, \u0441\u0446\u0435\u043D\u044B \u0438 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0442\u043E\u0440\u043E\u0432. \u0421\u0435\u0439\u0447\u0430\u0441 \u044D\u0442\u043E \u0434\u0435\u043C\u043E-\u0434\u0430\u043D\u043D\u044B\u0435: \u0432 \u0431\u043E\u0435\u0432\u043E\u043C \u0440\u0435\u0436\u0438\u043C\u0435 \u043C\u0435\u0441\u0442\u0430 \u0441\u0447\u0438\u0442\u0430\u044E\u0442\u0441\u044F \u043F\u043E \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u043C \u0437\u0430\u043A\u0430\u0437\u0430\u043C \u0438 \u043E\u0446\u0435\u043D\u043A\u0430\u043C \u0433\u043E\u0441\u0442\u0435\u0439. </p></header><section class="mt-6 grid gap-4 md:grid-cols-2"><article class="rounded-3xl border border-amber-300/30 bg-amber-400/15 p-4 sm:p-5"><div class="flex items-start justify-between gap-3"><div><p class="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">\u041D\u043E\u043C\u0438\u043D\u0430\u0446\u0438\u044F</p><h2 class="mt-2 text-2xl font-bold">\u0425\u0438\u0442 \u0444\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044F</h2></div><span class="rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-slate-950">\u043F\u043E \u043F\u0440\u043E\u0434\u0430\u0436\u0430\u043C</span></div><ol class="mt-5 space-y-3"><!--[-->`);
      ssrRenderList(topByItems, (row, idx) => {
        _push(`<li class="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-950"><span class="font-semibold">${ssrInterpolate(idx + 1)}. ${ssrInterpolate(row.name)}</span><span class="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 font-semibold text-amber-900">${ssrInterpolate(row.value)} \u043F\u043E\u0437. </span></li>`);
      });
      _push(`<!--]--></ol></article><article class="rounded-3xl border border-sky-300/30 bg-sky-400/15 p-4 sm:p-5"><div class="flex items-start justify-between gap-3"><div><p class="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">\u041D\u043E\u043C\u0438\u043D\u0430\u0446\u0438\u044F</p><h2 class="mt-2 text-2xl font-bold">\u041D\u0430\u0440\u043E\u0434\u043D\u0430\u044F \u043B\u044E\u0431\u043E\u0432\u044C</h2></div><span class="rounded-full bg-sky-300 px-3 py-1 text-xs font-bold text-slate-950">\u043F\u043E \u043E\u0446\u0435\u043D\u043A\u0430\u043C</span></div><ol class="mt-5 space-y-3"><!--[-->`);
      ssrRenderList(topByRating, (row, idx) => {
        _push(`<li class="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-950"><span class="font-semibold">${ssrInterpolate(idx + 1)}. ${ssrInterpolate(row.name)}</span><span class="shrink-0 rounded-full bg-sky-100 px-2.5 py-1 font-semibold text-sky-900">${ssrInterpolate(row.value)}</span></li>`);
      });
      _push(`<!--]--></ol></article></section><section class="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5 text-sm leading-6 text-slate-200"><h2 class="text-lg font-semibold text-white">\u041A\u0430\u043A \u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u0440\u0435\u0439\u0442\u0438\u043D\u0433</h2><p class="mt-2"> \xAB\u0425\u0438\u0442 \u0444\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044F\xBB \u0441\u043E\u0440\u0442\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u043F\u043E \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u0443 \u043F\u0440\u043E\u0434\u0430\u043D\u043D\u044B\u0445 \u043F\u043E\u0437\u0438\u0446\u0438\u0439. \xAB\u041D\u0430\u0440\u043E\u0434\u043D\u0430\u044F \u043B\u044E\u0431\u043E\u0432\u044C\xBB \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442 \u0441\u0440\u0435\u0434\u043D\u044E\u044E \u043E\u0446\u0435\u043D\u043A\u0443 \u0433\u043E\u0441\u0442\u0435\u0439 \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0437\u0430\u043A\u0430\u0437\u0430, \u043A\u043E\u0433\u0434\u0430 \u0443 \u043A\u043E\u0440\u043D\u0435\u0440\u0430 \u043D\u0430\u043A\u043E\u043F\u0438\u043B\u043E\u0441\u044C \u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u043E\u0442\u0437\u044B\u0432\u043E\u0432. </p></section></main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[city_slug]/festival/[festival_slug]/leaderboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
