import { _ as _sfc_main$1 } from './CityEventCard-CYTrH28h.mjs';
import { defineComponent, ref, watch, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { u as useCity } from './useCity-C2MHSDmF.mjs';
import { u as useHead } from './v3-AVe7cZyq.mjs';
import './server.mjs';
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
    const { slug, displayName } = useCity();
    const pending = ref(true);
    const items = ref([]);
    watch(slug, async () => {
      var _a;
      pending.value = true;
      try {
        const res = await $fetch(
          `/api/cities/${slug.value}/events`
        );
        items.value = (_a = res == null ? void 0 : res.items) != null ? _a : [];
      } finally {
        pending.value = false;
      }
    }, { immediate: true });
    useHead({ title: () => `\u0410\u0444\u0438\u0448\u0430 \u2014 ${displayName.value}` });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CityEventCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-bold text-gray-900">\u0410\u0444\u0438\u0448\u0430</h1><p class="mt-2 text-sm text-gray-600">\u0421\u043E\u0431\u044B\u0442\u0438\u044F \u0432 ${ssrInterpolate(unref(displayName))}</p>`);
      if (unref(pending)) {
        _push(`<div class="mt-8 text-sm text-gray-500">\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026</div>`);
      } else if (unref(items).length) {
        _push(`<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(items), (event) => {
          _push(ssrRenderComponent(_component_CityEventCard, {
            key: event.id,
            event
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p class="mt-8 text-sm text-gray-500">\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043D\u044B\u0445 \u0441\u043E\u0431\u044B\u0442\u0438\u0439.</p>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[city_slug]/events/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
