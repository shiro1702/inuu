import { c as _export_sfc, i as useRoute, j as useRouter, m as useSupabaseClient, _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    useSupabaseClient();
    const email = ref("");
    const password = ref("");
    const passwordConfirm = ref("");
    const isLoading = ref(false);
    const errorMessage = ref(null);
    const successMessage = ref(null);
    computed(() => {
      const r = route.query.redirect;
      if (typeof r === "string" && r.startsWith("/")) return r;
      return "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "auth-page" }, _attrs))} data-v-84b862dc><h1 data-v-84b862dc>\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F</h1><p class="subtitle" data-v-84b862dc> \u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 \u0434\u043B\u044F \u0432\u0445\u043E\u0434\u0430 \u0432 \u043B\u0438\u0447\u043D\u044B\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442 \u0438 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u044F \u0437\u0430\u043A\u0430\u0437\u043E\u0432 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435. </p>`);
      if (successMessage.value) {
        _push(`<p class="success" data-v-84b862dc>${ssrInterpolate(successMessage.value)}</p>`);
      } else {
        _push(`<form class="form" data-v-84b862dc><label class="field" data-v-84b862dc><span data-v-84b862dc>Email</span><input${ssrRenderAttr("value", email.value)} type="email" required autocomplete="email" data-v-84b862dc></label><label class="field" data-v-84b862dc><span data-v-84b862dc>\u041F\u0430\u0440\u043E\u043B\u044C</span><input${ssrRenderAttr("value", password.value)} type="password" required minlength="6" autocomplete="new-password" data-v-84b862dc></label><label class="field" data-v-84b862dc><span data-v-84b862dc>\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C</span><input${ssrRenderAttr("value", passwordConfirm.value)} type="password" required minlength="6" autocomplete="new-password" data-v-84b862dc></label>`);
        if (errorMessage.value) {
          _push(`<p class="error" data-v-84b862dc>${ssrInterpolate(errorMessage.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit" class="btn-primary"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-84b862dc>`);
        if (isLoading.value) {
          _push(`<span data-v-84b862dc>\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F\u2026</span>`);
        } else {
          _push(`<span data-v-84b862dc>\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F</span>`);
        }
        _push(`</button></form>`);
      }
      _push(`<p class="footer-link" data-v-84b862dc>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: { path: "/login", query: unref(route).query }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u0423\u0436\u0435 \u0435\u0441\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442? \u0412\u043E\u0439\u0442\u0438`);
          } else {
            return [
              createTextVNode("\u0423\u0436\u0435 \u0435\u0441\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442? \u0412\u043E\u0439\u0442\u0438")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const register = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-84b862dc"]]);

export { register as default };
