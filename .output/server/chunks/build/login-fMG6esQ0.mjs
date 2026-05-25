import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
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
      const value = route.query.redirect;
      if (typeof value === "string" && value.startsWith("/dashboard")) return value;
      return "/dashboard";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "auth-page" }, _attrs))} data-v-0d5a774f><h1 data-v-0d5a774f>\u0412\u0445\u043E\u0434 \u0432 \u0434\u0430\u0448\u0431\u043E\u0440\u0434</h1><p class="subtitle" data-v-0d5a774f> \u0412\u043E\u0439\u0434\u0438\u0442\u0435 \u0432 \u0430\u043A\u043A\u0430\u0443\u043D\u0442, \u0447\u0442\u043E\u0431\u044B \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u043A\u0430\u0431\u0438\u043D\u0435\u0442 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u043E\u043C. </p><form class="form" data-v-0d5a774f><label class="field" data-v-0d5a774f><span data-v-0d5a774f>Email</span><input${ssrRenderAttr("value", unref(email))} type="email" required autocomplete="email" data-v-0d5a774f></label><label class="field" data-v-0d5a774f><span data-v-0d5a774f>\u041F\u0430\u0440\u043E\u043B\u044C</span><input${ssrRenderAttr("value", unref(password))} type="password" required autocomplete="current-password" data-v-0d5a774f></label>`);
      if (unref(errorMessage)) {
        _push(`<p class="error" data-v-0d5a774f>${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit" class="btn-primary"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} data-v-0d5a774f>`);
      if (unref(isLoading)) {
        _push(`<span data-v-0d5a774f>\u0412\u0445\u043E\u0434...</span>`);
      } else {
        _push(`<span data-v-0d5a774f>\u0412\u043E\u0439\u0442\u0438</span>`);
      }
      _push(`</button></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0d5a774f"]]);

export { login as default };
