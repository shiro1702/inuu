import { _ as __nuxt_component_0 } from "../server.mjs";
import { _ as _sfc_main$1 } from "./CityEventCard-CYTrH28h.js";
import { _ as _sfc_main$2 } from "./CityVenueCard-DXbQkEeB.js";
import { defineComponent, ref, watch, unref, mergeProps, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
import { u as useCity } from "./useCity-C2MHSDmF.js";
import { u as useHead } from "./v3-AVe7cZyq.js";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unctx/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/defu/dist/defu.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ufo/dist/index.mjs";
import "@supabase/ssr";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/klona/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { slug, cityBasePath, displayName } = useCity();
    const pending = ref(true);
    const loadError = ref(null);
    const home = ref(null);
    async function loadHome() {
      pending.value = true;
      loadError.value = null;
      try {
        const res = await $fetch(`/api/cities/${slug.value}/home`);
        if (!res?.ok) {
          loadError.value = "Не удалось загрузить главную";
          home.value = null;
          return;
        }
        home.value = {
          stories: res.stories ?? [],
          events: res.events ?? [],
          venues: res.venues ?? [],
          curatedLists: res.curatedLists ?? []
        };
      } catch (e) {
        loadError.value = e instanceof Error ? e.message : "Ошибка загрузки";
        home.value = null;
      } finally {
        pending.value = false;
      }
    }
    watch(slug, () => {
      void loadHome();
    }, { immediate: true });
    useHead({
      title: () => `${displayName.value} — INUU`
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_CityEventCard = _sfc_main$1;
      const _component_CityVenueCard = _sfc_main$2;
      if (unref(pending)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-16 text-center text-sm text-gray-500" }, _attrs))}> Загружаем город… </div>`);
      } else if (unref(loadError)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" }, _attrs))}>${ssrInterpolate(unref(loadError))}</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-10" }, _attrs))}><section><h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">${ssrInterpolate(unref(displayName))}</h1><p class="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base"> Афиша, места и подборки — городской гид INUU. </p></section>`);
        if (unref(home)?.stories?.length) {
          _push(`<section><h2 class="mb-3 text-lg font-semibold text-gray-900">Stories</h2><div class="flex gap-3 overflow-x-auto pb-2"><!--[-->`);
          ssrRenderList(unref(home).stories, (story) => {
            _push(`<div class="h-20 w-20 shrink-0 rounded-full border-2 border-indigo-500 bg-gradient-to-br from-indigo-100 to-violet-200 p-1"><div class="flex h-full w-full items-center justify-center rounded-full bg-white text-center text-[10px] font-medium leading-tight text-gray-800">${ssrInterpolate(story.title)}</div></div>`);
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(home)?.curatedLists?.length) {
          _push(`<section><h2 class="mb-3 text-lg font-semibold text-gray-900">Подборки</h2><div class="grid gap-3 sm:grid-cols-2"><!--[-->`);
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
        _push(`<section><div class="mb-4 flex items-center justify-between gap-2"><h2 class="text-lg font-semibold text-gray-900">Афиша</h2>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `${unref(cityBasePath)}/events`,
          class: "text-sm font-medium text-primary hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Все события `);
            } else {
              return [
                createTextVNode(" Все события ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (unref(home)?.events?.length) {
          _push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          ssrRenderList(unref(home).events, (event) => {
            _push(ssrRenderComponent(_component_CityEventCard, {
              key: event.id,
              event
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<p class="text-sm text-gray-500">Скоро появятся новые события.</p>`);
        }
        _push(`</section><section><div class="mb-4 flex items-center justify-between gap-2"><h2 class="text-lg font-semibold text-gray-900">Места</h2>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `${unref(cityBasePath)}/venues`,
          class: "text-sm font-medium text-primary hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Все места `);
            } else {
              return [
                createTextVNode(" Все места ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (unref(home)?.venues?.length) {
          _push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          ssrRenderList(unref(home).venues, (venue) => {
            _push(ssrRenderComponent(_component_CityVenueCard, {
              key: venue.id,
              venue
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<p class="text-sm text-gray-500">Места появятся в ближайшее время.</p>`);
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
export {
  _sfc_main as default
};
