import { c as _export_sfc, o as useSupabaseUser, m as useSupabaseClient, q as useTenant, u as useLegalPaths, p as useTelegram, _ as __nuxt_component_0$2, b as __nuxt_component_1$1, k as useRuntimeConfig } from './server.mjs';
import { defineComponent, computed, ref, reactive, watch, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrInterpolate, ssrRenderComponent, ssrRenderTeleport, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
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

function parseMessengerStorageValue(raw) {
  if (raw == null) return null;
  if (typeof raw === "string") return raw;
  if (typeof raw !== "object") return null;
  const o = raw;
  if (typeof o.value === "string") return o.value;
  if (o.value === null) return null;
  return null;
}
function useMessengerStorage() {
  const { isTelegram, isMaxMiniApp } = useTelegram();
  function canUseMessengerStorage() {
    return false;
  }
  async function setItem(key, value) {
    var _a, _b;
    const tg = (_a = (void 0).Telegram) == null ? void 0 : _a.WebApp;
    if (isTelegram.value && (tg == null ? void 0 : tg.CloudStorage)) {
      try {
        await new Promise((resolve) => {
          ;
          tg.CloudStorage.setItem(key, value, (err) => {
            if (err) {
              console.warn("[messengerStorage] CloudStorage.setItem failed", err);
            }
            resolve();
          });
        });
      } catch (err) {
        console.warn("[messengerStorage] CloudStorage.setItem threw", err);
      }
      return;
    }
    if (isMaxMiniApp.value && ((_b = (void 0).WebApp) == null ? void 0 : _b.DeviceStorage)) {
      try {
        await (void 0).WebApp.DeviceStorage.setItem(key, value);
      } catch (err) {
        console.warn("[messengerStorage] DeviceStorage.setItem failed", err);
      }
    }
  }
  async function getItem(key) {
    var _a, _b;
    const tg = (_a = (void 0).Telegram) == null ? void 0 : _a.WebApp;
    if (isTelegram.value && (tg == null ? void 0 : tg.CloudStorage)) {
      return new Promise((resolve) => {
        tg.CloudStorage.getItem(key, (_err, v) => {
          resolve(v != null ? v : null);
        });
      });
    }
    if (isMaxMiniApp.value && ((_b = (void 0).WebApp) == null ? void 0 : _b.DeviceStorage)) {
      try {
        const res = await (void 0).WebApp.DeviceStorage.getItem(key);
        return parseMessengerStorageValue(res);
      } catch (err) {
        console.warn("[messengerStorage] DeviceStorage.getItem failed", err);
        return null;
      }
    }
    return null;
  }
  return {
    canUseMessengerStorage,
    setItem,
    getItem
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const user = useSupabaseUser();
    useSupabaseClient();
    useRoute();
    useTenant();
    const { consentPath } = useLegalPaths();
    const config = useRuntimeConfig();
    const defaultCitySlug = computed(() => {
      var _a;
      const raw = (_a = config.public) == null ? void 0 : _a.defaultCitySlug;
      return typeof raw === "string" && raw.trim() ? raw.trim() : "ulan-ude";
    });
    const { isMessengerMiniApp, isTelegram, isMaxMiniApp, messengerWebApp } = useTelegram();
    useMessengerStorage();
    const telegramBotName = config.public.telegramBotName || "";
    const telegramBotUrl = computed(() => telegramBotName ? `https://t.me/${telegramBotName}` : null);
    const maxBotUrl = computed(() => {
      const raw = config.public.maxBotUrl || "";
      const trimmed = raw.trim();
      return trimmed || null;
    });
    const vkAuthEnabled = computed(() => {
      const raw = config.public.vkIdClientId;
      const appId = raw != null && raw !== "" ? String(raw).trim() : "";
      return Boolean(appId);
    });
    const profileAuthChannels = computed(() => {
      const opts = [];
      if (telegramBotUrl.value) opts.push("telegram");
      if (maxBotUrl.value) opts.push("max");
      if (vkAuthEnabled.value) opts.push("vk");
      return opts;
    });
    const showAuthModal = ref(false);
    function closeAuthChooserModal() {
      showAuthModal.value = false;
    }
    function onProfileAuthChannelSubmit(channel) {
      if (channel === "telegram") {
        void openTelegramAuth();
        return;
      }
      if (channel === "max") {
        void openMaxAuth();
        return;
      }
      void openVkAuth();
    }
    const showProfileModal = ref(false);
    const isSaving = ref(false);
    const saveStatus = ref("");
    const profileForm = reactive({
      name: "",
      phone: "",
      notes: ""
    });
    computed(() => {
      var _a;
      const raw = (_a = user.value) == null ? void 0 : _a.sub;
      return typeof raw === "string" ? raw : null;
    });
    const telegramId = computed(() => {
      var _a, _b;
      const raw = (_b = (_a = user.value) == null ? void 0 : _a.user_metadata) == null ? void 0 : _b.telegram_id;
      return typeof raw === "number" ? raw : null;
    });
    const maxUserId = computed(() => {
      var _a, _b;
      const raw = (_b = (_a = user.value) == null ? void 0 : _a.user_metadata) == null ? void 0 : _b.max_user_id;
      if (typeof raw === "string") {
        const trimmed = raw.trim();
        return trimmed || null;
      }
      if (typeof raw === "number") return String(raw);
      return null;
    });
    const authMetadata = computed(() => {
      var _a, _b;
      return (_b = (_a = user.value) == null ? void 0 : _a.user_metadata) != null ? _b : {};
    });
    const messengerUser = computed(() => {
      var _a, _b;
      const raw = (_b = (_a = messengerWebApp.value) == null ? void 0 : _a.initDataUnsafe) == null ? void 0 : _b.user;
      return raw && typeof raw === "object" ? raw : null;
    });
    const resolvedEmail = computed(() => {
      var _a;
      const raw = (_a = user.value) == null ? void 0 : _a.email;
      return typeof raw === "string" && raw.trim() ? raw.trim() : null;
    });
    const resolvedProfileName = computed(() => {
      var _a, _b, _c;
      const candidates = [
        profileForm.name,
        authMetadata.value.full_name,
        authMetadata.value.name,
        authMetadata.value.first_name,
        [(_a = messengerUser.value) == null ? void 0 : _a.first_name, (_b = messengerUser.value) == null ? void 0 : _b.last_name].filter(Boolean).join(" "),
        ((_c = messengerUser.value) == null ? void 0 : _c.username) ? `@${messengerUser.value.username}` : ""
      ];
      for (const item of candidates) {
        if (typeof item === "string" && item.trim()) return item.trim();
      }
      return "";
    });
    const telegramDisplay = computed(() => {
      var _a;
      if (telegramId.value !== null) return `\u041F\u0440\u0438\u0432\u044F\u0437\u0430\u043D, ID ${telegramId.value}`;
      if (isTelegram.value && ((_a = messengerUser.value) == null ? void 0 : _a.id)) {
        const username = typeof messengerUser.value.username === "string" && messengerUser.value.username.trim() ? ` (@${messengerUser.value.username.trim()})` : "";
        return `Mini App user ID ${messengerUser.value.id}${username}`;
      }
      return "\u041D\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0451\u043D";
    });
    const maxDisplay = computed(() => {
      var _a;
      if (maxUserId.value) return `\u041F\u0440\u0438\u0432\u044F\u0437\u0430\u043D, ID ${maxUserId.value}`;
      if (isMaxMiniApp.value && ((_a = messengerUser.value) == null ? void 0 : _a.id)) {
        return `Mini App user ID ${messengerUser.value.id}`;
      }
      return "\u041D\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0451\u043D";
    });
    const messengerDebugLabel = computed(() => {
      if (isTelegram.value) return "Telegram Mini App";
      if (isMaxMiniApp.value) return "MAX Mini App";
      if (user.value) return "\u0410\u043A\u043A\u0430\u0443\u043D\u0442 \u0441\u0430\u0439\u0442\u0430";
      return "";
    });
    const hasAnyProfileData = computed(() => {
      var _a;
      return Boolean(
        resolvedProfileName.value || profileForm.phone.trim() || resolvedEmail.value || telegramId.value !== null || maxUserId.value || ((_a = messengerUser.value) == null ? void 0 : _a.id)
      );
    });
    function hydrateProfileFormFromKnownSources() {
      var _a, _b;
      if (!profileForm.name.trim()) {
        const fallbackName = [
          authMetadata.value.full_name,
          authMetadata.value.name,
          [(_a = messengerUser.value) == null ? void 0 : _a.first_name, (_b = messengerUser.value) == null ? void 0 : _b.last_name].filter(Boolean).join(" ")
        ].find((value) => typeof value === "string" && value.trim());
        if (typeof fallbackName === "string") profileForm.name = fallbackName.trim();
      }
      if (!profileForm.phone.trim() && typeof authMetadata.value.phone === "string") {
        profileForm.phone = authMetadata.value.phone.trim();
      }
      if (!profileForm.notes.trim() && typeof authMetadata.value.order_notes === "string") {
        profileForm.notes = authMetadata.value.order_notes.trim();
      }
    }
    watch([user, messengerUser], () => {
      hydrateProfileFormFromKnownSources();
    }, { immediate: true });
    async function openTelegramAuth() {
      closeAuthChooserModal();
      if (!telegramBotUrl.value || true) return;
    }
    async function openVkAuth() {
      closeAuthChooserModal();
      if (!vkAuthEnabled.value || true) return;
    }
    async function openMaxAuth() {
      closeAuthChooserModal();
      if (!maxBotUrl.value || true) return;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      const _component_AuthChannelModal = __nuxt_component_1$1;
      _push(`<!--[--><div class="profile-page" data-v-e2c4a75b><h1 data-v-e2c4a75b>\u041F\u0440\u043E\u0444\u0438\u043B\u044C</h1><div class="card" data-v-e2c4a75b><div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between" data-v-e2c4a75b><div data-v-e2c4a75b><h2 data-v-e2c4a75b>\u0414\u0430\u043D\u043D\u044B\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F</h2><p class="hint" data-v-e2c4a75b> \u0412 mini app \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u043C \u0432\u0441\u0451, \u0447\u0442\u043E \u0443\u0436\u0435 \u0437\u043D\u0430\u0435\u043C \u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435 \u0438\u0437 \u043C\u0435\u0441\u0441\u0435\u043D\u0434\u0436\u0435\u0440\u0430, \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430 \u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u043E\u0439 \u0430\u043D\u043A\u0435\u0442\u044B. </p></div>`);
      if (unref(isMessengerMiniApp)) {
        _push(`<span class="badge badge-messenger" data-v-e2c4a75b> Mini App </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><dl class="info mt-4" data-v-e2c4a75b><div data-v-e2c4a75b><dt data-v-e2c4a75b>\u0418\u043C\u044F</dt><dd data-v-e2c4a75b>${ssrInterpolate(resolvedProfileName.value || "\u041F\u043E\u043A\u0430 \u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E")}</dd></div><div data-v-e2c4a75b><dt data-v-e2c4a75b>\u0422\u0435\u043B\u0435\u0444\u043E\u043D</dt><dd data-v-e2c4a75b>${ssrInterpolate(profileForm.phone || "\u041F\u043E\u043A\u0430 \u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D")}</dd></div><div data-v-e2c4a75b><dt data-v-e2c4a75b>Email</dt><dd data-v-e2c4a75b>${ssrInterpolate(resolvedEmail.value || "\u041F\u043E\u043A\u0430 \u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D")}</dd></div><div data-v-e2c4a75b><dt data-v-e2c4a75b>Telegram</dt><dd data-v-e2c4a75b>${ssrInterpolate(telegramDisplay.value)}</dd></div><div data-v-e2c4a75b><dt data-v-e2c4a75b>MAX</dt><dd data-v-e2c4a75b>${ssrInterpolate(maxDisplay.value)}</dd></div>`);
      if (messengerDebugLabel.value) {
        _push(`<div data-v-e2c4a75b><dt data-v-e2c4a75b>\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A</dt><dd data-v-e2c4a75b>${ssrInterpolate(messengerDebugLabel.value)}</dd></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</dl>`);
      if (!hasAnyProfileData.value) {
        _push(`<div class="empty-state" data-v-e2c4a75b><p class="font-medium text-gray-900" data-v-e2c4a75b> \u041F\u043E\u043A\u0430 \u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435 \u043D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445. </p><p class="hint" data-v-e2c4a75b> \u041D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435\xBB, \u0447\u0442\u043E\u0431\u044B \u0437\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0430\u043D\u043A\u0435\u0442\u0443, \u0438\u043B\u0438 \u043F\u0440\u0438\u0432\u044F\u0436\u0438\u0442\u0435 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 \u0447\u0435\u0440\u0435\u0437 \u0431\u043E\u0442\u0430. </p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-4 flex flex-col gap-2" data-v-e2c4a75b><button type="button" class="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white sm:w-auto sm:self-start" data-v-e2c4a75b> \u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 </button><div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap" data-v-e2c4a75b>`);
      if (telegramBotUrl.value) {
        _push(`<button type="button" class="rounded-lg border border-primary bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5" data-v-e2c4a75b>${ssrInterpolate(unref(isMessengerMiniApp) ? "\u0417\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u0447\u0435\u0440\u0435\u0437 Telegram" : telegramId.value !== null ? "\u041F\u0435\u0440\u0435\u043F\u0440\u0438\u0432\u044F\u0437\u0430\u0442\u044C Telegram" : "\u0412\u043E\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 Telegram")}</button>`);
      } else {
        _push(`<!---->`);
      }
      if (maxBotUrl.value) {
        _push(`<button type="button" class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" data-v-e2c4a75b>${ssrInterpolate(unref(isMessengerMiniApp) ? "\u0417\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u0447\u0435\u0440\u0435\u0437 MAX" : maxUserId.value ? "\u041F\u0435\u0440\u0435\u043F\u0440\u0438\u0432\u044F\u0437\u0430\u0442\u044C MAX" : "\u0412\u043E\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 MAX")}</button>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isMessengerMiniApp) && !unref(user)) {
        _push(`<button type="button" class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" data-v-e2c4a75b> \u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0441\u043F\u043E\u0441\u043E\u0431 \u0432\u0445\u043E\u0434\u0430 </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      if (unref(user)) {
        _push(`<div class="card" data-v-e2c4a75b><h2 data-v-e2c4a75b>\u041C\u043E\u0438 \u0437\u0430\u043F\u0438\u0441\u0438</h2><p class="hint" data-v-e2c4a75b> \u0418\u0441\u0442\u043E\u0440\u0438\u044F \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u0438 \u0431\u0438\u043B\u0435\u0442\u043E\u0432 \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u0432 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u043C \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0438 INUU. \u041F\u043E\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0439\u0442\u0435 \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435 \u0438 \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0438 \u0447\u0435\u0440\u0435\u0437 Telegram / MAX. </p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/${defaultCitySlug.value}`,
          class: "mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u041D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E \u0433\u043E\u0440\u043E\u0434\u0430 `);
            } else {
              return [
                createTextVNode(" \u041D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E \u0433\u043E\u0440\u043E\u0434\u0430 ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div data-v-e2c4a75b>`);
        if (showProfileModal.value) {
          _push2(`<div class="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto p-4 py-10" data-v-e2c4a75b><div class="absolute inset-0 bg-black/40" data-v-e2c4a75b></div><div role="dialog" aria-modal="true" aria-labelledby="profile-sheet-title" class="relative z-[1] my-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl" data-v-e2c4a75b><div class="flex items-start justify-between gap-3" data-v-e2c4a75b><div data-v-e2c4a75b><h3 id="profile-sheet-title" class="text-base font-semibold text-gray-900" data-v-e2c4a75b> \u0410\u043D\u043A\u0435\u0442\u0430 \u0434\u043B\u044F \u0437\u0430\u043A\u0430\u0437\u0430 </h3><p class="mt-1 hint" data-v-e2c4a75b> \u042D\u0442\u0438 \u0434\u0430\u043D\u043D\u044B\u0435 \u043C\u043E\u0436\u043D\u043E \u0437\u0430\u0440\u0430\u043D\u0435\u0435 \u0437\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0432 mini app, \u0447\u0442\u043E\u0431\u044B \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435 \u0437\u0430\u043A\u0430\u0437\u0430 \u0431\u044B\u043B\u043E \u0431\u044B\u0441\u0442\u0440\u0435\u0435. </p></div><button type="button" class="shrink-0 rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-800" aria-label="\u0417\u0430\u043A\u0440\u044B\u0442\u044C" data-v-e2c4a75b> \u2715 </button></div>`);
          if (saveStatus.value) {
            _push2(`<span class="mt-2 block text-xs text-gray-500" data-v-e2c4a75b>${ssrInterpolate(saveStatus.value)}</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="mt-4 grid gap-3" data-v-e2c4a75b><label class="field" data-v-e2c4a75b><span data-v-e2c4a75b>\u0418\u043C\u044F</span><input${ssrRenderAttr("value", profileForm.name)} type="text" placeholder="\u041A\u0430\u043A \u043A \u0432\u0430\u043C \u043E\u0431\u0440\u0430\u0449\u0430\u0442\u044C\u0441\u044F" data-v-e2c4a75b></label><label class="field" data-v-e2c4a75b><span data-v-e2c4a75b>\u0422\u0435\u043B\u0435\u0444\u043E\u043D</span><input${ssrRenderAttr("value", profileForm.phone)} type="tel" placeholder="+7 900 000-00-00" data-v-e2c4a75b></label><label class="field" data-v-e2c4a75b><span data-v-e2c4a75b>\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439</span><textarea rows="3" placeholder="\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: \u0434\u043E\u043C\u043E\u0444\u043E\u043D, \u044D\u0442\u0430\u0436, \u0443\u0434\u043E\u0431\u043D\u044B\u0439 \u0441\u043F\u043E\u0441\u043E\u0431 \u0441\u0432\u044F\u0437\u0438" data-v-e2c4a75b>${ssrInterpolate(profileForm.notes)}</textarea></label></div><div class="mt-5 flex flex-col gap-2 sm:flex-row" data-v-e2c4a75b><button type="button" class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"${ssrIncludeBooleanAttr(isSaving.value) ? " disabled" : ""} data-v-e2c4a75b>${ssrInterpolate(isSaving.value ? "\u0421\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u043C..." : "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435")}</button>`);
          if (telegramBotUrl.value || maxBotUrl.value || vkAuthEnabled.value) {
            _push2(`<button type="button" class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" data-v-e2c4a75b> \u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0447\u0435\u0440\u0435\u0437 \u0431\u043E\u0442\u0430 </button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(ssrRenderComponent(_component_AuthChannelModal, {
          modelValue: showAuthModal.value,
          "onUpdate:modelValue": ($event) => showAuthModal.value = $event,
          title: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u043E\u0442\u0430",
          description: "\u041E\u0442\u043A\u0440\u043E\u0435\u0442\u0441\u044F \u0447\u0430\u0442 \u0441 \u0431\u043E\u0442\u043E\u043C \u2014 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u0435 \u0442\u0430\u043C, \u0437\u0430\u0442\u0435\u043C \u0432\u0435\u0440\u043D\u0438\u0442\u0435\u0441\u044C \u043D\u0430 \u0441\u0430\u0439\u0442 \u043F\u0440\u0438 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u0438.",
          channels: profileAuthChannels.value,
          intent: "profile",
          variant: "light",
          "consent-href": unref(consentPath),
          onSubmit: onProfileAuthChannelSubmit
        }, null, _parent));
        _push2(`</div>`);
      }, "body", false, _parent);
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const profile = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e2c4a75b"]]);

export { profile as default };
