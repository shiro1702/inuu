import { _ as __nuxt_component_0, k as useRuntimeConfig } from "../server.mjs";
import { defineComponent, computed, ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain } from "vue/server-renderer";
import { a as useSeoMeta } from "./v3-AVe7cZyq.js";
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
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/@unhead/vue/dist/index.mjs";
const basePrice = 1200;
const extraBranchPrice = 500;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "partners",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const telegramBotName = config.public.telegramBotName || "";
    const telegramDemoUrl = computed(() => telegramBotName ? `https://t.me/${telegramBotName}` : null);
    const workModes = [
      { id: "delivery", label: "Доставка", note: "Зоны, приём заказов, маршруты", price: 2200 },
      { id: "pickup", label: "Самовывоз", note: "Слотирование и выдача заказов", price: 800 },
      { id: "hall", label: "Заказы в зале", note: "QR-меню и быстрый заказ", price: 0 }
    ];
    const calculatorModules = [
      { id: "crm", label: "CRM и база гостей", price: 1200 },
      { id: "loyalty", label: "Лояльность и промокоды", price: 900 },
      { id: "payments", label: "Онлайн-оплата", price: 480 },
      { id: "reviews", label: "Модуль отзывов", price: 700 }
    ];
    const selectedWorkModes = ref(["hall"]);
    const selectedCalculatorModules = ref(["crm"]);
    const branchCount = ref(1);
    const workModeTotal = computed(
      () => workModes.filter((mode) => selectedWorkModes.value.includes(mode.id)).reduce((sum, mode) => sum + mode.price, 0)
    );
    const selectedModulesTotal = computed(
      () => calculatorModules.filter((module) => selectedCalculatorModules.value.includes(module.id)).reduce((sum, module) => sum + module.price, 0)
    );
    const safeBranchCount = computed(() => Math.max(1, Math.floor(Number(branchCount.value) || 1)));
    const branchesTotal = computed(() => Math.max(0, safeBranchCount.value - 1) * extraBranchPrice);
    const calculationTotal = computed(() => basePrice + workModeTotal.value + branchesTotal.value + selectedModulesTotal.value);
    const formatRub = (value) => `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
    const moduleRows = [
      { module: "core_qr_menu", desc: "QR-меню в зале", price: "0 ₽" },
      { module: "core_telegram_orders", desc: "Заказы и уведомления в Telegram", price: "0 ₽" },
      { module: "crm_orders_db", desc: "История заказов, база клиентов, повтор заказа", price: "1000–1500 ₽/мес" },
      { module: "marketing_loyalty", desc: "Бонусы, промокоды, штампики", price: "500–990 ₽/мес" },
      { module: "payments_online", desc: "Онлайн-оплата", price: "от 480 ₽/мес" },
      { module: "ugc_reviews", desc: "Сбор, модерация и публикация отзывов гостей", price: "от 700 ₽/мес" },
      { module: "own_delivery_smart", desc: "Своя доставка: зоны, гео, отдельное delivery-меню", price: "2000–3500 ₽/мес" },
      {
        module: "traffic_boost_search",
        desc: "Приоритет в каталоге и поиске агрегатора",
        price: "В планах — после запуска страницы агрегатора"
      },
      {
        module: "traffic_promo_showcase",
        desc: "Витрина акций на главной агрегатора",
        price: "В планах — после запуска страницы агрегатора"
      }
    ];
    const pricingScenarios = [
      {
        badge: "Сценарий 1",
        title: "Доставка + самовывоз",
        points: ["2 филиала", "CRM + лояльность", "Онлайн-оплата"],
        total: "7 480 ₽/мес"
      },
      {
        badge: "Сценарий 2",
        title: "Бар с кнопками заказа",
        points: ["1 филиал", "Заказы в зале (QR)", "Модуль отзывов"],
        total: "1 900 ₽/мес"
      },
      {
        badge: "Сценарий 3",
        title: "Киоск с едой",
        points: ["1 филиал", "Самовывоз", "CRM + онлайн-оплата"],
        total: "3 680 ₽/мес"
      }
    ];
    useSeoMeta({
      title: "Партнёрам — Pocket Menu",
      description: "Платформа продаж и доставки для ресторанов: сайт, QR-меню, Telegram и мини-приложения, лиды из агрегатора. Модули по подписке без жёстких тарифов.",
      ogTitle: "Партнёрам — Pocket Menu",
      ogDescription: "Экосистема заказов для ресторанов: омниканальность, база гостей, маркетинг и кросс-партнёрка. Подключение по модулям."
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "bg-white text-gray-900" }, _attrs))}><section class="border-b border-gray-100 bg-gradient-to-b from-primary-50/80 to-white"><div class="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20"><p class="text-sm font-medium uppercase tracking-wide text-primary"> Партнёрам </p><h1 class="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-[2.5rem]"> Не просто сайт под ключ. Платформа продаж и доставки для ресторанов </h1><p class="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600"> Единое пространство: сайт, мини-приложения в мессенджерах и общий канал горячих лидов внутри агрегатора. </p><div class="mt-8 flex flex-wrap items-center gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-base font-semibold text-on-primary shadow-sm transition hover:bg-primary-600 active:bg-primary-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Запустить платформу для ресторана `);
          } else {
            return [
              createTextVNode(" Запустить платформу для ресторана ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(telegramDemoUrl)) {
        _push(`<a${ssrRenderAttr("href", unref(telegramDemoUrl))} target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-base font-medium text-gray-800 transition hover:border-primary hover:bg-primary-50"> Посмотреть демо в Telegram </a>`);
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-base font-medium text-gray-800 transition hover:border-primary hover:bg-primary-50"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Посмотреть, как выглядит агрегатор `);
            } else {
              return [
                createTextVNode(" Посмотреть, как выглядит агрегатор ")
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div></div></section><div class="mx-auto max-w-5xl space-y-16 px-4 py-14 sm:px-6 sm:py-16"><section aria-labelledby="partners-what"><h2 id="partners-what" class="text-2xl font-semibold text-gray-900"> Что такое Pocket Menu </h2><p class="mt-4 text-base leading-relaxed text-gray-600"> Это экосистема для заведений: ресторан получает современный сайт по подписке, QR-меню и заказы из зала, заказы в Telegram и мини-приложениях, а также инструменты удержания гостей — бонусы, промокоды, рассылки и сторис. </p><div class="mt-6 rounded-2xl border border-gray-200 bg-gray-50/80 p-5 text-sm text-gray-700"><p class="font-medium text-gray-900">Один контур для гостя</p><p class="mt-2"> Гость приходит с сайта, по QR в зале или из мини-приложения — заказ и данные попадают в <span class="font-medium text-gray-900">единый движок ресторана</span>. </p></div></section><section aria-labelledby="partners-why-not"><h2 id="partners-why-not" class="text-2xl font-semibold text-gray-900"> Почему обычный «сайт под ключ» уже не решает задачу </h2><ul class="mt-5 space-y-3 text-base text-gray-600"><li class="flex gap-3"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span> Шаблонный сайт быстро устаревает и почти не помогает с повторными продажами. </li><li class="flex gap-3"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span> Нет единой клиентской базы — маркетинг и ретеншн работают вслепую. </li><li class="flex gap-3"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span> Нет развития функционала под рынок: доставка, лояльность, автоматизация кухни и промо. </li></ul><p class="mt-6 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-base font-medium text-gray-900"> Ресторану нужна не «страница», а живая платформа с модулями — которую можно наращивать по мере роста. </p></section><section aria-labelledby="partners-value"><h2 id="partners-value" class="text-2xl font-semibold text-gray-900"> Ключевая ценность экосистемы </h2><ul class="mt-5 grid gap-4 sm:grid-cols-2"><li class="rounded-xl border border-gray-200 p-5"><p class="font-semibold text-gray-900">Горячие лиды</p><p class="mt-2 text-sm leading-relaxed text-gray-600"> Приток заказов из общего канала агрегатора — не только собственный трафик на сайт. </p></li><li class="rounded-xl border border-gray-200 p-5"><p class="font-semibold text-gray-900">Омниканальность</p><p class="mt-2 text-sm leading-relaxed text-gray-600"> Сайт, мини-приложения в мессенджерах и QR-точки в зале работают вместе. </p></li><li class="rounded-xl border border-gray-200 p-5"><p class="font-semibold text-gray-900">Удобство гостю</p><p class="mt-2 text-sm leading-relaxed text-gray-600"> Быстрый заказ, повтор заказа, промо-механики — привычные сценарии без разрыва. </p></li><li class="rounded-xl border border-gray-200 p-5"><p class="font-semibold text-gray-900">Удобство ресторану</p><p class="mt-2 text-sm leading-relaxed text-gray-600"> Единая операционная логика и рост LTV за счёт базы и маркетинга. </p></li></ul></section><section aria-labelledby="partners-core"><h2 id="partners-core" class="text-2xl font-semibold text-gray-900"> Стартуем быстро, затем растём по модулям </h2><p class="mt-3 text-gray-600"> В базе доступны ядро и бесплатные каналы заказа — дальше подключаете платные модули под задачи бизнеса. </p><div class="mt-6 grid gap-4 sm:grid-cols-2"><div class="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5"><p class="text-sm font-semibold uppercase tracking-wide text-emerald-800">Ядро</p><p class="mt-2 font-medium text-gray-900">QR-меню в заведении</p><p class="mt-1 text-sm text-gray-600">Гости сканируют код и заказывают из зала.</p></div><div class="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5"><p class="text-sm font-semibold uppercase tracking-wide text-emerald-800">Ядро</p><p class="mt-2 font-medium text-gray-900">Заказы и уведомления в Telegram</p><p class="mt-1 text-sm text-gray-600">Поток заявок и статусы без потери в чатах.</p></div></div></section><section aria-labelledby="partners-modules"><h2 id="partners-modules" class="text-2xl font-semibold text-gray-900"> Модули и ориентиры по стоимости </h2><p class="mt-3 text-gray-600"> Функционал подключается тумблерами: платите только за активные модули, без жёстких «пакетов тарифов». </p><div class="mt-6 overflow-x-auto rounded-xl border border-gray-200 shadow-sm"><table class="min-w-full divide-y divide-gray-200 text-left text-sm"><thead class="bg-gray-50"><tr><th scope="col" class="whitespace-nowrap px-4 py-3 font-semibold text-gray-900 sm:px-5"> Модуль </th><th scope="col" class="px-4 py-3 font-semibold text-gray-900 sm:px-5"> Что даёт </th><th scope="col" class="whitespace-nowrap px-4 py-3 font-semibold text-gray-900 sm:px-5"> Цена </th></tr></thead><tbody class="divide-y divide-gray-100 bg-white"><!--[-->`);
      ssrRenderList(moduleRows, (row) => {
        _push(`<tr><td class="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500 sm:px-5">${ssrInterpolate(row.module)}</td><td class="px-4 py-3 text-gray-700 sm:px-5">${ssrInterpolate(row.desc)}</td><td class="whitespace-nowrap px-4 py-3 font-medium text-gray-900 sm:px-5">${ssrInterpolate(row.price)}</td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></section><section aria-labelledby="partners-calculator"><h2 id="partners-calculator" class="text-2xl font-semibold text-gray-900"> Калькулятор стоимости для партнёров </h2><p class="mt-3 text-gray-600"> Оцените ежемесячный бюджет под ваш формат: доставка, самовывоз, количество филиалов и нужные модули. </p><div class="mt-6 grid gap-4 lg:grid-cols-3"><article class="rounded-xl border border-gray-200 bg-white p-5"><p class="text-sm font-semibold uppercase tracking-wide text-gray-700">Тип работы</p><div class="mt-3 space-y-2"><!--[-->`);
      ssrRenderList(workModes, (mode) => {
        _push(`<label class="flex items-start gap-3 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(Array.isArray(unref(selectedWorkModes)) ? ssrLooseContain(unref(selectedWorkModes), mode.id) : unref(selectedWorkModes)) ? " checked" : ""}${ssrRenderAttr("value", mode.id)} type="checkbox" class="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"><span><span class="font-medium text-gray-900">${ssrInterpolate(mode.label)}</span><span class="block text-xs text-gray-500">${ssrInterpolate(mode.note)}</span></span></label>`);
      });
      _push(`<!--]--></div></article><article class="rounded-xl border border-gray-200 bg-white p-5"><label for="partners-branches" class="text-sm font-semibold uppercase tracking-wide text-gray-700"> Количество филиалов </label><input id="partners-branches"${ssrRenderAttr("value", unref(branchCount))} type="number" min="1" class="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-100"><p class="mt-2 text-xs text-gray-500"> Включён 1 филиал. Каждый дополнительный добавляет ${ssrInterpolate(formatRub(extraBranchPrice))}/мес. </p></article><article class="rounded-xl border border-primary-100 bg-primary-50 p-5"><p class="text-sm font-semibold uppercase tracking-wide text-gray-700">Итоговая оценка</p><p class="mt-3 text-3xl font-bold text-gray-900">${ssrInterpolate(formatRub(unref(calculationTotal)))} / мес </p><ul class="mt-4 space-y-2 text-sm text-gray-700"><li class="flex justify-between gap-3"><span>База</span><span class="font-medium">${ssrInterpolate(formatRub(basePrice))}</span></li><li class="flex justify-between gap-3"><span>Формат работы</span><span class="font-medium">${ssrInterpolate(formatRub(unref(workModeTotal)))}</span></li><li class="flex justify-between gap-3"><span>Филиалы</span><span class="font-medium">${ssrInterpolate(formatRub(unref(branchesTotal)))}</span></li><li class="flex justify-between gap-3"><span>Модули</span><span class="font-medium">${ssrInterpolate(formatRub(unref(selectedModulesTotal)))}</span></li></ul></article></div><div class="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-5"><p class="text-sm font-semibold uppercase tracking-wide text-gray-700">Подключаемые модули</p><div class="mt-3 grid gap-3 md:grid-cols-2"><!--[-->`);
      ssrRenderList(calculatorModules, (module) => {
        _push(`<label class="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(Array.isArray(unref(selectedCalculatorModules)) ? ssrLooseContain(unref(selectedCalculatorModules), module.id) : unref(selectedCalculatorModules)) ? " checked" : ""}${ssrRenderAttr("value", module.id)} type="checkbox" class="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"><span><span class="font-medium text-gray-900">${ssrInterpolate(module.label)}</span><span class="block text-xs text-gray-500">${ssrInterpolate(formatRub(module.price))}/мес</span></span></label>`);
      });
      _push(`<!--]--></div></div></section><section aria-labelledby="partners-cases"><h2 id="partners-cases" class="text-2xl font-semibold text-gray-900"> Примеры подключения с расчётом </h2><p class="mt-3 text-gray-600"> Готовые сценарии, чтобы быстро понять бюджет под формат бизнеса. </p><div class="mt-6 grid gap-4 md:grid-cols-3"><!--[-->`);
      ssrRenderList(pricingScenarios, (scenario) => {
        _push(`<article class="rounded-xl border border-gray-200 bg-white p-5"><p class="text-sm font-semibold uppercase tracking-wide text-primary">${ssrInterpolate(scenario.badge)}</p><h3 class="mt-2 text-lg font-semibold text-gray-900">${ssrInterpolate(scenario.title)}</h3><ul class="mt-3 space-y-2 text-sm text-gray-600"><!--[-->`);
        ssrRenderList(scenario.points, (point) => {
          _push(`<li class="flex gap-2"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span> ${ssrInterpolate(point)}</li>`);
        });
        _push(`<!--]--></ul><p class="mt-4 rounded-lg bg-primary-50 px-3 py-2 text-sm font-semibold text-gray-900"> Ориентир: ${ssrInterpolate(scenario.total)}</p></article>`);
      });
      _push(`<!--]--></div></section><section aria-labelledby="partners-marketing"><h2 id="partners-marketing" class="text-2xl font-semibold text-gray-900"> Маркетинг, который возвращает гостей </h2><ul class="mt-5 space-y-3 text-base text-gray-600"><li class="flex gap-3"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span> Рассылки в мессенджерах по базе гостей. </li><li class="flex gap-3"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span> Сегменты и триггеры: день рождения, гео, реактивация «уснувших». </li><li class="flex gap-3"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span> Бонусы, промокоды, акции и сторис внутри экосистемы. </li></ul></section><section aria-labelledby="partners-cross"><h2 id="partners-cross" class="text-2xl font-semibold text-gray-900"> Кросс-партнёрка внутри экосистемы </h2><p class="mt-4 text-base leading-relaxed text-gray-600"> Рестораны, кафе, бары и киоски обмениваются аудиторией через релевантные предложения: гость заказывает в одном месте и видит понятные офферы соседних партнёров. Это дополнительные заказы без покупки холодного трафика. </p></section><section aria-labelledby="partners-launch"><h2 id="partners-launch" class="text-2xl font-semibold text-gray-900"> Как происходит запуск </h2><ol class="mt-6 space-y-4"><li class="flex gap-4"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary"> 1 </span><div><p class="font-medium text-gray-900">Аудит каналов</p><p class="mt-1 text-sm text-gray-600">Смотрим текущие точки контакта и модель доставки.</p></div></li><li class="flex gap-4"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary"> 2 </span><div><p class="font-medium text-gray-900">Запуск ядра</p><p class="mt-1 text-sm text-gray-600">Сайт, QR и мессенджерный канал в одном контуре.</p></div></li><li class="flex gap-4"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary"> 3 </span><div><p class="font-medium text-gray-900">Модули роста</p><p class="mt-1 text-sm text-gray-600">Подключаем CRM, лояльность, доставку, промо в агрегаторе — по приоритетам.</p></div></li><li class="flex gap-4"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary"> 4 </span><div><p class="font-medium text-gray-900">Сопровождение</p><p class="mt-1 text-sm text-gray-600">Развиваем платформу вместе с вашим roadmap.</p></div></li></ol></section></div><section class="border-t border-gray-200 bg-gray-50 py-14 sm:py-16"><div class="mx-auto max-w-5xl px-4 text-center sm:px-6"><h2 class="text-2xl font-semibold text-gray-900 sm:text-3xl"> Подключите экосистему, которая растёт вместе с вашим рестораном </h2><p class="mx-auto mt-3 max-w-2xl text-gray-600"> Получите персональную сборку модулей и демо с ориентиром по окупаемости. </p><div class="mt-8 flex flex-wrap items-center justify-center gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-base font-semibold text-on-primary shadow-sm transition hover:bg-primary-600 active:bg-primary-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Получить персональную сборку модулей `);
          } else {
            return [
              createTextVNode(" Получить персональную сборку модулей ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(telegramDemoUrl)) {
        _push(`<a${ssrRenderAttr("href", unref(telegramDemoUrl))} target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-base font-medium text-gray-800 transition hover:border-primary hover:bg-primary-50"> Написать в Telegram </a>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/partners.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
