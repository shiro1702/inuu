import { _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, computed, mergeProps, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { useRoute } from "vue-router";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unctx/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/h3/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/defu/dist/defu.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ufo/dist/index.mjs";
import "@supabase/ssr";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/klona/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cookies",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const cityBase = computed(() => {
      const cs = route.params.city_slug;
      const city = Array.isArray(cs) ? cs[0] : cs;
      return typeof city === "string" && city.trim() ? `/${city.trim()}` : "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-4 py-8 text-sm leading-6 text-gray-700 sm:px-6" }, _attrs))}><h1 class="text-2xl font-semibold text-gray-900">Файлы cookie и локальное хранилище</h1><p class="mt-4"> Платформа pocketmenu.ru использует файлы cookie и аналогичные технологии (например, localStorage), чтобы обеспечить вход в аккаунт, сохранение корзины, сессию и безопасность сервиса. Часть данных обрабатывается также в соответствии с `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `${cityBase.value}/legal/privacy`,
        class: "text-primary underline decoration-dotted hover:text-primary-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Политикой конфиденциальности `);
          } else {
            return [
              createTextVNode(" Политикой конфиденциальности ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` и `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `${cityBase.value}/legal/consent`,
        class: "text-primary underline decoration-dotted hover:text-primary-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Согласием на обработку персональных данных `);
          } else {
            return [
              createTextVNode(" Согласием на обработку персональных данных ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` . </p><h2 class="mt-6 text-lg font-semibold text-gray-900">Как отключить cookie</h2><p class="mt-2"> В настройках браузера вы можете удалить или блокировать cookie; это может ограничить работу сайта (например, авторизацию или сохранение корзины). </p></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[city_slug]/legal/cookies.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
