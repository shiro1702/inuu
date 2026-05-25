import { i as useRoute, _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, computed, ref, watch, unref, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
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
    const venueSlug = computed(() => String(route.params.slug || ""));
    const pending = ref(true);
    const venue = ref(null);
    const upcomingEvents = ref([]);
    watch([citySlug, venueSlug], async () => {
      var _a, _b;
      pending.value = true;
      try {
        const res = await $fetch(`/api/cities/${citySlug.value}/venues/${venueSlug.value}`);
        venue.value = (_a = res == null ? void 0 : res.venue) != null ? _a : null;
        upcomingEvents.value = (_b = res == null ? void 0 : res.upcomingEvents) != null ? _b : [];
      } catch {
        venue.value = null;
        upcomingEvents.value = [];
      } finally {
        pending.value = false;
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      if (unref(pending)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-sm text-gray-500" }, _attrs))}>\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026</div>`);
      } else if (!unref(venue)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-sm text-gray-500" }, _attrs))}>\u041C\u0435\u0441\u0442\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E.</div>`);
      } else {
        _push(`<article${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `${unref(cityBasePath)}/venues`,
          class: "text-sm text-primary hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u2190 \u041C\u0435\u0441\u0442\u0430`);
            } else {
              return [
                createTextVNode("\u2190 \u041C\u0435\u0441\u0442\u0430")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<h1 class="text-2xl font-bold text-gray-900">${ssrInterpolate(unref(venue).title)}</h1>`);
        if (unref(venue).address) {
          _push(`<p class="text-sm text-gray-600">${ssrInterpolate(unref(venue).address)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(venue).description) {
          _push(`<p class="text-gray-700">${ssrInterpolate(unref(venue).description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(venue).editorial_quote) {
          _push(`<p class="italic text-gray-600">\xAB${ssrInterpolate(unref(venue).editorial_quote)}\xBB</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(venue).phone) {
          _push(`<a${ssrRenderAttr("href", `tel:${unref(venue).phone}`)} class="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary"> \u041F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u044C </a>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(upcomingEvents).length) {
          _push(`<section class="pt-4"><h2 class="text-lg font-semibold text-gray-900">\u0421\u043E\u0431\u044B\u0442\u0438\u044F \u0437\u0434\u0435\u0441\u044C</h2><ul class="mt-2 space-y-2"><!--[-->`);
          ssrRenderList(unref(upcomingEvents), (ev) => {
            _push(`<li>`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `${unref(cityBasePath)}/events/${ev.slug}`,
              class: "text-primary hover:underline"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(ev.title)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(ev.title), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</article>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[city_slug]/venues/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
