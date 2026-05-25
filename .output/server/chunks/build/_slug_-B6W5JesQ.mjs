import { i as useRoute, _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, computed, ref, watch, unref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useCity } from './useCity-C2MHSDmF.mjs';
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
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { slug: citySlug, cityBasePath } = useCity();
    const eventSlug = computed(() => String(route.params.slug || ""));
    const pending = ref(true);
    const event = ref(null);
    const formattedDate = computed(() => {
      var _a;
      if (!((_a = event.value) == null ? void 0 : _a.starts_at)) return "";
      try {
        return new Intl.DateTimeFormat("ru-RU", {
          dateStyle: "long",
          timeStyle: "short"
        }).format(new Date(event.value.starts_at));
      } catch {
        return "";
      }
    });
    watch([citySlug, eventSlug], async () => {
      var _a;
      pending.value = true;
      try {
        const res = await $fetch(
          `/api/cities/${citySlug.value}/events/${eventSlug.value}`
        );
        event.value = (_a = res == null ? void 0 : res.event) != null ? _a : null;
      } catch {
        event.value = null;
      } finally {
        pending.value = false;
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      if (unref(pending)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-sm text-gray-500" }, _attrs))}>\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026</div>`);
      } else if (!unref(event)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-sm text-gray-500" }, _attrs))}>\u0421\u043E\u0431\u044B\u0442\u0438\u0435 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E.</div>`);
      } else {
        _push(`<article${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `${unref(cityBasePath)}/events`,
          class: "text-sm text-primary hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u2190 \u0410\u0444\u0438\u0448\u0430`);
            } else {
              return [
                createTextVNode("\u2190 \u0410\u0444\u0438\u0448\u0430")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<h1 class="text-2xl font-bold text-gray-900">${ssrInterpolate(unref(event).title)}</h1><p class="text-sm text-gray-500">${ssrInterpolate(unref(formattedDate))}</p>`);
        if (unref(event).description) {
          _push(`<p class="text-gray-700">${ssrInterpolate(unref(event).description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(event).price > 0) {
          _push(`<p class="font-medium">\u0411\u0438\u043B\u0435\u0442: ${ssrInterpolate(unref(event).price)} \u20BD</p>`);
        } else {
          _push(`<p class="font-medium text-emerald-700">\u0412\u0445\u043E\u0434 \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u044B\u0439</p>`);
        }
        _push(`<p class="text-sm text-gray-500">\u041E\u043D\u043B\u0430\u0439\u043D-\u0437\u0430\u043F\u0438\u0441\u044C \u0438 \u0431\u0438\u043B\u0435\u0442\u044B \u2014 \u0432 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u043C \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0438 INUU.</p></article>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[city_slug]/events/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
