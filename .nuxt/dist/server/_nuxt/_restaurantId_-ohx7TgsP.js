import { i as useRoute, _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from "vue/server-renderer";
import { u as useDashboardAccess } from "./useDashboardAccess-PseSveld.js";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
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
  __name: "[restaurantId]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { role } = useDashboardAccess();
    typeof route.params.restaurantId === "string" ? route.params.restaurantId : "";
    const tabs = [
      { id: "telegram", label: "Telegram" },
      { id: "max", label: "MAX" },
      { id: "recipients", label: "Получатели" }
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
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex flex-wrap items-start justify-between gap-3"><div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/integrations",
        class: "text-sm text-primary hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`← Назад к интеграциям`);
          } else {
            return [
              createTextVNode("← Назад к интеграциям")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="mt-2 text-2xl font-semibold">Уведомления филиала</h1><p class="mt-1 text-sm text-gray-600">${ssrInterpolate(restaurantName.value || "Загрузка филиала...")}</p></div><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">Обновить</button></div><div class="fixed right-4 top-4 z-[100] space-y-2"><!--[-->`);
      ssrRenderList(toasts.value, (toast) => {
        _push(`<div class="${ssrRenderClass([toast.type === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900", "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg"])}"><p class="max-w-xs">${ssrInterpolate(toast.message)}</p><button class="ml-1 text-xs">x</button></div>`);
      });
      _push(`<!--]--></div><div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">Режим менеджерских получателей</h2><p class="mt-1 text-xs text-gray-500"><span class="font-medium">Группа менеджеров</span> отправляет уведомления в общий Telegram/MAX-чат филиала. <span class="font-medium">Персональные менеджеры</span> отправляют уведомления по массиву получателей ниже. </p><select class="mt-3 w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}><option value="group"${ssrIncludeBooleanAttr(Array.isArray(notificationMode.value) ? ssrLooseContain(notificationMode.value, "group") : ssrLooseEqual(notificationMode.value, "group")) ? " selected" : ""}>Группа менеджеров</option><option value="personal"${ssrIncludeBooleanAttr(Array.isArray(notificationMode.value) ? ssrLooseContain(notificationMode.value, "personal") : ssrLooseEqual(notificationMode.value, "personal")) ? " selected" : ""}>Персональные менеджеры</option></select></div><div class="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-2"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button type="button" class="${ssrRenderClass([activeTab.value === tab.id ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-50", "rounded-lg px-3 py-2 text-sm transition-colors"])}">${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div>`);
      if (activeTab.value === "telegram") {
        _push(`<article class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">Telegram</h2><p class="mt-1 text-xs text-gray-500">Telegram-группа привязывается через deep-link и команду <span class="font-mono">/bind</span>.</p><label class="mt-3 block text-sm"><span class="mb-1 block text-gray-600">Telegram group chat id</span><input${ssrRenderAttr("value", managerGroupChatId.value)} type="text" placeholder="-100..." class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}></label><div class="mt-3 flex flex-wrap gap-2"><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}> Создать ссылку привязки Telegram </button><button class="rounded border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner" || !managerGroupChatId.value) ? " disabled" : ""}> Отвязать Telegram-чат </button></div>`);
        if (telegramChatBindDeepLink.value) {
          _push(`<div class="mt-3 rounded border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900"><p class="font-medium">Ссылка для привязки активна до ${ssrInterpolate(telegramChatBindExpiresAt.value)}</p><p class="mt-1 break-all">1) Откройте: <a${ssrRenderAttr("href", telegramChatBindDeepLink.value)} target="_blank" rel="noopener" class="underline">${ssrInterpolate(telegramChatBindDeepLink.value)}</a></p><p class="mt-1">2) Добавьте бота в нужную группу менеджеров</p><p class="mt-1">3) В группе отправьте: <span class="font-mono">${ssrInterpolate(telegramChatBindCommand.value)}</span></p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</article>`);
      } else if (activeTab.value === "max") {
        _push(`<article class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">MAX</h2><p class="mt-1 text-xs text-gray-500">MAX-группа привязывается через временную ссылку и slash-команду <span class="font-mono">/bindmax</span> в чате менеджеров.</p><label class="mt-3 block text-sm"><span class="mb-1 block text-gray-600">MAX group chat id / conversation id</span><input${ssrRenderAttr("value", managerMaxChatId.value)} type="text" placeholder="conv_..." class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}></label><div class="mt-3 flex flex-wrap gap-2"><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}> Создать ссылку привязки MAX </button></div>`);
        if (maxChatBindDeepLink.value) {
          _push(`<div class="mt-3 rounded border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900"><p class="font-medium">Ссылка для привязки активна до ${ssrInterpolate(maxChatBindExpiresAt.value)}</p><p class="mt-1 break-all">1) Откройте: <a${ssrRenderAttr("href", maxChatBindDeepLink.value)} target="_blank" rel="noopener" class="underline">${ssrInterpolate(maxChatBindDeepLink.value)}</a></p><p class="mt-1">2) Добавьте MAX-бота в нужную группу менеджеров</p><p class="mt-1">3) В группе отправьте именно slash-команду: <span class="font-mono">${ssrInterpolate(maxChatBindCommand.value)}</span></p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-3 rounded border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700"><p class="font-medium">Ручной fallback</p><p class="mt-1">Если MAX не передал стартовый параметр или команда не дошла до webhook, можно временно вставить conversation id вручную и сохранить настройки.</p></div></article>`);
      } else {
        _push(`<article class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">Персональные получатели</h2><p class="mt-1 text-xs text-gray-500"> Массив нужен только для режима “Персональные менеджеры”. Каждый элемент: канал и адрес получателя. </p><pre class="mt-3 overflow-auto rounded bg-gray-50 p-3 text-xs text-gray-600">[
  {&quot;channel&quot;:&quot;telegram&quot;,&quot;targetId&quot;:&quot;123456&quot;},
  {&quot;channel&quot;:&quot;max&quot;,&quot;targetId&quot;:&quot;conv_1&quot;}
]</pre><textarea class="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs" rows="5" placeholder="[{&quot;channel&quot;:&quot;telegram&quot;,&quot;targetId&quot;:&quot;123456&quot;},{&quot;channel&quot;:&quot;max&quot;,&quot;targetId&quot;:&quot;conv_1&quot;}]"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}>${ssrInterpolate(managerRecipientsRaw.value)}</textarea></article>`);
      }
      _push(`<article class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">Единый flow Telegram + MAX</h2><p class="mt-1 text-xs text-gray-500"> Единый flow включен всегда. Ниже настраиваются только ETA-кнопки и лимиты. </p><div class="mt-3 grid gap-3 sm:grid-cols-2"><label class="inline-flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(etaButtonsEnabled.value) ? ssrLooseContain(etaButtonsEnabled.value, null) : etaButtonsEnabled.value) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}><span>Кнопки ETA для клиента</span></label></div>`);
      if (etaButtonsEnabled.value) {
        _push(`<div class="mt-3"><p class="mb-2 text-sm text-gray-600">Пресеты ETA (готовые варианты)</p><div class="grid gap-2 sm:grid-cols-3"><!--[-->`);
        ssrRenderList(etaPresetOptions, (preset) => {
          _push(`<label class="inline-flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(etaPresetsSelected.value) ? ssrLooseContain(etaPresetsSelected.value, preset) : etaPresetsSelected.value) ? " checked" : ""}${ssrRenderAttr("value", preset)} type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}><span>${ssrInterpolate(preset)} мин</span></label>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-3 grid gap-3 sm:grid-cols-2"><label class="block text-sm"><span class="mb-1 block text-gray-600">Ограничение обновлений ETA (сек)</span><input${ssrRenderAttr("value", etaRateLimitSec.value)} type="number" min="30" max="3600" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}></label></div></article><article class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">Сервисные вызовы (по филиалу)</h2><p class="mt-1 text-xs text-gray-500"> Управление кнопками «Позвать официанта / кальянщика / выставить счет» отдельно для каждого филиала. </p><p class="mt-1 text-xs text-amber-700"> Глобальные ограничения из настроек организации применяются автоматически и не могут быть переопределены в филиале. </p><label class="mt-3 inline-flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(serviceCallsEnabled.value) ? ssrLooseContain(serviceCallsEnabled.value, null) : serviceCallsEnabled.value) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}><span>Включить сервисные вызовы в этом филиале</span></label><div class="mt-3 grid gap-2 sm:grid-cols-3"><label class="inline-flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(serviceCallTypeWaiter.value) ? ssrLooseContain(serviceCallTypeWaiter.value, null) : serviceCallTypeWaiter.value) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"${ssrIncludeBooleanAttr(unref(role) !== "owner" || !serviceCallsEnabled.value || !orgAllowedWaiter.value) ? " disabled" : ""}><span>Позвать официанта</span></label><label class="inline-flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(serviceCallTypeHookah.value) ? ssrLooseContain(serviceCallTypeHookah.value, null) : serviceCallTypeHookah.value) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"${ssrIncludeBooleanAttr(unref(role) !== "owner" || !serviceCallsEnabled.value || !orgAllowedHookah.value) ? " disabled" : ""}><span>Позвать кальянщика</span></label><label class="inline-flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(serviceCallTypeBill.value) ? ssrLooseContain(serviceCallTypeBill.value, null) : serviceCallTypeBill.value) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"${ssrIncludeBooleanAttr(unref(role) !== "owner" || !serviceCallsEnabled.value || !orgAllowedBill.value) ? " disabled" : ""}><span>Выставить счет</span></label></div></article><article class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">Сервисные вызовы: мониторинг (7 дней)</h2><div class="mt-2 grid gap-2 sm:grid-cols-4"><div class="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs">Всего: <span class="font-semibold">${ssrInterpolate(serviceCallStats.value.total)}</span></div><div class="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs">Открытых: <span class="font-semibold">${ssrInterpolate(serviceCallStats.value.open)}</span></div><div class="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs">Средний 1-й ответ: <span class="font-semibold">${ssrInterpolate(serviceCallStats.value.avgFirstResponseSec != null ? `${serviceCallStats.value.avgFirstResponseSec} сек` : "—")}</span></div><div class="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs">Среднее закрытие: <span class="font-semibold">${ssrInterpolate(serviceCallStats.value.avgResolvedSec != null ? `${serviceCallStats.value.avgResolvedSec} сек` : "—")}</span></div></div></article><article class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">Привязка сотрудников ботов</h2><p class="mt-1 text-xs text-gray-500"> Только привязанные сотрудники могут отправлять быстрые ответы по сервисным вызовам. </p><div class="mt-3 grid gap-2 md:grid-cols-5"><select class="rounded-lg border border-gray-300 px-3 py-2 text-sm"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}><option value="telegram"${ssrIncludeBooleanAttr(Array.isArray(newBindingChannel.value) ? ssrLooseContain(newBindingChannel.value, "telegram") : ssrLooseEqual(newBindingChannel.value, "telegram")) ? " selected" : ""}>Telegram</option><option value="max"${ssrIncludeBooleanAttr(Array.isArray(newBindingChannel.value) ? ssrLooseContain(newBindingChannel.value, "max") : ssrLooseEqual(newBindingChannel.value, "max")) ? " selected" : ""}>MAX</option></select><input${ssrRenderAttr("value", newBindingExternalUserId.value)} class="rounded-lg border border-gray-300 px-3 py-2 text-sm md:col-span-2" placeholder="External user id"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}><select class="rounded-lg border border-gray-300 px-3 py-2 text-sm"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}><option value="waiter"${ssrIncludeBooleanAttr(Array.isArray(newBindingStaffRole.value) ? ssrLooseContain(newBindingStaffRole.value, "waiter") : ssrLooseEqual(newBindingStaffRole.value, "waiter")) ? " selected" : ""}>waiter</option><option value="hookah"${ssrIncludeBooleanAttr(Array.isArray(newBindingStaffRole.value) ? ssrLooseContain(newBindingStaffRole.value, "hookah") : ssrLooseEqual(newBindingStaffRole.value, "hookah")) ? " selected" : ""}>hookah</option><option value="cashier"${ssrIncludeBooleanAttr(Array.isArray(newBindingStaffRole.value) ? ssrLooseContain(newBindingStaffRole.value, "cashier") : ssrLooseEqual(newBindingStaffRole.value, "cashier")) ? " selected" : ""}>cashier</option><option value="manager"${ssrIncludeBooleanAttr(Array.isArray(newBindingStaffRole.value) ? ssrLooseContain(newBindingStaffRole.value, "manager") : ssrLooseEqual(newBindingStaffRole.value, "manager")) ? " selected" : ""}>manager</option></select><button class="rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}> Добавить/обновить </button></div>`);
      if (staffBotBindings.value.length) {
        _push(`<div class="mt-3 overflow-x-auto"><table class="min-w-full text-xs"><thead><tr class="text-left text-gray-500"><th class="px-2 py-1">Канал</th><th class="px-2 py-1">User ID</th><th class="px-2 py-1">Роль</th><th class="px-2 py-1">Имя</th><th class="px-2 py-1">Активен</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(staffBotBindings.value, (item) => {
          _push(`<tr class="border-t border-gray-100"><td class="px-2 py-1">${ssrInterpolate(item.channel)}</td><td class="px-2 py-1 font-mono">${ssrInterpolate(item.externalUserId)}</td><td class="px-2 py-1">${ssrInterpolate(item.staffRole)}</td><td class="px-2 py-1">${ssrInterpolate(item.displayName || "—")}</td><td class="px-2 py-1">${ssrInterpolate(item.isActive ? "Да" : "Нет")}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      } else {
        _push(`<p class="mt-3 text-xs text-gray-500">Пока нет привязанных сотрудников.</p>`);
      }
      _push(`</article><div class="flex flex-wrap gap-2"><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner" || saving.value) ? " disabled" : ""}> Сохранить настройки </button><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner" || saving.value) ? " disabled" : ""}> Проверить уведомление </button></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/integrations/notifications/[restaurantId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
