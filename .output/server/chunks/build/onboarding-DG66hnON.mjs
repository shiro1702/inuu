import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';

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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-lg px-4 py-10" }, _attrs))}><h1 class="text-2xl font-bold text-gray-900">\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043C\u0430\u0433\u0430\u0437\u0438\u043D</h1><p class="mt-2 text-sm text-gray-600"> \u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430 \u0438 \u043F\u0435\u0440\u0432\u043E\u0439 \u0442\u043E\u0447\u043A\u0438. \u041F\u043E\u0441\u043B\u0435 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u0432\u044B \u043F\u043E\u043F\u0430\u0434\u0451\u0442\u0435 \u0432 \u0430\u0434\u043C\u0438\u043D\u043A\u0443. </p><form class="mt-8 space-y-5"><fieldset class="space-y-4 rounded-lg border border-gray-200 bg-white p-4"><legend class="px-1 text-sm font-semibold text-gray-800">\u041C\u0430\u0433\u0430\u0437\u0438\u043D</legend><label class="block space-y-1"><span class="text-sm font-medium">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435</span><input${ssrRenderAttr("value", shopName.value)} type="text" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="\u041C\u043E\u044F \u043F\u0438\u0446\u0446\u0435\u0440\u0438\u044F"></label><label class="block space-y-1"><span class="text-sm font-medium">\u0410\u0434\u0440\u0435\u0441 \u0432 URL (slug)</span><input${ssrRenderAttr("value", slug.value)} type="text" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" class="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm lowercase" placeholder="my-pizza"><span class="text-xs text-gray-500">\u041B\u0430\u0442\u0438\u043D\u0438\u0446\u0430 \u0438 \u0434\u0435\u0444\u0438\u0441, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 <code class="rounded bg-gray-100 px-1">my-shop</code></span></label><label class="block space-y-1"><span class="text-sm font-medium">\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)</span><textarea rows="2" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">${ssrInterpolate(shopDescription.value)}</textarea></label></fieldset><fieldset class="space-y-4 rounded-lg border border-gray-200 bg-white p-4"><legend class="px-1 text-sm font-semibold text-gray-800">\u041F\u0435\u0440\u0432\u0430\u044F \u0442\u043E\u0447\u043A\u0430</legend><label class="block space-y-1"><span class="text-sm font-medium">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0442\u043E\u0447\u043A\u0438</span><input${ssrRenderAttr("value", restaurantName.value)} type="text" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"></label><label class="block space-y-1"><span class="text-sm font-medium">\u0410\u0434\u0440\u0435\u0441</span><input${ssrRenderAttr("value", address.value)} type="text" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"></label><div class="flex flex-wrap gap-4 text-sm"><label class="inline-flex items-center gap-2"><input${ssrIncludeBooleanAttr(Array.isArray(supportsDelivery.value) ? ssrLooseContain(supportsDelivery.value, null) : supportsDelivery.value) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"> \u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430 </label><label class="inline-flex items-center gap-2"><input${ssrIncludeBooleanAttr(Array.isArray(supportsPickup.value) ? ssrLooseContain(supportsPickup.value, null) : supportsPickup.value) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"> \u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 </label></div></fieldset><fieldset class="space-y-4 rounded-lg border border-gray-200 bg-white p-4"><legend class="px-1 text-sm font-semibold text-gray-800">\u0421\u0432\u043E\u0439 Telegram-\u0431\u043E\u0442 (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)</legend><p class="text-xs text-gray-600"> \u0415\u0441\u043B\u0438 \u043F\u043E\u043B\u0435 \u043F\u0443\u0441\u0442\u043E\u0435, \u043C\u0430\u0433\u0430\u0437\u0438\u043D \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442 <strong>\u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0435\u043D\u043D\u043E\u0433\u043E \u0431\u043E\u0442\u0430</strong> \u0441\u0435\u0440\u0432\u0435\u0440\u0430 (<code class="rounded bg-gray-100 px-1">NUXT_BOT_TOKEN</code>): \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u043A\u043B\u0438\u0435\u043D\u0442\u043E\u0432 \u0438 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u0438\u0434\u0443\u0442 \u0447\u0435\u0440\u0435\u0437 \u043D\u0435\u0433\u043E. \u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435: \u0444\u0430\u0439\u043B <code class="rounded bg-gray-100 px-1 text-xs">docs/TELEGRAM_PLATFORM_BOT.md</code> \u0432 \u0440\u0435\u043F\u043E\u0437\u0438\u0442\u043E\u0440\u0438\u0438. </p><label class="block space-y-1"><span class="text-sm font-medium">\u0422\u043E\u043A\u0435\u043D \u0441\u0432\u043E\u0435\u0433\u043E \u0431\u043E\u0442\u0430 \u043E\u0442 @BotFather</span><input${ssrRenderAttr("value", telegramBotToken.value)} type="password" autocomplete="off" class="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm" placeholder="\u041F\u0443\u0441\u0442\u043E = \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0435\u043D\u043D\u044B\u0439 \u0431\u043E\u0442 \u0438\u043B\u0438 NUXT_ONBOARDING_PLACEHOLDER_BOT_TOKEN"></label></fieldset>`);
      if (errorMsg.value) {
        _push(`<p class="text-sm text-red-600">${ssrInterpolate(errorMsg.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit" class="w-full rounded-lg bg-[#E25E2D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#C84E24] disabled:opacity-50"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}>${ssrInterpolate(loading.value ? "\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435\u2026" : "\u0421\u043E\u0437\u0434\u0430\u0442\u044C")}</button></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/onboarding.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
