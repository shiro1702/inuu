import { defineComponent, ref, reactive, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from "vue/server-renderer";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
import { u as useDashboardAccess } from "./useDashboardAccess-PseSveld.js";
import "../server.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unctx/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/defu/dist/defu.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ufo/dist/index.mjs";
import "@supabase/ssr";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/klona/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "marketing",
  __ssrInlineRender: true,
  setup(__props) {
    useDashboardAccess();
    const tab = ref("promo");
    const promos = ref([]);
    const saving = ref(false);
    const loyaltySaving = ref(false);
    const editingId = ref(null);
    const form = reactive({
      code: "",
      type: "percent",
      value: 10,
      min_order_amount: 0,
      starts_at: "",
      ends_at: "",
      max_uses_total: null,
      max_uses_per_user: null,
      is_active: true,
      free_item_product_id: "",
      free_item_parameter_option_id: ""
    });
    const loyalty = reactive({
      bonuses_enabled: true,
      allow_simultaneous_bonus_spend_and_earn: false,
      earn_percent_of_subtotal: 5,
      max_order_percent_payable_with_bonus: 25,
      expiry_enabled: false,
      expiry_days_inactivity: null,
      welcome_bonus_amount: 0,
      birthday_bonus_amount: 0,
      review_bonus_amount: 0,
      birthday_bonus_days_before: 7
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-5xl space-y-8 px-4 py-8" }, _attrs))}><div><h1 class="text-2xl font-semibold text-gray-900">Маркетинг</h1><p class="mt-1 text-sm text-gray-600">Промокоды и настройки бонусной программы (1 бонус = 1 ₽).</p></div><div class="flex flex-wrap gap-2 border-b border-gray-200 pb-2"><button type="button" class="${ssrRenderClass([tab.value === "promo" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100", "rounded-lg px-3 py-1.5 text-sm font-medium"])}"> Промокоды </button><button type="button" class="${ssrRenderClass([tab.value === "loyalty" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100", "rounded-lg px-3 py-1.5 text-sm font-medium"])}"> Бонусы </button></div>`);
      if (tab.value === "promo") {
        _push(`<section class="space-y-6"><div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><h2 class="text-sm font-semibold text-gray-900">${ssrInterpolate(editingId.value ? "Редактировать промокод" : "Новый промокод")}</h2><div class="mt-4 grid gap-3 sm:grid-cols-2"><label class="text-sm"><span class="text-gray-600">Код</span><input${ssrRenderAttr("value", form.code)} class="mt-1 w-full rounded border px-2 py-1.5 uppercase" placeholder="WINTER2026"></label><label class="text-sm"><span class="text-gray-600">Тип</span><select class="mt-1 w-full rounded border px-2 py-1.5"><option value="percent"${ssrIncludeBooleanAttr(Array.isArray(form.type) ? ssrLooseContain(form.type, "percent") : ssrLooseEqual(form.type, "percent")) ? " selected" : ""}>Процент</option><option value="fixed"${ssrIncludeBooleanAttr(Array.isArray(form.type) ? ssrLooseContain(form.type, "fixed") : ssrLooseEqual(form.type, "fixed")) ? " selected" : ""}>Фикс (₽)</option><option value="free_item"${ssrIncludeBooleanAttr(Array.isArray(form.type) ? ssrLooseContain(form.type, "free_item") : ssrLooseEqual(form.type, "free_item")) ? " selected" : ""}>Подарок</option></select></label><label class="text-sm"><span class="text-gray-600">${ssrInterpolate(form.type === "percent" ? "Процент" : "Значение (₽ или %)")}</span><input${ssrRenderAttr("value", form.value)} type="number" min="0" class="mt-1 w-full rounded border px-2 py-1.5"></label><label class="text-sm"><span class="text-gray-600">Мин. сумма заказа (₽)</span><input${ssrRenderAttr("value", form.min_order_amount)} type="number" min="0" class="mt-1 w-full rounded border px-2 py-1.5"></label><label class="text-sm"><span class="text-gray-600">Начало (ISO)</span><input${ssrRenderAttr("value", form.starts_at)} class="mt-1 w-full rounded border px-2 py-1.5" placeholder="2026-01-01T00:00:00Z"></label><label class="text-sm"><span class="text-gray-600">Конец (ISO)</span><input${ssrRenderAttr("value", form.ends_at)} class="mt-1 w-full rounded border px-2 py-1.5"></label><label class="text-sm"><span class="text-gray-600">Лимит всего</span><input${ssrRenderAttr("value", form.max_uses_total)} type="number" min="1" class="mt-1 w-full rounded border px-2 py-1.5" placeholder="пусто = нет"></label><label class="text-sm"><span class="text-gray-600">Лимит на пользователя</span><input${ssrRenderAttr("value", form.max_uses_per_user)} type="number" min="1" class="mt-1 w-full rounded border px-2 py-1.5" placeholder="пусто = нет"></label>`);
        if (form.type === "free_item") {
          _push(`<label class="text-sm sm:col-span-2"><span class="text-gray-600">UUID товара-подарка</span><input${ssrRenderAttr("value", form.free_item_product_id)} class="mt-1 w-full rounded border px-2 py-1.5 font-mono text-xs"></label>`);
        } else {
          _push(`<!---->`);
        }
        if (form.type === "free_item") {
          _push(`<label class="text-sm sm:col-span-2"><span class="text-gray-600">UUID варианта параметра (если нужен)</span><input${ssrRenderAttr("value", form.free_item_parameter_option_id)} class="mt-1 w-full rounded border px-2 py-1.5 font-mono text-xs"></label>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<label class="flex items-center gap-2 text-sm sm:col-span-2"><input${ssrIncludeBooleanAttr(Array.isArray(form.is_active) ? ssrLooseContain(form.is_active, null) : form.is_active) ? " checked" : ""} type="checkbox"> Активен </label></div><div class="mt-4 flex flex-wrap gap-2"><button type="button" class="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "Сохранение…" : editingId.value ? "Сохранить" : "Создать")}</button>`);
        if (editingId.value) {
          _push(`<button type="button" class="rounded-lg border px-4 py-2 text-sm"> Отмена </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm"><table class="min-w-full text-left text-sm"><thead class="border-b bg-gray-50 text-gray-600"><tr><th class="px-3 py-2">Код</th><th class="px-3 py-2">Тип</th><th class="px-3 py-2">Знач.</th><th class="px-3 py-2">Мин.</th><th class="px-3 py-2">Активен</th><th class="px-3 py-2"></th></tr></thead><tbody><!--[-->`);
        ssrRenderList(promos.value, (p) => {
          _push(`<tr class="border-b border-gray-100"><td class="px-3 py-2 font-mono">${ssrInterpolate(p.code)}</td><td class="px-3 py-2">${ssrInterpolate(p.type)}</td><td class="px-3 py-2">${ssrInterpolate(p.value)}</td><td class="px-3 py-2">${ssrInterpolate(p.min_order_amount)}</td><td class="px-3 py-2">${ssrInterpolate(p.is_active ? "да" : "нет")}</td><td class="px-3 py-2 text-right"><button type="button" class="text-blue-600 hover:underline">Изм.</button><button type="button" class="ml-2 text-red-600 hover:underline">Удал.</button></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></section>`);
      } else {
        _push(`<section class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><h2 class="text-sm font-semibold text-gray-900">Настройки бонусов</h2><p class="mt-1 text-xs text-gray-500"> Начисление за заказ — после успешной онлайн-оплаты. Списание бонусов — при оформлении заказа. Магазин за баллы и отзывы — в планах. </p><div class="mt-4 grid gap-3 sm:grid-cols-2"><label class="flex items-center gap-2 text-sm sm:col-span-2"><input${ssrIncludeBooleanAttr(Array.isArray(loyalty.bonuses_enabled) ? ssrLooseContain(loyalty.bonuses_enabled, null) : loyalty.bonuses_enabled) ? " checked" : ""} type="checkbox"> Включить систему бонусов </label><label class="text-sm"><span class="text-gray-600">Кэшбек бонусами, % от суммы товаров после промо</span><input${ssrRenderAttr("value", loyalty.earn_percent_of_subtotal)} type="number" min="0" max="100" class="mt-1 w-full rounded border px-2 py-1.5"></label><label class="text-sm"><span class="text-gray-600">Макс. % заказа, оплачиваемый бонусами</span><input${ssrRenderAttr("value", loyalty.max_order_percent_payable_with_bonus)} type="number" min="0" max="100" class="mt-1 w-full rounded border px-2 py-1.5"></label><label class="flex items-center gap-2 text-sm sm:col-span-2"><input${ssrIncludeBooleanAttr(Array.isArray(loyalty.allow_simultaneous_bonus_spend_and_earn) ? ssrLooseContain(loyalty.allow_simultaneous_bonus_spend_and_earn, null) : loyalty.allow_simultaneous_bonus_spend_and_earn) ? " checked" : ""} type="checkbox"> Разрешить одновременно списывать и начислять бонусы в одном заказе </label><p class="text-xs text-gray-500 sm:col-span-2"> По умолчанию в заказе работает только один сценарий: либо списание, либо начисление. </p><label class="flex items-center gap-2 text-sm sm:col-span-2"><input${ssrIncludeBooleanAttr(Array.isArray(loyalty.expiry_enabled) ? ssrLooseContain(loyalty.expiry_enabled, null) : loyalty.expiry_enabled) ? " checked" : ""} type="checkbox"> Сгорание при неактивности (настройка; авто-списание — позже) </label><label class="text-sm"><span class="text-gray-600">Дней неактивности до сгорания</span><input${ssrRenderAttr("value", loyalty.expiry_days_inactivity)} type="number" min="1" class="mt-1 w-full rounded border px-2 py-1.5"></label><label class="text-sm"><span class="text-gray-600">Приветственный бонус (₽)</span><input${ssrRenderAttr("value", loyalty.welcome_bonus_amount)} type="number" min="0" class="mt-1 w-full rounded border px-2 py-1.5"></label><label class="text-sm"><span class="text-gray-600">День рождения (₽)</span><input${ssrRenderAttr("value", loyalty.birthday_bonus_amount)} type="number" min="0" class="mt-1 w-full rounded border px-2 py-1.5"></label><label class="text-sm"><span class="text-gray-600">За отзыв (₽), начисление после модуля отзывов</span><input${ssrRenderAttr("value", loyalty.review_bonus_amount)} type="number" min="0" class="mt-1 w-full rounded border px-2 py-1.5"></label><label class="text-sm"><span class="text-gray-600">Дней до ДР для поздравления</span><input${ssrRenderAttr("value", loyalty.birthday_bonus_days_before)} type="number" min="0" max="60" class="mt-1 w-full rounded border px-2 py-1.5"></label></div><button type="button" class="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"${ssrIncludeBooleanAttr(loyaltySaving.value) ? " disabled" : ""}>${ssrInterpolate(loyaltySaving.value ? "Сохранение…" : "Сохранить настройки")}</button></section>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/marketing.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
