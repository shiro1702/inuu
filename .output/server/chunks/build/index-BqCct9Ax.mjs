import { _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
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
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-semibold">\u0421\u0442\u043E\u0440\u0438\u0437</h1><p class="mt-2 text-sm text-gray-600"> \u041A\u0430\u043C\u043F\u0430\u043D\u0438\u0438 \u0434\u043B\u044F \u0432\u0438\u0442\u0440\u0438\u043D\u044B: \u043A\u0440\u0443\u0436\u043E\u0447\u043A\u0438 \u043D\u0430\u0434 \u043A\u0430\u0442\u0430\u043B\u043E\u0433\u043E\u043C \u0438 \u0431\u0430\u043D\u043D\u0435\u0440\u044B \u0432 \u0441\u0435\u0442\u043A\u0435 \u0442\u043E\u0432\u0430\u0440\u043E\u0432. </p></div><button type="button" class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"${ssrIncludeBooleanAttr(creating.value) ? " disabled" : ""}>${ssrInterpolate(creating.value ? "\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435\u2026" : "\u041D\u043E\u0432\u0430\u044F \u043A\u0430\u043C\u043F\u0430\u043D\u0438\u044F")}</button></div><div class="rounded-xl border border-gray-200 bg-white">`);
      if (pending.value) {
        _push(`<div class="p-4 text-sm text-gray-500">\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026</div>`);
      } else if (error.value) {
        _push(`<div class="p-4 text-sm text-red-500">${ssrInterpolate(error.value)}</div>`);
      } else if (!items.value.length) {
        _push(`<div class="p-4 text-sm text-gray-500">\u041D\u0435\u0442 \u043A\u0430\u043C\u043F\u0430\u043D\u0438\u0439.</div>`);
      } else {
        _push(`<ul class="divide-y divide-gray-100"><!--[-->`);
        ssrRenderList(items.value, (c) => {
          var _a, _b;
          _push(`<li class="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-gray-50"><div class="flex min-w-0 items-center gap-3"><div class="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-50">`);
          if (c.previewUrl) {
            _push(`<img${ssrRenderAttr("src", c.previewUrl)} alt="" class="h-full w-full object-cover">`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="min-w-0"><p class="font-medium text-gray-900">${ssrInterpolate(c.title)}</p><p class="mt-0.5 text-xs text-gray-500">${ssrInterpolate(c.placement === "top_bar" ? "\u0412\u0435\u0440\u0445\u043D\u044F\u044F \u043F\u043E\u043B\u043E\u0441\u0430" : "\u0421\u0435\u0442\u043A\u0430 \u043A\u0430\u0442\u0430\u043B\u043E\u0433\u0430")} \xB7 \u0441\u043B\u0430\u0439\u0434\u043E\u0432: ${ssrInterpolate((_b = (_a = c.slides) == null ? void 0 : _a.length) != null ? _b : 0)}</p></div></div><div class="flex items-center gap-2">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/dashboard/stories/campaigns/${c.id}`,
            class: "text-sm text-primary hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` \u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C `);
              } else {
                return [
                  createTextVNode(" \u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<button type="button" class="text-sm text-red-600 hover:underline"> \u0423\u0434\u0430\u043B\u0438\u0442\u044C </button></div></li>`);
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

export { _sfc_main as default };
