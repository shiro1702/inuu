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
      return (raw == null ? void 0 : raw.trim()) || "ulan-ude";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "link-max-page" }, _attrs))} data-v-3c0c78e8><h1 data-v-3c0c78e8>\u0412\u0445\u043E\u0434 \u0432 INUU \u0447\u0435\u0440\u0435\u0437 MAX</h1>`);
      if (!token.value) {
        _push(`<p data-v-3c0c78e8>\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u0430\u044F \u0441\u0441\u044B\u043B\u043A\u0430: \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0442\u043E\u043A\u0435\u043D.</p>`);
      } else {
        _push(`<div data-v-3c0c78e8>`);
        if (statusLine.value) {
          _push(`<p class="status" data-v-3c0c78e8>${ssrInterpolate(statusLine.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (maxStartLink.value) {
          _push(`<button type="button" class="btn btn-secondary"${ssrIncludeBooleanAttr(isSuccess.value) ? " disabled" : ""} data-v-3c0c78e8> \u041E\u0442\u043A\u0440\u044B\u0442\u044C MAX \u0438 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u0432\u0445\u043E\u0434 </button>`);
        } else {
          _push(`<!---->`);
        }
        if (manualAuthText.value) {
          _push(`<div class="manual-box" data-v-3c0c78e8><p class="manual-title" data-v-3c0c78e8>\u0415\u0441\u043B\u0438 \u0432\u0445\u043E\u0434 \u043D\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u043B\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438</p><p class="manual-help" data-v-3c0c78e8> \u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0447\u0430\u0442 \u0441 \u0431\u043E\u0442\u043E\u043C MAX \u0438 \u043E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043D\u0438\u0436\u0435: </p><div class="manual-code" data-v-3c0c78e8>${ssrInterpolate(manualAuthText.value)}</div><button type="button" class="btn btn-secondary" data-v-3c0c78e8>${ssrInterpolate(copyStatus.value || "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435")}</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="button" class="btn btn-primary"${ssrIncludeBooleanAttr(isLoading.value || isSuccess.value || !token.value) ? " disabled" : ""} data-v-3c0c78e8>`);
        if (isLoading.value) {
          _push(`<span data-v-3c0c78e8>\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0435 \u0432\u0445\u043E\u0434\u0430\u2026</span>`);
        } else if (isSuccess.value) {
          _push(`<span data-v-3c0c78e8>\u0413\u043E\u0442\u043E\u0432\u043E</span>`);
        } else {
          _push(`<span data-v-3c0c78e8>\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u043F\u043E\u043F\u044B\u0442\u043A\u0443</span>`);
        }
        _push(`</button>`);
        if (errorMessage.value) {
          _push(`<p class="error" data-v-3c0c78e8>${ssrInterpolate(errorMessage.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (isSuccess.value) {
          _push(`<p class="success" data-v-3c0c78e8>\u0412\u0445\u043E\u0434 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D. \u041F\u0435\u0440\u0435\u043D\u0430\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u043C\u2026</p>`);
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

export { linkMax as default };
