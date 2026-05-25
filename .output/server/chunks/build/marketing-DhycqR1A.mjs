import { defineComponent, ref, reactive, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';
import { u as useDashboardAccess } from './useDashboardAccess-PseSveld.mjs';
import './server.mjs';
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
import 'vue-router';

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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-5xl space-y-8 px-4 py-8" }, _attrs))}><div><h1 class="text-2xl font-semibold text-gray-900">\u041C\u0430\u0440\u043A\u0435\u0442\u0438\u043D\u0433</h1><p class="mt-1 text-sm text-gray-600">\u041F\u0440\u043E\u043C\u043E\u043A\u043E\u0434\u044B \u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0431\u043E\u043D\u0443\u0441\u043D\u043E\u0439 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u044B (1 \u0431\u043E\u043D\u0443\u0441 = 1 \u20BD).</p></div><div class="flex flex-wrap gap-2 border-b border-gray-200 pb-2"><button type="button" class="${ssrRenderClass([tab.value === "promo" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100", "rounded-lg px-3 py-1.5 text-sm font-medium"])}"> \u041F\u0440\u043E\u043C\u043E\u043A\u043E\u0434\u044B </button><button type="button" class="${ssrRenderClass([tab.value === "loyalty" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100", "rounded-lg px-3 py-1.5 text-sm font-medium"])}"> \u0411\u043E\u043D\u0443\u0441\u044B </button></div>`);
      if (tab.value === "promo") {
        _push(`<section class="space-y-6"><div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><h2 class="text-sm font-semibold text-gray-900">${ssrInterpolate(editingId.value ? "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434" : "\u041D\u043E\u0432\u044B\u0439 \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434")}</h2><div class="mt-4 grid gap-3 sm:grid-cols-2"><label class="text-sm"><span class="text-gray-600">\u041A\u043E\u0434</span><input${ssrRenderAttr("value", form.code)} class="mt-1 w-full rounded border px-2 py-1.5 uppercase" placeholder="WINTER2026"></label><label class="text-sm"><span class="text-gray-600">\u0422\u0438\u043F</span><select class="mt-1 w-full rounded border px-2 py-1.5"><option value="percent"${ssrIncludeBooleanAttr(Array.isArray(form.type) ? ssrLooseContain(form.type, "percent") : ssrLooseEqual(form.type, "percent")) ? " selected" : ""}>\u041F\u0440\u043E\u0446\u0435\u043D\u0442</option><option value="fixed"${ssrIncludeBooleanAttr(Array.isArray(form.type) ? ssrLooseContain(form.type, "fixed") : ssrLooseEqual(form.type, "fixed")) ? " selected" : ""}>\u0424\u0438\u043A\u0441 (\u20BD)</option><option value="free_item"${ssrIncludeBooleanAttr(Array.isArray(form.type) ? ssrLooseContain(form.type, "free_item") : ssrLooseEqual(form.type, "free_item")) ? " selected" : ""}>\u041F\u043E\u0434\u0430\u0440\u043E\u043A</option></select></label><label class="text-sm"><span class="text-gray-600">${ssrInterpolate(form.type === "percent" ? "\u041F\u0440\u043E\u0446\u0435\u043D\u0442" : "\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435 (\u20BD \u0438\u043B\u0438 %)")}</span><input${ssrRenderAttr("value", form.value)} type="number" min="0" class="mt-1 w-full rounded border px-2 py-1.5"></label><label class="text-sm"><span class="text-gray-600">\u041C\u0438\u043D. \u0441\u0443\u043C\u043C\u0430 \u0437\u0430\u043A\u0430\u0437\u0430 (\u20BD)</span><input${ssrRenderAttr("value", form.min_order_amount)} type="number" min="0" class="mt-1 w-full rounded border px-2 py-1.5"></label><label class="text-sm"><span class="text-gray-600">\u041D\u0430\u0447\u0430\u043B\u043E (ISO)</span><input${ssrRenderAttr("value", form.starts_at)} class="mt-1 w-full rounded border px-2 py-1.5" placeholder="2026-01-01T00:00:00Z"></label><label class="text-sm"><span class="text-gray-600">\u041A\u043E\u043D\u0435\u0446 (ISO)</span><input${ssrRenderAttr("value", form.ends_at)} class="mt-1 w-full rounded border px-2 py-1.5"></label><label class="text-sm"><span class="text-gray-600">\u041B\u0438\u043C\u0438\u0442 \u0432\u0441\u0435\u0433\u043E</span><input${ssrRenderAttr("value", form.max_uses_total)} type="number" min="1" class="mt-1 w-full rounded border px-2 py-1.5" placeholder="\u043F\u0443\u0441\u0442\u043E = \u043D\u0435\u0442"></label><label class="text-sm"><span class="text-gray-600">\u041B\u0438\u043C\u0438\u0442 \u043D\u0430 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F</span><input${ssrRenderAttr("value", form.max_uses_per_user)} type="number" min="1" class="mt-1 w-full rounded border px-2 py-1.5" placeholder="\u043F\u0443\u0441\u0442\u043E = \u043D\u0435\u0442"></label>`);
        if (form.type === "free_item") {
          _push(`<label class="text-sm sm:col-span-2"><span class="text-gray-600">UUID \u0442\u043E\u0432\u0430\u0440\u0430-\u043F\u043E\u0434\u0430\u0440\u043A\u0430</span><input${ssrRenderAttr("value", form.free_item_product_id)} class="mt-1 w-full rounded border px-2 py-1.5 font-mono text-xs"></label>`);
        } else {
          _push(`<!---->`);
        }
        if (form.type === "free_item") {
          _push(`<label class="text-sm sm:col-span-2"><span class="text-gray-600">UUID \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u0430 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0430 (\u0435\u0441\u043B\u0438 \u043D\u0443\u0436\u0435\u043D)</span><input${ssrRenderAttr("value", form.free_item_parameter_option_id)} class="mt-1 w-full rounded border px-2 py-1.5 font-mono text-xs"></label>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<label class="flex items-center gap-2 text-sm sm:col-span-2"><input${ssrIncludeBooleanAttr(Array.isArray(form.is_active) ? ssrLooseContain(form.is_active, null) : form.is_active) ? " checked" : ""} type="checkbox"> \u0410\u043A\u0442\u0438\u0432\u0435\u043D </label></div><div class="mt-4 flex flex-wrap gap-2"><button type="button" class="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435\u2026" : editingId.value ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" : "\u0421\u043E\u0437\u0434\u0430\u0442\u044C")}</button>`);
        if (editingId.value) {
          _push(`<button type="button" class="rounded-lg border px-4 py-2 text-sm"> \u041E\u0442\u043C\u0435\u043D\u0430 </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm"><table class="min-w-full text-left text-sm"><thead class="border-b bg-gray-50 text-gray-600"><tr><th class="px-3 py-2">\u041A\u043E\u0434</th><th class="px-3 py-2">\u0422\u0438\u043F</th><th class="px-3 py-2">\u0417\u043D\u0430\u0447.</th><th class="px-3 py-2">\u041C\u0438\u043D.</th><th class="px-3 py-2">\u0410\u043A\u0442\u0438\u0432\u0435\u043D</th><th class="px-3 py-2"></th></tr></thead><tbody><!--[-->`);
        ssrRenderList(promos.value, (p) => {
          _push(`<tr class="border-b border-gray-100"><td class="px-3 py-2 font-mono">${ssrInterpolate(p.code)}</td><td class="px-3 py-2">${ssrInterpolate(p.type)}</td><td class="px-3 py-2">${ssrInterpolate(p.value)}</td><td class="px-3 py-2">${ssrInterpolate(p.min_order_amount)}</td><td class="px-3 py-2">${ssrInterpolate(p.is_active ? "\u0434\u0430" : "\u043D\u0435\u0442")}</td><td class="px-3 py-2 text-right"><button type="button" class="text-blue-600 hover:underline">\u0418\u0437\u043C.</button><button type="button" class="ml-2 text-red-600 hover:underline">\u0423\u0434\u0430\u043B.</button></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></section>`);
      } else {
        _push(`<section class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><h2 class="text-sm font-semibold text-gray-900">\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0431\u043E\u043D\u0443\u0441\u043E\u0432</h2><p class="mt-1 text-xs text-gray-500"> \u041D\u0430\u0447\u0438\u0441\u043B\u0435\u043D\u0438\u0435 \u0437\u0430 \u0437\u0430\u043A\u0430\u0437 \u2014 \u043F\u043E\u0441\u043B\u0435 \u0443\u0441\u043F\u0435\u0448\u043D\u043E\u0439 \u043E\u043D\u043B\u0430\u0439\u043D-\u043E\u043F\u043B\u0430\u0442\u044B. \u0421\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0431\u043E\u043D\u0443\u0441\u043E\u0432 \u2014 \u043F\u0440\u0438 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0438 \u0437\u0430\u043A\u0430\u0437\u0430. \u041C\u0430\u0433\u0430\u0437\u0438\u043D \u0437\u0430 \u0431\u0430\u043B\u043B\u044B \u0438 \u043E\u0442\u0437\u044B\u0432\u044B \u2014 \u0432 \u043F\u043B\u0430\u043D\u0430\u0445. </p><div class="mt-4 grid gap-3 sm:grid-cols-2"><label class="flex items-center gap-2 text-sm sm:col-span-2"><input${ssrIncludeBooleanAttr(Array.isArray(loyalty.bonuses_enabled) ? ssrLooseContain(loyalty.bonuses_enabled, null) : loyalty.bonuses_enabled) ? " checked" : ""} type="checkbox"> \u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0441\u0438\u0441\u0442\u0435\u043C\u0443 \u0431\u043E\u043D\u0443\u0441\u043E\u0432 </label><label class="text-sm"><span class="text-gray-600">\u041A\u044D\u0448\u0431\u0435\u043A \u0431\u043E\u043D\u0443\u0441\u0430\u043C\u0438, % \u043E\u0442 \u0441\u0443\u043C\u043C\u044B \u0442\u043E\u0432\u0430\u0440\u043E\u0432 \u043F\u043E\u0441\u043B\u0435 \u043F\u0440\u043E\u043C\u043E</span><input${ssrRenderAttr("value", loyalty.earn_percent_of_subtotal)} type="number" min="0" max="100" class="mt-1 w-full rounded border px-2 py-1.5"></label><label class="text-sm"><span class="text-gray-600">\u041C\u0430\u043A\u0441. % \u0437\u0430\u043A\u0430\u0437\u0430, \u043E\u043F\u043B\u0430\u0447\u0438\u0432\u0430\u0435\u043C\u044B\u0439 \u0431\u043E\u043D\u0443\u0441\u0430\u043C\u0438</span><input${ssrRenderAttr("value", loyalty.max_order_percent_payable_with_bonus)} type="number" min="0" max="100" class="mt-1 w-full rounded border px-2 py-1.5"></label><label class="flex items-center gap-2 text-sm sm:col-span-2"><input${ssrIncludeBooleanAttr(Array.isArray(loyalty.allow_simultaneous_bonus_spend_and_earn) ? ssrLooseContain(loyalty.allow_simultaneous_bonus_spend_and_earn, null) : loyalty.allow_simultaneous_bonus_spend_and_earn) ? " checked" : ""} type="checkbox"> \u0420\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u044C \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u0441\u043F\u0438\u0441\u044B\u0432\u0430\u0442\u044C \u0438 \u043D\u0430\u0447\u0438\u0441\u043B\u044F\u0442\u044C \u0431\u043E\u043D\u0443\u0441\u044B \u0432 \u043E\u0434\u043D\u043E\u043C \u0437\u0430\u043A\u0430\u0437\u0435 </label><p class="text-xs text-gray-500 sm:col-span-2"> \u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u0432 \u0437\u0430\u043A\u0430\u0437\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u043E\u0434\u0438\u043D \u0441\u0446\u0435\u043D\u0430\u0440\u0438\u0439: \u043B\u0438\u0431\u043E \u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435, \u043B\u0438\u0431\u043E \u043D\u0430\u0447\u0438\u0441\u043B\u0435\u043D\u0438\u0435. </p><label class="flex items-center gap-2 text-sm sm:col-span-2"><input${ssrIncludeBooleanAttr(Array.isArray(loyalty.expiry_enabled) ? ssrLooseContain(loyalty.expiry_enabled, null) : loyalty.expiry_enabled) ? " checked" : ""} type="checkbox"> \u0421\u0433\u043E\u0440\u0430\u043D\u0438\u0435 \u043F\u0440\u0438 \u043D\u0435\u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0438 (\u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430; \u0430\u0432\u0442\u043E-\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u2014 \u043F\u043E\u0437\u0436\u0435) </label><label class="text-sm"><span class="text-gray-600">\u0414\u043D\u0435\u0439 \u043D\u0435\u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0438 \u0434\u043E \u0441\u0433\u043E\u0440\u0430\u043D\u0438\u044F</span><input${ssrRenderAttr("value", loyalty.expiry_days_inactivity)} type="number" min="1" class="mt-1 w-full rounded border px-2 py-1.5"></label><label class="text-sm"><span class="text-gray-600">\u041F\u0440\u0438\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0431\u043E\u043D\u0443\u0441 (\u20BD)</span><input${ssrRenderAttr("value", loyalty.welcome_bonus_amount)} type="number" min="0" class="mt-1 w-full rounded border px-2 py-1.5"></label><label class="text-sm"><span class="text-gray-600">\u0414\u0435\u043D\u044C \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F (\u20BD)</span><input${ssrRenderAttr("value", loyalty.birthday_bonus_amount)} type="number" min="0" class="mt-1 w-full rounded border px-2 py-1.5"></label><label class="text-sm"><span class="text-gray-600">\u0417\u0430 \u043E\u0442\u0437\u044B\u0432 (\u20BD), \u043D\u0430\u0447\u0438\u0441\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u0441\u043B\u0435 \u043C\u043E\u0434\u0443\u043B\u044F \u043E\u0442\u0437\u044B\u0432\u043E\u0432</span><input${ssrRenderAttr("value", loyalty.review_bonus_amount)} type="number" min="0" class="mt-1 w-full rounded border px-2 py-1.5"></label><label class="text-sm"><span class="text-gray-600">\u0414\u043D\u0435\u0439 \u0434\u043E \u0414\u0420 \u0434\u043B\u044F \u043F\u043E\u0437\u0434\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F</span><input${ssrRenderAttr("value", loyalty.birthday_bonus_days_before)} type="number" min="0" max="60" class="mt-1 w-full rounded border px-2 py-1.5"></label></div><button type="button" class="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"${ssrIncludeBooleanAttr(loyaltySaving.value) ? " disabled" : ""}>${ssrInterpolate(loyaltySaving.value ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435\u2026" : "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438")}</button></section>`);
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

export { _sfc_main as default };
