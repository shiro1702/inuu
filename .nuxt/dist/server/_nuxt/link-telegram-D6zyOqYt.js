import { defineComponent, computed, ref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { i as useRoute, j as useRouter, m as useSupabaseClient, k as useRuntimeConfig, c as _export_sfc } from "../server.mjs";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "link-telegram",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    useSupabaseClient();
    const config = useRuntimeConfig();
    const token = computed(() => {
      const t = route.query.token;
      return typeof t === "string" ? t : void 0;
    });
    computed(() => {
      const r = route.query.redirect;
      return typeof r === "string" ? r : void 0;
    });
    computed(() => {
      const s = route.query.shop_id;
      return typeof s === "string" && s.trim() ? s.trim() : void 0;
    });
    const telegramBotName = computed(() => {
      const raw = config.public.telegramBotName || "";
      return raw.trim().replace(/^@/, "");
    });
    const telegramStartLink = computed(() => {
      if (!token.value || !telegramBotName.value) return "";
      return `https://t.me/${telegramBotName.value}?start=${encodeURIComponent(`link_${token.value}`)}`;
    });
    const isLoading = ref(false);
    const isSuccess = ref(false);
    const errorMessage = ref(null);
    const statusLine = ref(null);
    computed(() => {
      const raw = config.public.defaultCitySlug;
      return raw?.trim() || "ulan-ude";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "link-telegram-page" }, _attrs))} data-v-96c83b43><h1 data-v-96c83b43>Вход в INUU через Telegram</h1>`);
      if (!token.value) {
        _push(`<p data-v-96c83b43>Некорректная ссылка: отсутствует токен.</p>`);
      } else {
        _push(`<div data-v-96c83b43>`);
        if (statusLine.value) {
          _push(`<p class="status" data-v-96c83b43>${ssrInterpolate(statusLine.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (telegramStartLink.value) {
          _push(`<button type="button" class="btn btn-secondary"${ssrIncludeBooleanAttr(isSuccess.value) ? " disabled" : ""} data-v-96c83b43> Открыть Telegram и подтвердить вход </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="button" class="btn btn-primary"${ssrIncludeBooleanAttr(isLoading.value || isSuccess.value || !token.value) ? " disabled" : ""} data-v-96c83b43>`);
        if (isLoading.value) {
          _push(`<span data-v-96c83b43>Завершение входа…</span>`);
        } else if (isSuccess.value) {
          _push(`<span data-v-96c83b43>Готово</span>`);
        } else {
          _push(`<span data-v-96c83b43>Повторить попытку</span>`);
        }
        _push(`</button>`);
        if (errorMessage.value) {
          _push(`<p class="error" data-v-96c83b43>${ssrInterpolate(errorMessage.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (isSuccess.value) {
          _push(`<p class="success" data-v-96c83b43>Вход выполнен. Перенаправляем…</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/link-telegram.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const linkTelegram = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-96c83b43"]]);
export {
  linkTelegram as default
};
