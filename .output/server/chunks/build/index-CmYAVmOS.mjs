import { _ as __nuxt_component_0$2 } from './server.mjs';
import { _ as _sfc_main$1 } from './CityEventCard-CYTrH28h.mjs';
import { _ as _sfc_main$2 } from './CityVenueCard-DXbQkEeB.mjs';
import { defineComponent, ref, watch, unref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { u as useCity } from './useCity-C2MHSDmF.mjs';
import { u as useHead } from './v3-AVe7cZyq.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { slug, cityBasePath, displayName } = useCity();
    const pending = ref(true);
    const loadError = ref(null);
    const home = ref(null);
    async function loadHome() {
      var _a, _b, _c, _d;
      pending.value = true;
      loadError.value = null;
      try {
        const res = await $fetch(`/api/cities/${slug.value}/home`);
        if (!(res == null ? void 0 : res.ok)) {
          loadError.value = "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0433\u043B\u0430\u0432\u043D\u0443\u044E";
          home.value = null;
          return;
        }
        home.value = {
          stories: (_a = res.stories) != null ? _a : [],
          events: (_b = res.events) != null ? _b : [],
          venues: (_c = res.venues) != null ? _c : [],
          curatedLists: (_d = res.curatedLists) != null ? _d : []
        };
      } catch (e) {
        loadError.value = e instanceof Error ? e.message : "\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438";
        home.value = null;
      } finally {
        pending.value = false;
      }
    }
    watch(slug, () => {
      void loadHome();
    }, { immediate: true });
    useHead({
      title: () => `${displayName.value} \u2014 INUU`
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const _component_NuxtLink = __nuxt_component_0$2;
      const _component_CityEventCard = _sfc_main$1;
      const _component_CityVenueCard = _sfc_main$2;
      if (unref(pending)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-16 text-center text-sm text-gray-500" }, _attrs))}> \u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C \u0433\u043E\u0440\u043E\u0434\u2026 </div>`);
      } else if (unref(loadError)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" }, _attrs))}>${ssrInterpolate(unref(loadError))}</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-10" }, _attrs))}><section><h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">${ssrInterpolate(unref(displayName))}</h1><p class="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base"> \u0410\u0444\u0438\u0448\u0430, \u043C\u0435\u0441\u0442\u0430 \u0438 \u043F\u043E\u0434\u0431\u043E\u0440\u043A\u0438 \u2014 \u0433\u043E\u0440\u043E\u0434\u0441\u043A\u043E\u0439 \u0433\u0438\u0434 INUU. </p></section>`);
        if ((_b = (_a = unref(home)) == null ? void 0 : _a.stories) == null ? void 0 : _b.length) {
          _push(`<section><h2 class="mb-3 text-lg font-semibold text-gray-900">Stories</h2><div class="flex gap-3 overflow-x-auto pb-2"><!--[-->`);
          ssrRenderList(unref(home).stories, (story) => {
            _push(`<div class="h-20 w-20 shrink-0 rounded-full border-2 border-indigo-500 bg-gradient-to-br from-indigo-100 to-violet-200 p-1"><div class="flex h-full w-full items-center justify-center rounded-full bg-white text-center text-[10px] font-medium leading-tight text-gray-800">${ssrInterpolate(story.title)}</div></div>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if ((_d = (_c = unref(home)) == null ? void 0 : _c.curatedLists) == null ? void 0 : _d.length) {
          _push(`<section><h2 class="mb-3 text-lg font-semibold text-gray-900">\u041F\u043E\u0434\u0431\u043E\u0440\u043A\u0438</h2><div class="grid gap-3 sm:grid-cols-2"><!--[-->`);
          ssrRenderList(unref(home).curatedLists, (list) => {
            _push(`<article class="rounded-xl border border-gray-200 bg-white p-4"><h3 class="font-semibold text-gray-900">${ssrInterpolate(list.title)}</h3>`);
            if (list.description) {
              _push(`<p class="mt-1 text-sm text-gray-600">${ssrInterpolate(list.description)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</article>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<section><div class="mb-4 flex items-center justify-between gap-2"><h2 class="text-lg font-semibold text-gray-900">\u0410\u0444\u0438\u0448\u0430</h2>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `${unref(cityBasePath)}/events`,
          class: "text-sm font-medium text-primary hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u0412\u0441\u0435 \u0441\u043E\u0431\u044B\u0442\u0438\u044F `);
            } else {
              return [
                createTextVNode(" \u0412\u0441\u0435 \u0441\u043E\u0431\u044B\u0442\u0438\u044F ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if ((_f = (_e = unref(home)) == null ? void 0 : _e.events) == null ? void 0 : _f.length) {
          _push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          ssrRenderList(unref(home).events, (event) => {
            _push(ssrRenderComponent(_component_CityEventCard, {
              key: event.id,
              event
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<p class="text-sm text-gray-500">\u0421\u043A\u043E\u0440\u043E \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u043D\u043E\u0432\u044B\u0435 \u0441\u043E\u0431\u044B\u0442\u0438\u044F.</p>`);
        }
        _push(`</section><section><div class="mb-4 flex items-center justify-between gap-2"><h2 class="text-lg font-semibold text-gray-900">\u041C\u0435\u0441\u0442\u0430</h2>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `${unref(cityBasePath)}/venues`,
          class: "text-sm font-medium text-primary hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u0412\u0441\u0435 \u043C\u0435\u0441\u0442\u0430 `);
            } else {
              return [
                createTextVNode(" \u0412\u0441\u0435 \u043C\u0435\u0441\u0442\u0430 ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if ((_h = (_g = unref(home)) == null ? void 0 : _g.venues) == null ? void 0 : _h.length) {
          _push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          ssrRenderList(unref(home).venues, (venue) => {
            _push(ssrRenderComponent(_component_CityVenueCard, {
              key: venue.id,
              venue
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<p class="text-sm text-gray-500">\u041C\u0435\u0441\u0442\u0430 \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u0432 \u0431\u043B\u0438\u0436\u0430\u0439\u0448\u0435\u0435 \u0432\u0440\u0435\u043C\u044F.</p>`);
        }
        _push(`</section></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[city_slug]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
