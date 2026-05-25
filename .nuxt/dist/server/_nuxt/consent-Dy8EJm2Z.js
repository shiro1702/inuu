import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
import { c as _export_sfc } from "../server.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unctx/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/defu/dist/defu.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ufo/dist/index.mjs";
import "@supabase/ssr";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/klona/dist/index.mjs";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<main${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-4 py-8 text-sm leading-6 text-gray-700 sm:px-6" }, _attrs))}><h1 class="text-2xl font-semibold text-gray-900">Согласие на обработку персональных данных</h1><p class="mt-4"> Пользователь, отправляя данные через формы платформы pocketmenu.ru (&quot;меню в вашем кармане&quot;), выражает согласие на обработку персональных данных оператором платформы в соответствии с законодательством РФ. </p><h2 class="mt-6 text-lg font-semibold text-gray-900">1. Перечень персональных данных</h2><p class="mt-2"> Номер телефона, Telegram ID, IP-адрес, cookies и иные технические данные, необходимые для работы платформы. </p><h2 class="mt-6 text-lg font-semibold text-gray-900">2. Цели обработки</h2><p class="mt-2"> Регистрация и авторизация, передача заказов в рестораны, обеспечение работы личного кабинета, связь с пользователем, предотвращение злоупотреблений и поддержка работы сервиса. </p><h2 class="mt-6 text-lg font-semibold text-gray-900">3. Срок действия согласия</h2><p class="mt-2"> Согласие действует в течение 1 (одного) года с момента последнего взаимодействия с платформой либо до момента отзыва согласия субъектом персональных данных. </p><h2 class="mt-6 text-lg font-semibold text-gray-900">4. Передача данных третьим лицам</h2><p class="mt-2"> Пользователь соглашается на передачу данных организациям и сервисам, необходимым для работы платформы: Supabase, Telegram, эквайринговые сервисы/банки, а также рестораны-продавцы для исполнения заказов. </p><h2 class="mt-6 text-lg font-semibold text-gray-900">5. Отзыв согласия</h2><p class="mt-2"> Согласие может быть отозвано по обращению на shiro1702@gmail.com, по телефону +7 999 619-63-61 или через Telegram: @arsalanbar. Срок ответа на обращение: до 10 рабочих дней. </p></main>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[city_slug]/legal/consent.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const consent = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  consent as default
};
