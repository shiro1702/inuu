import { i as useRoute, _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, computed, ref, watch, unref, mergeProps, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
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
    const eventSlug = computed(() => String(route.params.slug || ""));
    const pending = ref(true);
    const event = ref(null);
    const formattedDate = computed(() => {
      if (!event.value?.starts_at) return "";
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
      pending.value = true;
      try {
        const res = await $fetch(
          `/api/cities/${citySlug.value}/events/${eventSlug.value}`
        );
        event.value = res?.event ?? null;
      } catch {
        event.value = null;
      } finally {
        pending.value = false;
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (unref(pending)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-sm text-gray-500" }, _attrs))}>Загрузка…</div>`);
      } else if (!unref(event)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-sm text-gray-500" }, _attrs))}>Событие не найдено.</div>`);
      } else {
        _push(`<article${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `${unref(cityBasePath)}/events`,
          class: "text-sm text-primary hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`← Афиша`);
            } else {
              return [
                createTextVNode("← Афиша")
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
          _push(`<p class="font-medium">Билет: ${ssrInterpolate(unref(event).price)} ₽</p>`);
        } else {
          _push(`<p class="font-medium text-emerald-700">Вход бесплатный</p>`);
        }
        _push(`<p class="text-sm text-gray-500">Онлайн-запись и билеты — в следующем обновлении INUU.</p></article>`);
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
export {
  _sfc_main as default
};
