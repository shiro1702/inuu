import { _ as _sfc_main$1 } from "./CityVenueCard-DXbQkEeB.js";
import { defineComponent, ref, watch, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
import { u as useCity } from "./useCity-C2MHSDmF.js";
import { u as useHead } from "./v3-AVe7cZyq.js";
import "../server.mjs";
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
    const { slug, displayName } = useCity();
    const pending = ref(true);
    const items = ref([]);
    watch(slug, async () => {
      pending.value = true;
      try {
        const res = await $fetch(
          `/api/cities/${slug.value}/venues`
        );
        items.value = res?.items ?? [];
      } finally {
        pending.value = false;
      }
    }, { immediate: true });
    useHead({ title: () => `Места — ${displayName.value}` });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CityVenueCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-bold text-gray-900">Места</h1><p class="mt-2 text-sm text-gray-600">Заведения и точки в ${ssrInterpolate(unref(displayName))}</p>`);
      if (unref(pending)) {
        _push(`<div class="mt-8 text-sm text-gray-500">Загрузка…</div>`);
      } else if (unref(items).length) {
        _push(`<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(items), (venue) => {
          _push(ssrRenderComponent(_component_CityVenueCard, {
            key: venue.id,
            venue
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p class="mt-8 text-sm text-gray-500">Пока нет опубликованных мест.</p>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[city_slug]/venues/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
