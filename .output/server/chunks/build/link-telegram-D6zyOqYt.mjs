import { defineComponent, computed, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { c as _export_sfc, i as useRoute, j as useRouter, m as useSupabaseClient, k as useRuntimeConfig } from './server.mjs';
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
      return (raw == null ? void 0 : raw.trim()) || "ulan-ude";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "link-telegram-page" }, _attrs))} data-v-96c83b43><h1 data-v-96c83b43>\u0412\u0445\u043E\u0434 \u0432 INUU \u0447\u0435\u0440\u0435\u0437 Telegram</h1>`);
      if (!token.value) {
        _push(`<p data-v-96c83b43>\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u0430\u044F \u0441\u0441\u044B\u043B\u043A\u0430: \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0442\u043E\u043A\u0435\u043D.</p>`);
      } else {
        _push(`<div data-v-96c83b43>`);
        if (statusLine.value) {
          _push(`<p class="status" data-v-96c83b43>${ssrInterpolate(statusLine.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (telegramStartLink.value) {
          _push(`<button type="button" class="btn btn-secondary"${ssrIncludeBooleanAttr(isSuccess.value) ? " disabled" : ""} data-v-96c83b43> \u041E\u0442\u043A\u0440\u044B\u0442\u044C Telegram \u0438 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u0432\u0445\u043E\u0434 </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="button" class="btn btn-primary"${ssrIncludeBooleanAttr(isLoading.value || isSuccess.value || !token.value) ? " disabled" : ""} data-v-96c83b43>`);
        if (isLoading.value) {
          _push(`<span data-v-96c83b43>\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0435 \u0432\u0445\u043E\u0434\u0430\u2026</span>`);
        } else if (isSuccess.value) {
          _push(`<span data-v-96c83b43>\u0413\u043E\u0442\u043E\u0432\u043E</span>`);
        } else {
          _push(`<span data-v-96c83b43>\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u043F\u043E\u043F\u044B\u0442\u043A\u0443</span>`);
        }
        _push(`</button>`);
        if (errorMessage.value) {
          _push(`<p class="error" data-v-96c83b43>${ssrInterpolate(errorMessage.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (isSuccess.value) {
          _push(`<p class="success" data-v-96c83b43>\u0412\u0445\u043E\u0434 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D. \u041F\u0435\u0440\u0435\u043D\u0430\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u043C\u2026</p>`);
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

export { linkTelegram as default };
