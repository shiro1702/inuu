import { defineComponent, ref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain } from "vue/server-renderer";
import { useRoute, useRouter } from "vue-router";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "onboarding",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useRouter();
    const shopName = ref("");
    const slug = ref("");
    const shopDescription = ref("");
    const restaurantName = ref("");
    const address = ref("");
    const supportsDelivery = ref(true);
    const supportsPickup = ref(true);
    const telegramBotToken = ref("");
    const loading = ref(false);
    const errorMsg = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-lg px-4 py-10" }, _attrs))}><h1 class="text-2xl font-bold text-gray-900">Создать магазин</h1><p class="mt-2 text-sm text-gray-600"> Укажите данные магазина и первой точки. После создания вы попадёте в админку. </p><form class="mt-8 space-y-5"><fieldset class="space-y-4 rounded-lg border border-gray-200 bg-white p-4"><legend class="px-1 text-sm font-semibold text-gray-800">Магазин</legend><label class="block space-y-1"><span class="text-sm font-medium">Название</span><input${ssrRenderAttr("value", shopName.value)} type="text" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Моя пиццерия"></label><label class="block space-y-1"><span class="text-sm font-medium">Адрес в URL (slug)</span><input${ssrRenderAttr("value", slug.value)} type="text" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" class="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm lowercase" placeholder="my-pizza"><span class="text-xs text-gray-500">Латиница и дефис, например <code class="rounded bg-gray-100 px-1">my-shop</code></span></label><label class="block space-y-1"><span class="text-sm font-medium">Описание (необязательно)</span><textarea rows="2" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">${ssrInterpolate(shopDescription.value)}</textarea></label></fieldset><fieldset class="space-y-4 rounded-lg border border-gray-200 bg-white p-4"><legend class="px-1 text-sm font-semibold text-gray-800">Первая точка</legend><label class="block space-y-1"><span class="text-sm font-medium">Название точки</span><input${ssrRenderAttr("value", restaurantName.value)} type="text" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"></label><label class="block space-y-1"><span class="text-sm font-medium">Адрес</span><input${ssrRenderAttr("value", address.value)} type="text" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"></label><div class="flex flex-wrap gap-4 text-sm"><label class="inline-flex items-center gap-2"><input${ssrIncludeBooleanAttr(Array.isArray(supportsDelivery.value) ? ssrLooseContain(supportsDelivery.value, null) : supportsDelivery.value) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"> Доставка </label><label class="inline-flex items-center gap-2"><input${ssrIncludeBooleanAttr(Array.isArray(supportsPickup.value) ? ssrLooseContain(supportsPickup.value, null) : supportsPickup.value) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"> Самовывоз </label></div></fieldset><fieldset class="space-y-4 rounded-lg border border-gray-200 bg-white p-4"><legend class="px-1 text-sm font-semibold text-gray-800">Свой Telegram-бот (необязательно)</legend><p class="text-xs text-gray-600"> Если поле пустое, магазин использует <strong>платформенного бота</strong> сервера (<code class="rounded bg-gray-100 px-1">NUXT_BOT_TOKEN</code>): регистрация клиентов и уведомления идут через него. Подробнее: файл <code class="rounded bg-gray-100 px-1 text-xs">docs/TELEGRAM_PLATFORM_BOT.md</code> в репозитории. </p><label class="block space-y-1"><span class="text-sm font-medium">Токен своего бота от @BotFather</span><input${ssrRenderAttr("value", telegramBotToken.value)} type="password" autocomplete="off" class="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm" placeholder="Пусто = платформенный бот или NUXT_ONBOARDING_PLACEHOLDER_BOT_TOKEN"></label></fieldset>`);
      if (errorMsg.value) {
        _push(`<p class="text-sm text-red-600">${ssrInterpolate(errorMsg.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit" class="w-full rounded-lg bg-[#E25E2D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#C84E24] disabled:opacity-50"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}>${ssrInterpolate(loading.value ? "Создание…" : "Создать")}</button></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/onboarding.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
