import { a as __nuxt_component_0, _ as __nuxt_component_0$1 } from "../server.mjs";
import { defineComponent, computed, mergeProps, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttrs } from "vue/server-renderer";
import { useRoute } from "vue-router";
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
  __name: "integrations",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const isNotificationSettingsRoute = computed(
      () => route.path.includes("/dashboard/integrations/notifications/")
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      if (isNotificationSettingsRoute.value) {
        _push(ssrRenderComponent(_component_NuxtPage, _attrs, null, _parent));
      } else {
        _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h1 class="text-2xl font-semibold">Уведомления</h1><p class="text-sm text-gray-600"> Настройка омниканальных уведомлений для команды. Интеграции POS и меню в INUU не используются. </p><p class="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700"> Откройте настройки уведомлений для филиала из раздела `);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/branches",
          class: "font-medium text-primary underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Точки`);
            } else {
              return [
                createTextVNode("Точки")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(` или перейдите по прямой ссылке из списка филиалов. </p></section>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/integrations.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
