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
  _push(`<main${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-4 py-8 text-sm leading-6 text-gray-700 sm:px-6" }, _attrs))}><h1 class="text-2xl font-semibold text-gray-900">Политика конфиденциальности</h1><p class="mt-4"> Настоящая Политика определяет порядок обработки персональных данных пользователей платформы pocketmenu.ru (&quot;меню в вашем кармане&quot;). Оператор платформы: ИП Баранзаев Арсалан Баярович, ИНН 032384437278, ОГРНИП 325030000033105. </p><h2 class="mt-6 text-lg font-semibold text-gray-900">1. Какие данные обрабатываются</h2><p class="mt-2"> Мы можем обрабатывать следующие данные: номер телефона, Telegram ID, IP-адрес, cookies, а также технические данные о работе сервиса. </p><h2 class="mt-6 text-lg font-semibold text-gray-900">2. Цели и основания обработки</h2><p class="mt-2"> Данные обрабатываются для регистрации и авторизации, работы личного кабинета, передачи заказов в рестораны, обратной связи и обеспечения безопасности платформы. </p><p class="mt-2"> Правовые основания обработки: согласие субъекта персональных данных, исполнение договора (пользовательского соглашения), а также законный интерес оператора в обеспечении стабильной и безопасной работы сервиса. </p><h2 class="mt-6 text-lg font-semibold text-gray-900">3. Срок хранения</h2><p class="mt-2"> Персональные данные хранятся не более 1 (одного) года с момента последнего взаимодействия пользователя с платформой, если более длительный срок не требуется по закону. </p><h2 class="mt-6 text-lg font-semibold text-gray-900">4. Передача третьим лицам</h2><p class="mt-2"> Для оказания сервиса данные могут передаваться: Supabase (инфраструктура хранения), Telegram (уведомления и коммуникации), эквайринговым сервисам/банкам (обработка платежей), а также ресторанам-продавцам для исполнения заказов. </p><h2 class="mt-6 text-lg font-semibold text-gray-900">5. Cookies и аналитика</h2><p class="mt-2"> Платформа использует cookies и аналогичные технологии для авторизации, сохранения сессии, корректной работы интерфейсов и базовой аналитики использования сервиса. </p><p class="mt-2"> Пользователь может ограничить использование cookies в настройках браузера, однако это может повлиять на работу отдельных функций платформы. </p><h2 class="mt-6 text-lg font-semibold text-gray-900">6. Права пользователя и контакты</h2><p class="mt-2"> Пользователь вправе запросить доступ, уточнение, блокирование или удаление персональных данных, а также отозвать согласие на обработку ПДн. </p><p class="mt-2"> Для обращений: shiro1702@gmail.com, +7 999 619-63-61, Telegram: @arsalanbar. Срок ответа на обращение: до 10 рабочих дней. </p></main>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[city_slug]/legal/privacy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const privacy = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  privacy as default
};
