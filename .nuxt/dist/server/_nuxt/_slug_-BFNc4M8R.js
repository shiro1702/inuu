import { i as useRoute, _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, computed, ref, watch, unref, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from "vue/server-renderer";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
import { u as useCity } from "./useCity-C2MHSDmF.js";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unctx/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/defu/dist/defu.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ufo/dist/index.mjs";
import "@supabase/ssr";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/klona/dist/index.mjs";
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
      pending.value = true;
      try {
        const res = await $fetch(`/api/cities/${citySlug.value}/venues/${venueSlug.value}`);
        venue.value = res?.venue ?? null;
        upcomingEvents.value = res?.upcomingEvents ?? [];
      } catch {
        venue.value = null;
        upcomingEvents.value = [];
      } finally {
        pending.value = false;
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (unref(pending)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-sm text-gray-500" }, _attrs))}>Загрузка…</div>`);
      } else if (!unref(venue)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-sm text-gray-500" }, _attrs))}>Место не найдено.</div>`);
      } else {
        _push(`<article${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `${unref(cityBasePath)}/venues`,
          class: "text-sm text-primary hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`← Места`);
            } else {
              return [
                createTextVNode("← Места")
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
          _push(`<p class="italic text-gray-600">«${ssrInterpolate(unref(venue).editorial_quote)}»</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(venue).phone) {
          _push(`<a${ssrRenderAttr("href", `tel:${unref(venue).phone}`)} class="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary"> Позвонить </a>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(upcomingEvents).length) {
          _push(`<section class="pt-4"><h2 class="text-lg font-semibold text-gray-900">События здесь</h2><ul class="mt-2 space-y-2"><!--[-->`);
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
export {
  _sfc_main as default
};
