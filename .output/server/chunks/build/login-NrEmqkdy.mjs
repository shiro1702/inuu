import { defineComponent, ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { c as _export_sfc, i as useRoute, j as useRouter, m as useSupabaseClient } from './server.mjs';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    useSupabaseClient();
    const email = ref("");
    const password = ref("");
    const isLoading = ref(false);
    const errorMessage = ref(null);
    computed(() => {
      const r = route.query.redirect;
      if (typeof r === "string" && r.startsWith("/")) return r;
      return "";
    });
    computed(() => {
      const t = route.query.token;
      return typeof t === "string" ? t : void 0;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "login-page" }, _attrs))} data-v-2ae3df94><h1 data-v-2ae3df94>\u0412\u0445\u043E\u0434 \u043D\u0430 \u0441\u0430\u0439\u0442</h1><p class="subtitle" data-v-2ae3df94> \u0412\u043E\u0439\u0434\u0438\u0442\u0435 \u0432 INUU, \u0447\u0442\u043E\u0431\u044B \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0442\u044C \u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435 \u0438 \u0437\u0430\u043F\u0438\u0441\u0438. </p><form class="form" data-v-2ae3df94><label class="field" data-v-2ae3df94><span data-v-2ae3df94>Email</span><input${ssrRenderAttr("value", email.value)} type="email" required autocomplete="email" data-v-2ae3df94></label><label class="field" data-v-2ae3df94><span data-v-2ae3df94>\u041F\u0430\u0440\u043E\u043B\u044C</span><input${ssrRenderAttr("value", password.value)} type="password" required autocomplete="current-password" data-v-2ae3df94></label>`);
      if (errorMessage.value) {
        _push(`<p class="error" data-v-2ae3df94>${ssrInterpolate(errorMessage.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit" class="btn-primary"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-2ae3df94>`);
      if (isLoading.value) {
        _push(`<span data-v-2ae3df94>\u0412\u0445\u043E\u0434...</span>`);
      } else {
        _push(`<span data-v-2ae3df94>\u0412\u043E\u0439\u0442\u0438</span>`);
      }
      _push(`</button></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2ae3df94"]]);

export { login as default };
