import { _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, computed, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate } from "vue/server-renderer";
import { u as useCity } from "./useCity-C2MHSDmF.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CityEventCard",
  __ssrInlineRender: true,
  props: {
    event: {}
  },
  setup(__props) {
    const props = __props;
    const { cityBasePath } = useCity();
    const formattedDate = computed(() => {
      try {
        return new Intl.DateTimeFormat("ru-RU", {
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit"
        }).format(new Date(props.event.starts_at));
      } catch {
        return "";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `${unref(cityBasePath)}/events/${__props.event.slug}`,
        class: "group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-primary/30 hover:shadow-md"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.event.cover_media_url) {
              _push2(`<div class="aspect-[16/9] bg-cover bg-center" style="${ssrRenderStyle({ backgroundImage: `url(${__props.event.cover_media_url})` })}"${_scopeId}></div>`);
            } else {
              _push2(`<div class="aspect-[16/9] bg-gradient-to-br from-indigo-100 to-violet-50"${_scopeId}></div>`);
            }
            _push2(`<div class="p-4"${_scopeId}><p class="text-xs font-medium uppercase tracking-wide text-indigo-600"${_scopeId}>${ssrInterpolate(unref(formattedDate))}</p><h3 class="mt-1 text-lg font-semibold text-gray-900 group-hover:text-primary"${_scopeId}>${ssrInterpolate(__props.event.title)}</h3>`);
            if (__props.event.description) {
              _push2(`<p class="mt-2 line-clamp-2 text-sm text-gray-600"${_scopeId}>${ssrInterpolate(__props.event.description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.event.price > 0) {
              _push2(`<p class="mt-3 text-sm font-medium text-gray-900"${_scopeId}> от ${ssrInterpolate(__props.event.price)} ₽ </p>`);
            } else {
              _push2(`<p class="mt-3 text-sm font-medium text-emerald-700"${_scopeId}>Бесплатно</p>`);
            }
            _push2(`</div>`);
          } else {
            return [
              __props.event.cover_media_url ? (openBlock(), createBlock("div", {
                key: 0,
                class: "aspect-[16/9] bg-cover bg-center",
                style: { backgroundImage: `url(${__props.event.cover_media_url})` }
              }, null, 4)) : (openBlock(), createBlock("div", {
                key: 1,
                class: "aspect-[16/9] bg-gradient-to-br from-indigo-100 to-violet-50"
              })),
              createVNode("div", { class: "p-4" }, [
                createVNode("p", { class: "text-xs font-medium uppercase tracking-wide text-indigo-600" }, toDisplayString(unref(formattedDate)), 1),
                createVNode("h3", { class: "mt-1 text-lg font-semibold text-gray-900 group-hover:text-primary" }, toDisplayString(__props.event.title), 1),
                __props.event.description ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "mt-2 line-clamp-2 text-sm text-gray-600"
                }, toDisplayString(__props.event.description), 1)) : createCommentVNode("", true),
                __props.event.price > 0 ? (openBlock(), createBlock("p", {
                  key: 1,
                  class: "mt-3 text-sm font-medium text-gray-900"
                }, " от " + toDisplayString(__props.event.price) + " ₽ ", 1)) : (openBlock(), createBlock("p", {
                  key: 2,
                  class: "mt-3 text-sm font-medium text-emerald-700"
                }, "Бесплатно"))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/city/CityEventCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
