import { i as useRoute, _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from 'vue/server-renderer';
import { u as useDashboardAccess } from './useDashboardAccess-PseSveld.mjs';
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
  __name: "[restaurantId]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { role } = useDashboardAccess();
    typeof route.params.restaurantId === "string" ? route.params.restaurantId : "";
    const tabs = [
      { id: "telegram", label: "Telegram" },
      { id: "max", label: "MAX" },
      { id: "recipients", label: "\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u0438" }
    ];
    const activeTab = ref("telegram");
    const restaurantName = ref("");
    const notificationMode = ref("group");
    const managerGroupChatId = ref("");
    const managerMaxChatId = ref("");
    const managerRecipientsRaw = ref("[]");
    const serviceCallsEnabled = ref(false);
    const serviceCallTypeWaiter = ref(true);
    const serviceCallTypeHookah = ref(true);
    const serviceCallTypeBill = ref(true);
    const orgAllowedWaiter = ref(true);
    const orgAllowedHookah = ref(false);
    const orgAllowedBill = ref(true);
    const etaButtonsEnabled = ref(false);
    const etaPresetOptions = [10, 15, 20, 30, 45, 60];
    const etaPresetsSelected = ref([10, 15, 20, 30, 45]);
    const etaRateLimitSec = ref(180);
    const staffBotBindings = ref([]);
    const serviceCallStats = ref({
      total: 0,
      open: 0,
      avgFirstResponseSec: null,
      avgResolvedSec: null
    });
    const newBindingChannel = ref("telegram");
    const newBindingExternalUserId = ref("");
    const newBindingStaffRole = ref("waiter");
    const saving = ref(false);
    const telegramChatBindDeepLink = ref("");
    const telegramChatBindCommand = ref("");
    const telegramChatBindExpiresAt = ref("");
    const maxChatBindDeepLink = ref("");
    const maxChatBindCommand = ref("");
    const maxChatBindExpiresAt = ref("");
    const toasts = ref([]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex flex-wrap items-start justify-between gap-3"><div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/integrations",
        class: "text-sm text-primary hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u2190 \u041D\u0430\u0437\u0430\u0434 \u043A \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044F\u043C`);
          } else {
            return [
              createTextVNode("\u2190 \u041D\u0430\u0437\u0430\u0434 \u043A \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044F\u043C")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="mt-2 text-2xl font-semibold">\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u0444\u0438\u043B\u0438\u0430\u043B\u0430</h1><p class="mt-1 text-sm text-gray-600">${ssrInterpolate(restaurantName.value || "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0444\u0438\u043B\u0438\u0430\u043B\u0430...")}</p></div><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C</button></div><div class="fixed right-4 top-4 z-[100] space-y-2"><!--[-->`);
      ssrRenderList(toasts.value, (toast) => {
        _push(`<div class="${ssrRenderClass([toast.type === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900", "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg"])}"><p class="max-w-xs">${ssrInterpolate(toast.message)}</p><button class="ml-1 text-xs">x</button></div>`);
      });
      _push(`<!--]--></div><div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">\u0420\u0435\u0436\u0438\u043C \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0441\u043A\u0438\u0445 \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u0435\u0439</h2><p class="mt-1 text-xs text-gray-500"><span class="font-medium">\u0413\u0440\u0443\u043F\u043F\u0430 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u043E\u0432</span> \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u0442 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u0432 \u043E\u0431\u0449\u0438\u0439 Telegram/MAX-\u0447\u0430\u0442 \u0444\u0438\u043B\u0438\u0430\u043B\u0430. <span class="font-medium">\u041F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u044B</span> \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u044E\u0442 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043F\u043E \u043C\u0430\u0441\u0441\u0438\u0432\u0443 \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u0435\u0439 \u043D\u0438\u0436\u0435. </p><select class="mt-3 w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}><option value="group"${ssrIncludeBooleanAttr(Array.isArray(notificationMode.value) ? ssrLooseContain(notificationMode.value, "group") : ssrLooseEqual(notificationMode.value, "group")) ? " selected" : ""}>\u0413\u0440\u0443\u043F\u043F\u0430 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u043E\u0432</option><option value="personal"${ssrIncludeBooleanAttr(Array.isArray(notificationMode.value) ? ssrLooseContain(notificationMode.value, "personal") : ssrLooseEqual(notificationMode.value, "personal")) ? " selected" : ""}>\u041F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u044B</option></select></div><div class="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-2"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button type="button" class="${ssrRenderClass([activeTab.value === tab.id ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-50", "rounded-lg px-3 py-2 text-sm transition-colors"])}">${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div>`);
      if (activeTab.value === "telegram") {
        _push(`<article class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">Telegram</h2><p class="mt-1 text-xs text-gray-500">Telegram-\u0433\u0440\u0443\u043F\u043F\u0430 \u043F\u0440\u0438\u0432\u044F\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0447\u0435\u0440\u0435\u0437 deep-link \u0438 \u043A\u043E\u043C\u0430\u043D\u0434\u0443 <span class="font-mono">/bind</span>.</p><label class="mt-3 block text-sm"><span class="mb-1 block text-gray-600">Telegram group chat id</span><input${ssrRenderAttr("value", managerGroupChatId.value)} type="text" placeholder="-100..." class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}></label><div class="mt-3 flex flex-wrap gap-2"><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}> \u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443 \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0438 Telegram </button><button class="rounded border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner" || !managerGroupChatId.value) ? " disabled" : ""}> \u041E\u0442\u0432\u044F\u0437\u0430\u0442\u044C Telegram-\u0447\u0430\u0442 </button></div>`);
        if (telegramChatBindDeepLink.value) {
          _push(`<div class="mt-3 rounded border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900"><p class="font-medium">\u0421\u0441\u044B\u043B\u043A\u0430 \u0434\u043B\u044F \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0438 \u0430\u043A\u0442\u0438\u0432\u043D\u0430 \u0434\u043E ${ssrInterpolate(telegramChatBindExpiresAt.value)}</p><p class="mt-1 break-all">1) \u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435: <a${ssrRenderAttr("href", telegramChatBindDeepLink.value)} target="_blank" rel="noopener" class="underline">${ssrInterpolate(telegramChatBindDeepLink.value)}</a></p><p class="mt-1">2) \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0431\u043E\u0442\u0430 \u0432 \u043D\u0443\u0436\u043D\u0443\u044E \u0433\u0440\u0443\u043F\u043F\u0443 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u043E\u0432</p><p class="mt-1">3) \u0412 \u0433\u0440\u0443\u043F\u043F\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435: <span class="font-mono">${ssrInterpolate(telegramChatBindCommand.value)}</span></p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</article>`);
      } else if (activeTab.value === "max") {
        _push(`<article class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">MAX</h2><p class="mt-1 text-xs text-gray-500">MAX-\u0433\u0440\u0443\u043F\u043F\u0430 \u043F\u0440\u0438\u0432\u044F\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0447\u0435\u0440\u0435\u0437 \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u0443\u044E \u0441\u0441\u044B\u043B\u043A\u0443 \u0438 slash-\u043A\u043E\u043C\u0430\u043D\u0434\u0443 <span class="font-mono">/bindmax</span> \u0432 \u0447\u0430\u0442\u0435 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u043E\u0432.</p><label class="mt-3 block text-sm"><span class="mb-1 block text-gray-600">MAX group chat id / conversation id</span><input${ssrRenderAttr("value", managerMaxChatId.value)} type="text" placeholder="conv_..." class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}></label><div class="mt-3 flex flex-wrap gap-2"><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}> \u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443 \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0438 MAX </button></div>`);
        if (maxChatBindDeepLink.value) {
          _push(`<div class="mt-3 rounded border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900"><p class="font-medium">\u0421\u0441\u044B\u043B\u043A\u0430 \u0434\u043B\u044F \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0438 \u0430\u043A\u0442\u0438\u0432\u043D\u0430 \u0434\u043E ${ssrInterpolate(maxChatBindExpiresAt.value)}</p><p class="mt-1 break-all">1) \u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435: <a${ssrRenderAttr("href", maxChatBindDeepLink.value)} target="_blank" rel="noopener" class="underline">${ssrInterpolate(maxChatBindDeepLink.value)}</a></p><p class="mt-1">2) \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 MAX-\u0431\u043E\u0442\u0430 \u0432 \u043D\u0443\u0436\u043D\u0443\u044E \u0433\u0440\u0443\u043F\u043F\u0443 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u043E\u0432</p><p class="mt-1">3) \u0412 \u0433\u0440\u0443\u043F\u043F\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u0438\u043C\u0435\u043D\u043D\u043E slash-\u043A\u043E\u043C\u0430\u043D\u0434\u0443: <span class="font-mono">${ssrInterpolate(maxChatBindCommand.value)}</span></p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-3 rounded border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700"><p class="font-medium">\u0420\u0443\u0447\u043D\u043E\u0439 fallback</p><p class="mt-1">\u0415\u0441\u043B\u0438 MAX \u043D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u043B \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 \u0438\u043B\u0438 \u043A\u043E\u043C\u0430\u043D\u0434\u0430 \u043D\u0435 \u0434\u043E\u0448\u043B\u0430 \u0434\u043E webhook, \u043C\u043E\u0436\u043D\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u0432\u0441\u0442\u0430\u0432\u0438\u0442\u044C conversation id \u0432\u0440\u0443\u0447\u043D\u0443\u044E \u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438.</p></div></article>`);
      } else {
        _push(`<article class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">\u041F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u0438</h2><p class="mt-1 text-xs text-gray-500"> \u041C\u0430\u0441\u0441\u0438\u0432 \u043D\u0443\u0436\u0435\u043D \u0442\u043E\u043B\u044C\u043A\u043E \u0434\u043B\u044F \u0440\u0435\u0436\u0438\u043C\u0430 \u201C\u041F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u044B\u201D. \u041A\u0430\u0436\u0434\u044B\u0439 \u044D\u043B\u0435\u043C\u0435\u043D\u0442: \u043A\u0430\u043D\u0430\u043B \u0438 \u0430\u0434\u0440\u0435\u0441 \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044F. </p><pre class="mt-3 overflow-auto rounded bg-gray-50 p-3 text-xs text-gray-600">[
  {&quot;channel&quot;:&quot;telegram&quot;,&quot;targetId&quot;:&quot;123456&quot;},
  {&quot;channel&quot;:&quot;max&quot;,&quot;targetId&quot;:&quot;conv_1&quot;}
]</pre><textarea class="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs" rows="5" placeholder="[{&quot;channel&quot;:&quot;telegram&quot;,&quot;targetId&quot;:&quot;123456&quot;},{&quot;channel&quot;:&quot;max&quot;,&quot;targetId&quot;:&quot;conv_1&quot;}]"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}>${ssrInterpolate(managerRecipientsRaw.value)}</textarea></article>`);
      }
      _push(`<article class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">\u0415\u0434\u0438\u043D\u044B\u0439 flow Telegram + MAX</h2><p class="mt-1 text-xs text-gray-500"> \u0415\u0434\u0438\u043D\u044B\u0439 flow \u0432\u043A\u043B\u044E\u0447\u0435\u043D \u0432\u0441\u0435\u0433\u0434\u0430. \u041D\u0438\u0436\u0435 \u043D\u0430\u0441\u0442\u0440\u0430\u0438\u0432\u0430\u044E\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E ETA-\u043A\u043D\u043E\u043F\u043A\u0438 \u0438 \u043B\u0438\u043C\u0438\u0442\u044B. </p><div class="mt-3 grid gap-3 sm:grid-cols-2"><label class="inline-flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(etaButtonsEnabled.value) ? ssrLooseContain(etaButtonsEnabled.value, null) : etaButtonsEnabled.value) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}><span>\u041A\u043D\u043E\u043F\u043A\u0438 ETA \u0434\u043B\u044F \u043A\u043B\u0438\u0435\u043D\u0442\u0430</span></label></div>`);
      if (etaButtonsEnabled.value) {
        _push(`<div class="mt-3"><p class="mb-2 text-sm text-gray-600">\u041F\u0440\u0435\u0441\u0435\u0442\u044B ETA (\u0433\u043E\u0442\u043E\u0432\u044B\u0435 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u044B)</p><div class="grid gap-2 sm:grid-cols-3"><!--[-->`);
        ssrRenderList(etaPresetOptions, (preset) => {
          _push(`<label class="inline-flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(etaPresetsSelected.value) ? ssrLooseContain(etaPresetsSelected.value, preset) : etaPresetsSelected.value) ? " checked" : ""}${ssrRenderAttr("value", preset)} type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}><span>${ssrInterpolate(preset)} \u043C\u0438\u043D</span></label>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-3 grid gap-3 sm:grid-cols-2"><label class="block text-sm"><span class="mb-1 block text-gray-600">\u041E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0435 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0439 ETA (\u0441\u0435\u043A)</span><input${ssrRenderAttr("value", etaRateLimitSec.value)} type="number" min="30" max="3600" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}></label></div></article><article class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">\u0421\u0435\u0440\u0432\u0438\u0441\u043D\u044B\u0435 \u0432\u044B\u0437\u043E\u0432\u044B (\u043F\u043E \u0444\u0438\u043B\u0438\u0430\u043B\u0443)</h2><p class="mt-1 text-xs text-gray-500"> \u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043A\u043D\u043E\u043F\u043A\u0430\u043C\u0438 \xAB\u041F\u043E\u0437\u0432\u0430\u0442\u044C \u043E\u0444\u0438\u0446\u0438\u0430\u043D\u0442\u0430 / \u043A\u0430\u043B\u044C\u044F\u043D\u0449\u0438\u043A\u0430 / \u0432\u044B\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0441\u0447\u0435\u0442\xBB \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E \u0434\u043B\u044F \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0444\u0438\u043B\u0438\u0430\u043B\u0430. </p><p class="mt-1 text-xs text-amber-700"> \u0413\u043B\u043E\u0431\u0430\u043B\u044C\u043D\u044B\u0435 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u044F \u0438\u0437 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438 \u043F\u0440\u0438\u043C\u0435\u043D\u044F\u044E\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0438 \u043D\u0435 \u043C\u043E\u0433\u0443\u0442 \u0431\u044B\u0442\u044C \u043F\u0435\u0440\u0435\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u044B \u0432 \u0444\u0438\u043B\u0438\u0430\u043B\u0435. </p><label class="mt-3 inline-flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(serviceCallsEnabled.value) ? ssrLooseContain(serviceCallsEnabled.value, null) : serviceCallsEnabled.value) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}><span>\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0441\u0435\u0440\u0432\u0438\u0441\u043D\u044B\u0435 \u0432\u044B\u0437\u043E\u0432\u044B \u0432 \u044D\u0442\u043E\u043C \u0444\u0438\u043B\u0438\u0430\u043B\u0435</span></label><div class="mt-3 grid gap-2 sm:grid-cols-3"><label class="inline-flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(serviceCallTypeWaiter.value) ? ssrLooseContain(serviceCallTypeWaiter.value, null) : serviceCallTypeWaiter.value) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"${ssrIncludeBooleanAttr(unref(role) !== "owner" || !serviceCallsEnabled.value || !orgAllowedWaiter.value) ? " disabled" : ""}><span>\u041F\u043E\u0437\u0432\u0430\u0442\u044C \u043E\u0444\u0438\u0446\u0438\u0430\u043D\u0442\u0430</span></label><label class="inline-flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(serviceCallTypeHookah.value) ? ssrLooseContain(serviceCallTypeHookah.value, null) : serviceCallTypeHookah.value) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"${ssrIncludeBooleanAttr(unref(role) !== "owner" || !serviceCallsEnabled.value || !orgAllowedHookah.value) ? " disabled" : ""}><span>\u041F\u043E\u0437\u0432\u0430\u0442\u044C \u043A\u0430\u043B\u044C\u044F\u043D\u0449\u0438\u043A\u0430</span></label><label class="inline-flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(serviceCallTypeBill.value) ? ssrLooseContain(serviceCallTypeBill.value, null) : serviceCallTypeBill.value) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"${ssrIncludeBooleanAttr(unref(role) !== "owner" || !serviceCallsEnabled.value || !orgAllowedBill.value) ? " disabled" : ""}><span>\u0412\u044B\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0441\u0447\u0435\u0442</span></label></div></article><article class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">\u0421\u0435\u0440\u0432\u0438\u0441\u043D\u044B\u0435 \u0432\u044B\u0437\u043E\u0432\u044B: \u043C\u043E\u043D\u0438\u0442\u043E\u0440\u0438\u043D\u0433 (7 \u0434\u043D\u0435\u0439)</h2><div class="mt-2 grid gap-2 sm:grid-cols-4"><div class="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs">\u0412\u0441\u0435\u0433\u043E: <span class="font-semibold">${ssrInterpolate(serviceCallStats.value.total)}</span></div><div class="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs">\u041E\u0442\u043A\u0440\u044B\u0442\u044B\u0445: <span class="font-semibold">${ssrInterpolate(serviceCallStats.value.open)}</span></div><div class="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs">\u0421\u0440\u0435\u0434\u043D\u0438\u0439 1-\u0439 \u043E\u0442\u0432\u0435\u0442: <span class="font-semibold">${ssrInterpolate(serviceCallStats.value.avgFirstResponseSec != null ? `${serviceCallStats.value.avgFirstResponseSec} \u0441\u0435\u043A` : "\u2014")}</span></div><div class="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs">\u0421\u0440\u0435\u0434\u043D\u0435\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u0438\u0435: <span class="font-semibold">${ssrInterpolate(serviceCallStats.value.avgResolvedSec != null ? `${serviceCallStats.value.avgResolvedSec} \u0441\u0435\u043A` : "\u2014")}</span></div></div></article><article class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">\u041F\u0440\u0438\u0432\u044F\u0437\u043A\u0430 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432 \u0431\u043E\u0442\u043E\u0432</h2><p class="mt-1 text-xs text-gray-500"> \u0422\u043E\u043B\u044C\u043A\u043E \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D\u043D\u044B\u0435 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0438 \u043C\u043E\u0433\u0443\u0442 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0442\u044C \u0431\u044B\u0441\u0442\u0440\u044B\u0435 \u043E\u0442\u0432\u0435\u0442\u044B \u043F\u043E \u0441\u0435\u0440\u0432\u0438\u0441\u043D\u044B\u043C \u0432\u044B\u0437\u043E\u0432\u0430\u043C. </p><div class="mt-3 grid gap-2 md:grid-cols-5"><select class="rounded-lg border border-gray-300 px-3 py-2 text-sm"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}><option value="telegram"${ssrIncludeBooleanAttr(Array.isArray(newBindingChannel.value) ? ssrLooseContain(newBindingChannel.value, "telegram") : ssrLooseEqual(newBindingChannel.value, "telegram")) ? " selected" : ""}>Telegram</option><option value="max"${ssrIncludeBooleanAttr(Array.isArray(newBindingChannel.value) ? ssrLooseContain(newBindingChannel.value, "max") : ssrLooseEqual(newBindingChannel.value, "max")) ? " selected" : ""}>MAX</option></select><input${ssrRenderAttr("value", newBindingExternalUserId.value)} class="rounded-lg border border-gray-300 px-3 py-2 text-sm md:col-span-2" placeholder="External user id"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}><select class="rounded-lg border border-gray-300 px-3 py-2 text-sm"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}><option value="waiter"${ssrIncludeBooleanAttr(Array.isArray(newBindingStaffRole.value) ? ssrLooseContain(newBindingStaffRole.value, "waiter") : ssrLooseEqual(newBindingStaffRole.value, "waiter")) ? " selected" : ""}>waiter</option><option value="hookah"${ssrIncludeBooleanAttr(Array.isArray(newBindingStaffRole.value) ? ssrLooseContain(newBindingStaffRole.value, "hookah") : ssrLooseEqual(newBindingStaffRole.value, "hookah")) ? " selected" : ""}>hookah</option><option value="cashier"${ssrIncludeBooleanAttr(Array.isArray(newBindingStaffRole.value) ? ssrLooseContain(newBindingStaffRole.value, "cashier") : ssrLooseEqual(newBindingStaffRole.value, "cashier")) ? " selected" : ""}>cashier</option><option value="manager"${ssrIncludeBooleanAttr(Array.isArray(newBindingStaffRole.value) ? ssrLooseContain(newBindingStaffRole.value, "manager") : ssrLooseEqual(newBindingStaffRole.value, "manager")) ? " selected" : ""}>manager</option></select><button class="rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}> \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C/\u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C </button></div>`);
      if (staffBotBindings.value.length) {
        _push(`<div class="mt-3 overflow-x-auto"><table class="min-w-full text-xs"><thead><tr class="text-left text-gray-500"><th class="px-2 py-1">\u041A\u0430\u043D\u0430\u043B</th><th class="px-2 py-1">User ID</th><th class="px-2 py-1">\u0420\u043E\u043B\u044C</th><th class="px-2 py-1">\u0418\u043C\u044F</th><th class="px-2 py-1">\u0410\u043A\u0442\u0438\u0432\u0435\u043D</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(staffBotBindings.value, (item) => {
          _push(`<tr class="border-t border-gray-100"><td class="px-2 py-1">${ssrInterpolate(item.channel)}</td><td class="px-2 py-1 font-mono">${ssrInterpolate(item.externalUserId)}</td><td class="px-2 py-1">${ssrInterpolate(item.staffRole)}</td><td class="px-2 py-1">${ssrInterpolate(item.displayName || "\u2014")}</td><td class="px-2 py-1">${ssrInterpolate(item.isActive ? "\u0414\u0430" : "\u041D\u0435\u0442")}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      } else {
        _push(`<p class="mt-3 text-xs text-gray-500">\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D\u043D\u044B\u0445 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432.</p>`);
      }
      _push(`</article><div class="flex flex-wrap gap-2"><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner" || saving.value) ? " disabled" : ""}> \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 </button><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner" || saving.value) ? " disabled" : ""}> \u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435 </button></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/integrations/notifications/[restaurantId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
