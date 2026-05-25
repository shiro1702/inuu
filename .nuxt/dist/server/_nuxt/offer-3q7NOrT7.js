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
  _push(`<main${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl px-4 py-8 text-sm leading-6 text-gray-700 sm:px-6" }, _attrs))}><h1 class="text-2xl font-semibold text-gray-900">Публичная оферта (платформа)</h1><p class="mt-4"> Данный документ регулирует использование платформы pocketmenu.ru (&quot;меню в вашем кармане&quot;) пользователями и партнерами-ресторанами. Оператор платформы: ИП Баранзаев Арсалан Баярович. </p><h2 class="mt-6 text-lg font-semibold text-gray-900">1. Предмет оферты</h2><p class="mt-2"> Оператор предоставляет пользователю доступ к платформе для выбора ресторанов, оформления и передачи заказов. </p><h2 class="mt-6 text-lg font-semibold text-gray-900">2. Статус платформы</h2><p class="mt-2"> Платформа является агрегатором и информационным посредником. Оператор не является продавцом блюд и не оказывает услуги доставки, если прямо не указано иное. </p><h2 class="mt-6 text-lg font-semibold text-gray-900">3. Заказы, отмены и возвраты</h2><p class="mt-2"> Договор на приобретение товаров/услуг заключается между пользователем и рестораном-продавцом. Условия приготовления, доставки, отмены и возврата денежных средств определяются соответствующим рестораном. </p><p class="mt-2"> По вопросам возвратов и претензий по качеству заказа пользователь обращается напрямую в ресторан. </p><h2 class="mt-6 text-lg font-semibold text-gray-900">4. Обработка персональных данных</h2><p class="mt-2"> Используя платформу, пользователь соглашается с Политикой конфиденциальности и Согласием на обработку персональных данных, размещенными в разделе юридических документов. </p><h2 class="mt-6 text-lg font-semibold text-gray-900">5. Применимое право и подсудность</h2><p class="mt-2"> К отношениям сторон применяется законодательство Российской Федерации. При невозможности урегулировать спор в досудебном порядке спор подлежит рассмотрению в суде по месту нахождения оператора платформы. Текущий операционный регион: г. Улан-Удэ. </p></main>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[city_slug]/legal/offer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const offer = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  offer as default
};
