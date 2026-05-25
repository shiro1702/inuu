import { j as useRouter, _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain } from "vue/server-renderer";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
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
  __name: "new",
  __ssrInlineRender: true,
  setup(__props) {
    const name = ref("");
    const address = ref("");
    ref(null);
    ref(null);
    const suggestItems = ref([]);
    const isSuggestLoading = ref(false);
    const supportsDelivery = ref(true);
    const supportsPickup = ref(true);
    const loading = ref(false);
    const errorMessage = ref(null);
    const successMessage = ref(null);
    useRouter();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-2xl" }, _attrs))}><nav class="mb-3 flex items-center gap-2 text-sm text-gray-500">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "hover:text-gray-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Дашборд`);
          } else {
            return [
              createTextVNode("Дашборд")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span>/</span>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/branches",
        class: "hover:text-gray-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Филиалы`);
          } else {
            return [
              createTextVNode("Филиалы")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span>/</span><span class="text-gray-700">Новый филиал</span></nav><div class="mb-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/branches",
        class: "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span aria-hidden="true"${_scopeId}>←</span> Назад к списку филиалов `);
          } else {
            return [
              createVNode("span", { "aria-hidden": "true" }, "←"),
              createTextVNode(" Назад к списку филиалов ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><h1 class="text-2xl font-semibold">Новый филиал</h1><p class="mt-2 text-sm text-gray-600">Создайте филиал для текущей организации.</p><form class="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-5"><label class="block space-y-1"><span class="text-sm font-medium text-gray-700">Название</span><input${ssrRenderAttr("value", name.value)} type="text" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Филиал на Ленина"></label><label class="block space-y-1"><span class="text-sm font-medium text-gray-700">Адрес</span><div class="relative"><input${ssrRenderAttr("value", address.value)} type="text" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="ул. Ленина, 10">`);
      if (isSuggestLoading.value) {
        _push(`<div class="pointer-events-none absolute inset-y-0 right-2 flex items-center"><svg class="h-4 w-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg></div>`);
      } else {
        _push(`<!---->`);
      }
      if (suggestItems.value.length) {
        _push(`<div class="absolute inset-x-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"><!--[-->`);
        ssrRenderList(suggestItems.value, (item) => {
          _push(`<button type="button" class="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-gray-800 transition hover:bg-gray-50"><span class="truncate">${ssrInterpolate(item.displayName)}</span></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></label><div class="flex gap-5 text-sm text-gray-700"><label class="inline-flex items-center gap-2"><input${ssrIncludeBooleanAttr(Array.isArray(supportsDelivery.value) ? ssrLooseContain(supportsDelivery.value, null) : supportsDelivery.value) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"> Доставка </label><label class="inline-flex items-center gap-2"><input${ssrIncludeBooleanAttr(Array.isArray(supportsPickup.value) ? ssrLooseContain(supportsPickup.value, null) : supportsPickup.value) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"> Самовывоз </label></div>`);
      if (errorMessage.value) {
        _push(`<p class="text-sm text-red-600">${ssrInterpolate(errorMessage.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (successMessage.value) {
        _push(`<p class="text-sm text-green-700">${ssrInterpolate(successMessage.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit" class="rounded-lg bg-[#E25E2D] px-4 py-2 text-sm font-medium text-white hover:bg-[#C84E24] disabled:opacity-50"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}>${ssrInterpolate(loading.value ? "Создание…" : "Создать филиал")}</button></form></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/branches/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
