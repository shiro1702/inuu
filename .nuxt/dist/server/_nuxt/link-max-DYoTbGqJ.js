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
  __name: "link-max",
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
    const maxBotUrl = computed(() => {
      const raw = config.public.maxBotUrl || "";
      return raw.trim();
    });
    const maxStartLink = computed(() => {
      if (!token.value || !maxBotUrl.value) return "";
      const hasQuery = maxBotUrl.value.includes("?");
      return `${maxBotUrl.value}${hasQuery ? "&" : "?"}start=${encodeURIComponent(`link_${token.value}`)}`;
    });
    const manualAuthText = computed(() => token.value ? `link_${token.value}` : "");
    const copyStatus = ref("");
    const isLoading = ref(false);
    const isSuccess = ref(false);
    const errorMessage = ref(null);
    const statusLine = ref(null);
    computed(() => {
      const raw = config.public.defaultCitySlug;
      return raw?.trim() || "ulan-ude";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "link-max-page" }, _attrs))} data-v-3c0c78e8><h1 data-v-3c0c78e8>Вход в INUU через MAX</h1>`);
      if (!token.value) {
        _push(`<p data-v-3c0c78e8>Некорректная ссылка: отсутствует токен.</p>`);
      } else {
        _push(`<div data-v-3c0c78e8>`);
        if (statusLine.value) {
          _push(`<p class="status" data-v-3c0c78e8>${ssrInterpolate(statusLine.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (maxStartLink.value) {
          _push(`<button type="button" class="btn btn-secondary"${ssrIncludeBooleanAttr(isSuccess.value) ? " disabled" : ""} data-v-3c0c78e8> Открыть MAX и подтвердить вход </button>`);
        } else {
          _push(`<!---->`);
        }
        if (manualAuthText.value) {
          _push(`<div class="manual-box" data-v-3c0c78e8><p class="manual-title" data-v-3c0c78e8>Если вход не завершился автоматически</p><p class="manual-help" data-v-3c0c78e8> Откройте чат с ботом MAX и отправьте сообщение ниже: </p><div class="manual-code" data-v-3c0c78e8>${ssrInterpolate(manualAuthText.value)}</div><button type="button" class="btn btn-secondary" data-v-3c0c78e8>${ssrInterpolate(copyStatus.value || "Скопировать сообщение")}</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="button" class="btn btn-primary"${ssrIncludeBooleanAttr(isLoading.value || isSuccess.value || !token.value) ? " disabled" : ""} data-v-3c0c78e8>`);
        if (isLoading.value) {
          _push(`<span data-v-3c0c78e8>Завершение входа…</span>`);
        } else if (isSuccess.value) {
          _push(`<span data-v-3c0c78e8>Готово</span>`);
        } else {
          _push(`<span data-v-3c0c78e8>Повторить попытку</span>`);
        }
        _push(`</button>`);
        if (errorMessage.value) {
          _push(`<p class="error" data-v-3c0c78e8>${ssrInterpolate(errorMessage.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (isSuccess.value) {
          _push(`<p class="success" data-v-3c0c78e8>Вход выполнен. Перенаправляем…</p>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/link-max.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const linkMax = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3c0c78e8"]]);
export {
  linkMax as default
};
