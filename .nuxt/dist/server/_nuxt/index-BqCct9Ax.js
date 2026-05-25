import { _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderComponent } from "vue/server-renderer";
import { useRouter } from "vue-router";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unctx/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/h3/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/defu/dist/defu.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ufo/dist/index.mjs";
import "@supabase/ssr";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/klona/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const items = ref([]);
    const pending = ref(true);
    const error = ref("");
    const creating = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-semibold">Сториз</h1><p class="mt-2 text-sm text-gray-600"> Кампании для витрины: кружочки над каталогом и баннеры в сетке товаров. </p></div><button type="button" class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"${ssrIncludeBooleanAttr(creating.value) ? " disabled" : ""}>${ssrInterpolate(creating.value ? "Создание…" : "Новая кампания")}</button></div><div class="rounded-xl border border-gray-200 bg-white">`);
      if (pending.value) {
        _push(`<div class="p-4 text-sm text-gray-500">Загрузка…</div>`);
      } else if (error.value) {
        _push(`<div class="p-4 text-sm text-red-500">${ssrInterpolate(error.value)}</div>`);
      } else if (!items.value.length) {
        _push(`<div class="p-4 text-sm text-gray-500">Нет кампаний.</div>`);
      } else {
        _push(`<ul class="divide-y divide-gray-100"><!--[-->`);
        ssrRenderList(items.value, (c) => {
          _push(`<li class="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-gray-50"><div class="flex min-w-0 items-center gap-3"><div class="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-50">`);
          if (c.previewUrl) {
            _push(`<img${ssrRenderAttr("src", c.previewUrl)} alt="" class="h-full w-full object-cover">`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="min-w-0"><p class="font-medium text-gray-900">${ssrInterpolate(c.title)}</p><p class="mt-0.5 text-xs text-gray-500">${ssrInterpolate(c.placement === "top_bar" ? "Верхняя полоса" : "Сетка каталога")} · слайдов: ${ssrInterpolate(c.slides?.length ?? 0)}</p></div></div><div class="flex items-center gap-2">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/dashboard/stories/campaigns/${c.id}`,
            class: "text-sm text-primary hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Редактировать `);
              } else {
                return [
                  createTextVNode(" Редактировать ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<button type="button" class="text-sm text-red-600 hover:underline"> Удалить </button></div></li>`);
        });
        _push(`<!--]--></ul>`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/stories/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
