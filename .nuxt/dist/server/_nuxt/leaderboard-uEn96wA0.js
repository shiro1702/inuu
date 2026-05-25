import { i as useRoute, _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unctx/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/defu/dist/defu.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ufo/dist/index.mjs";
import "@supabase/ssr";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/klona/dist/index.mjs";
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
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-slate-950 text-white" }, _attrs))}><main class="mx-auto max-w-5xl px-4 py-8 pb-12 sm:px-6 sm:py-10">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/${unref(citySlug)}/festival/${unref(festivalSlug)}/`,
        class: "inline-flex text-sm font-medium text-amber-200 hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ← На фестиваль `);
          } else {
            return [
              createTextVNode(" ← На фестиваль ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<header class="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-7"><p class="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">Публичный экран</p><h1 class="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Лидерборд фестиваля</h1><p class="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base"> Рейтинг корнеров для гостей, сцены и организаторов. Сейчас это демо-данные: в боевом режиме места считаются по реальным заказам и оценкам гостей. </p></header><section class="mt-6 grid gap-4 md:grid-cols-2"><article class="rounded-3xl border border-amber-300/30 bg-amber-400/15 p-4 sm:p-5"><div class="flex items-start justify-between gap-3"><div><p class="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">Номинация</p><h2 class="mt-2 text-2xl font-bold">Хит фестиваля</h2></div><span class="rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-slate-950">по продажам</span></div><ol class="mt-5 space-y-3"><!--[-->`);
      ssrRenderList(topByItems, (row, idx) => {
        _push(`<li class="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-950"><span class="font-semibold">${ssrInterpolate(idx + 1)}. ${ssrInterpolate(row.name)}</span><span class="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 font-semibold text-amber-900">${ssrInterpolate(row.value)} поз. </span></li>`);
      });
      _push(`<!--]--></ol></article><article class="rounded-3xl border border-sky-300/30 bg-sky-400/15 p-4 sm:p-5"><div class="flex items-start justify-between gap-3"><div><p class="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">Номинация</p><h2 class="mt-2 text-2xl font-bold">Народная любовь</h2></div><span class="rounded-full bg-sky-300 px-3 py-1 text-xs font-bold text-slate-950">по оценкам</span></div><ol class="mt-5 space-y-3"><!--[-->`);
      ssrRenderList(topByRating, (row, idx) => {
        _push(`<li class="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-950"><span class="font-semibold">${ssrInterpolate(idx + 1)}. ${ssrInterpolate(row.name)}</span><span class="shrink-0 rounded-full bg-sky-100 px-2.5 py-1 font-semibold text-sky-900">${ssrInterpolate(row.value)}</span></li>`);
      });
      _push(`<!--]--></ol></article></section><section class="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5 text-sm leading-6 text-slate-200"><h2 class="text-lg font-semibold text-white">Как считается рейтинг</h2><p class="mt-2"> «Хит фестиваля» сортируется по количеству проданных позиций. «Народная любовь» учитывает среднюю оценку гостей после получения заказа, когда у корнера накопилось достаточно отзывов. </p></section></main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[city_slug]/festival/[festival_slug]/leaderboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
