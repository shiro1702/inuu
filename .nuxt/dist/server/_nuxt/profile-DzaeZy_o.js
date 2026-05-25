import { p as useTelegram, o as useSupabaseUser, m as useSupabaseClient, q as useTenant, u as useLegalPaths, _ as __nuxt_component_0, b as __nuxt_component_1, k as useRuntimeConfig, c as _export_sfc } from "../server.mjs";
import { defineComponent, computed, ref, reactive, watch, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderComponent, ssrRenderTeleport, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useRoute } from "vue-router";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unctx/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/h3/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/defu/dist/defu.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ufo/dist/index.mjs";
import "@supabase/ssr";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/klona/dist/index.mjs";
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
    const tg = (void 0).Telegram?.WebApp;
    if (isTelegram.value && tg?.CloudStorage) {
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
    if (isMaxMiniApp.value && (void 0).WebApp?.DeviceStorage) {
      try {
        await (void 0).WebApp.DeviceStorage.setItem(key, value);
      } catch (err) {
        console.warn("[messengerStorage] DeviceStorage.setItem failed", err);
      }
    }
  }
  async function getItem(key) {
    const tg = (void 0).Telegram?.WebApp;
    if (isTelegram.value && tg?.CloudStorage) {
      return new Promise((resolve) => {
        tg.CloudStorage.getItem(key, (_err, v) => {
          resolve(v ?? null);
        });
      });
    }
    if (isMaxMiniApp.value && (void 0).WebApp?.DeviceStorage) {
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
      const raw = config.public?.defaultCitySlug;
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
      const raw = user.value?.sub;
      return typeof raw === "string" ? raw : null;
    });
    const telegramId = computed(() => {
      const raw = user.value?.user_metadata?.telegram_id;
      return typeof raw === "number" ? raw : null;
    });
    const maxUserId = computed(() => {
      const raw = user.value?.user_metadata?.max_user_id;
      if (typeof raw === "string") {
        const trimmed = raw.trim();
        return trimmed || null;
      }
      if (typeof raw === "number") return String(raw);
      return null;
    });
    const authMetadata = computed(() => user.value?.user_metadata ?? {});
    const messengerUser = computed(() => {
      const raw = messengerWebApp.value?.initDataUnsafe?.user;
      return raw && typeof raw === "object" ? raw : null;
    });
    const resolvedEmail = computed(() => {
      const raw = user.value?.email;
      return typeof raw === "string" && raw.trim() ? raw.trim() : null;
    });
    const resolvedProfileName = computed(() => {
      const candidates = [
        profileForm.name,
        authMetadata.value.full_name,
        authMetadata.value.name,
        authMetadata.value.first_name,
        [messengerUser.value?.first_name, messengerUser.value?.last_name].filter(Boolean).join(" "),
        messengerUser.value?.username ? `@${messengerUser.value.username}` : ""
      ];
      for (const item of candidates) {
        if (typeof item === "string" && item.trim()) return item.trim();
      }
      return "";
    });
    const telegramDisplay = computed(() => {
      if (telegramId.value !== null) return `Привязан, ID ${telegramId.value}`;
      if (isTelegram.value && messengerUser.value?.id) {
        const username = typeof messengerUser.value.username === "string" && messengerUser.value.username.trim() ? ` (@${messengerUser.value.username.trim()})` : "";
        return `Mini App user ID ${messengerUser.value.id}${username}`;
      }
      return "Не подключён";
    });
    const maxDisplay = computed(() => {
      if (maxUserId.value) return `Привязан, ID ${maxUserId.value}`;
      if (isMaxMiniApp.value && messengerUser.value?.id) {
        return `Mini App user ID ${messengerUser.value.id}`;
      }
      return "Не подключён";
    });
    const messengerDebugLabel = computed(() => {
      if (isTelegram.value) return "Telegram Mini App";
      if (isMaxMiniApp.value) return "MAX Mini App";
      if (user.value) return "Аккаунт сайта";
      return "";
    });
    const hasAnyProfileData = computed(() => {
      return Boolean(
        resolvedProfileName.value || profileForm.phone.trim() || resolvedEmail.value || telegramId.value !== null || maxUserId.value || messengerUser.value?.id
      );
    });
    function hydrateProfileFormFromKnownSources() {
      if (!profileForm.name.trim()) {
        const fallbackName = [
          authMetadata.value.full_name,
          authMetadata.value.name,
          [messengerUser.value?.first_name, messengerUser.value?.last_name].filter(Boolean).join(" ")
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
      const _component_NuxtLink = __nuxt_component_0;
      const _component_AuthChannelModal = __nuxt_component_1;
      _push(`<!--[--><div class="profile-page" data-v-e2c4a75b><h1 data-v-e2c4a75b>Профиль</h1><div class="card" data-v-e2c4a75b><div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between" data-v-e2c4a75b><div data-v-e2c4a75b><h2 data-v-e2c4a75b>Данные пользователя</h2><p class="hint" data-v-e2c4a75b> В mini app показываем всё, что уже знаем о пользователе из мессенджера, аккаунта и сохранённой анкеты. </p></div>`);
      if (unref(isMessengerMiniApp)) {
        _push(`<span class="badge badge-messenger" data-v-e2c4a75b> Mini App </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><dl class="info mt-4" data-v-e2c4a75b><div data-v-e2c4a75b><dt data-v-e2c4a75b>Имя</dt><dd data-v-e2c4a75b>${ssrInterpolate(resolvedProfileName.value || "Пока не указано")}</dd></div><div data-v-e2c4a75b><dt data-v-e2c4a75b>Телефон</dt><dd data-v-e2c4a75b>${ssrInterpolate(profileForm.phone || "Пока не указан")}</dd></div><div data-v-e2c4a75b><dt data-v-e2c4a75b>Email</dt><dd data-v-e2c4a75b>${ssrInterpolate(resolvedEmail.value || "Пока не указан")}</dd></div><div data-v-e2c4a75b><dt data-v-e2c4a75b>Telegram</dt><dd data-v-e2c4a75b>${ssrInterpolate(telegramDisplay.value)}</dd></div><div data-v-e2c4a75b><dt data-v-e2c4a75b>MAX</dt><dd data-v-e2c4a75b>${ssrInterpolate(maxDisplay.value)}</dd></div>`);
      if (messengerDebugLabel.value) {
        _push(`<div data-v-e2c4a75b><dt data-v-e2c4a75b>Источник</dt><dd data-v-e2c4a75b>${ssrInterpolate(messengerDebugLabel.value)}</dd></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</dl>`);
      if (!hasAnyProfileData.value) {
        _push(`<div class="empty-state" data-v-e2c4a75b><p class="font-medium text-gray-900" data-v-e2c4a75b> Пока о пользователе нет данных. </p><p class="hint" data-v-e2c4a75b> Нажмите «Редактировать данные», чтобы заполнить анкету, или привяжите аккаунт через бота. </p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-4 flex flex-col gap-2" data-v-e2c4a75b><button type="button" class="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white sm:w-auto sm:self-start" data-v-e2c4a75b> Редактировать данные </button><div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap" data-v-e2c4a75b>`);
      if (telegramBotUrl.value) {
        _push(`<button type="button" class="rounded-lg border border-primary bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5" data-v-e2c4a75b>${ssrInterpolate(unref(isMessengerMiniApp) ? "Запросить данные через Telegram" : telegramId.value !== null ? "Перепривязать Telegram" : "Войти через Telegram")}</button>`);
      } else {
        _push(`<!---->`);
      }
      if (maxBotUrl.value) {
        _push(`<button type="button" class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" data-v-e2c4a75b>${ssrInterpolate(unref(isMessengerMiniApp) ? "Запросить данные через MAX" : maxUserId.value ? "Перепривязать MAX" : "Войти через MAX")}</button>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isMessengerMiniApp) && !unref(user)) {
        _push(`<button type="button" class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" data-v-e2c4a75b> Выбрать способ входа </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      if (unref(user)) {
        _push(`<div class="card" data-v-e2c4a75b><h2 data-v-e2c4a75b>Мои записи</h2><p class="hint" data-v-e2c4a75b> История записей и билетов появится в следующем обновлении INUU. Пока сохраняйте избранное и подписки через Telegram / MAX. </p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/${defaultCitySlug.value}`,
          class: "mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` На главную города `);
            } else {
              return [
                createTextVNode(" На главную города ")
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
          _push2(`<div class="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto p-4 py-10" data-v-e2c4a75b><div class="absolute inset-0 bg-black/40" data-v-e2c4a75b></div><div role="dialog" aria-modal="true" aria-labelledby="profile-sheet-title" class="relative z-[1] my-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl" data-v-e2c4a75b><div class="flex items-start justify-between gap-3" data-v-e2c4a75b><div data-v-e2c4a75b><h3 id="profile-sheet-title" class="text-base font-semibold text-gray-900" data-v-e2c4a75b> Анкета для заказа </h3><p class="mt-1 hint" data-v-e2c4a75b> Эти данные можно заранее заполнить в mini app, чтобы оформление заказа было быстрее. </p></div><button type="button" class="shrink-0 rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-800" aria-label="Закрыть" data-v-e2c4a75b> ✕ </button></div>`);
          if (saveStatus.value) {
            _push2(`<span class="mt-2 block text-xs text-gray-500" data-v-e2c4a75b>${ssrInterpolate(saveStatus.value)}</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="mt-4 grid gap-3" data-v-e2c4a75b><label class="field" data-v-e2c4a75b><span data-v-e2c4a75b>Имя</span><input${ssrRenderAttr("value", profileForm.name)} type="text" placeholder="Как к вам обращаться" data-v-e2c4a75b></label><label class="field" data-v-e2c4a75b><span data-v-e2c4a75b>Телефон</span><input${ssrRenderAttr("value", profileForm.phone)} type="tel" placeholder="+7 900 000-00-00" data-v-e2c4a75b></label><label class="field" data-v-e2c4a75b><span data-v-e2c4a75b>Комментарий</span><textarea rows="3" placeholder="Например: домофон, этаж, удобный способ связи" data-v-e2c4a75b>${ssrInterpolate(profileForm.notes)}</textarea></label></div><div class="mt-5 flex flex-col gap-2 sm:flex-row" data-v-e2c4a75b><button type="button" class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"${ssrIncludeBooleanAttr(isSaving.value) ? " disabled" : ""} data-v-e2c4a75b>${ssrInterpolate(isSaving.value ? "Сохраняем..." : "Сохранить данные")}</button>`);
          if (telegramBotUrl.value || maxBotUrl.value || vkAuthEnabled.value) {
            _push2(`<button type="button" class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" data-v-e2c4a75b> Заполнить через бота </button>`);
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
          title: "Выберите бота",
          description: "Откроется чат с ботом — продолжите там, затем вернитесь на сайт при необходимости.",
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
export {
  profile as default
};
