import { _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useCity } from './useCity-C2MHSDmF.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CityVenueCard",
  __ssrInlineRender: true,
  props: {
    venue: {}
  },
  setup(__props) {
    const { cityBasePath } = useCity();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `${unref(cityBasePath)}/venues/${__props.venue.slug}`,
        class: "group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-primary/30 hover:shadow-md"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            if (__props.venue.cover_media_url) {
              _push2(`<div class="aspect-[4/3] bg-cover bg-center" style="${ssrRenderStyle({ backgroundImage: `url(${__props.venue.cover_media_url})` })}"${_scopeId}></div>`);
            } else {
              _push2(`<div class="aspect-[4/3] bg-gradient-to-br from-amber-50 to-orange-100"${_scopeId}></div>`);
            }
            _push2(`<div class="p-4"${_scopeId}><h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary"${_scopeId}>${ssrInterpolate(__props.venue.title)}</h3>`);
            if (__props.venue.address) {
              _push2(`<p class="mt-1 text-sm text-gray-500"${_scopeId}>${ssrInterpolate(__props.venue.address)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.venue.editorial_quote) {
              _push2(`<p class="mt-2 text-sm italic text-gray-600"${_scopeId}> \xAB${ssrInterpolate(__props.venue.editorial_quote)}\xBB </p>`);
            } else {
              _push2(`<!---->`);
            }
            if ((_a = __props.venue.vibe_tags) == null ? void 0 : _a.length) {
              _push2(`<div class="mt-3 flex flex-wrap gap-1"${_scopeId}><!--[-->`);
              ssrRenderList(__props.venue.vibe_tags.slice(0, 4), (tag) => {
                _push2(`<span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"${_scopeId}>${ssrInterpolate(tag)}</span>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              __props.venue.cover_media_url ? (openBlock(), createBlock("div", {
                key: 0,
                class: "aspect-[4/3] bg-cover bg-center",
                style: { backgroundImage: `url(${__props.venue.cover_media_url})` }
              }, null, 4)) : (openBlock(), createBlock("div", {
                key: 1,
                class: "aspect-[4/3] bg-gradient-to-br from-amber-50 to-orange-100"
              })),
              createVNode("div", { class: "p-4" }, [
                createVNode("h3", { class: "text-lg font-semibold text-gray-900 group-hover:text-primary" }, toDisplayString(__props.venue.title), 1),
                __props.venue.address ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "mt-1 text-sm text-gray-500"
                }, toDisplayString(__props.venue.address), 1)) : createCommentVNode("", true),
                __props.venue.editorial_quote ? (openBlock(), createBlock("p", {
                  key: 1,
                  class: "mt-2 text-sm italic text-gray-600"
                }, " \xAB" + toDisplayString(__props.venue.editorial_quote) + "\xBB ", 1)) : createCommentVNode("", true),
                ((_b = __props.venue.vibe_tags) == null ? void 0 : _b.length) ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "mt-3 flex flex-wrap gap-1"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.venue.vibe_tags.slice(0, 4), (tag) => {
                    return openBlock(), createBlock("span", {
                      key: tag,
                      class: "rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                    }, toDisplayString(tag), 1);
                  }), 128))
                ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/city/CityVenueCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
