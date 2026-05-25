import { defineComponent, ref, computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { i as useRoute, j as useRouter, m as useSupabaseClient, c as _export_sfc } from "../server.mjs";
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "login-page" }, _attrs))} data-v-2ae3df94><h1 data-v-2ae3df94>Вход на сайт</h1><p class="subtitle" data-v-2ae3df94> Войдите в INUU, чтобы сохранять избранное и записи. </p><form class="form" data-v-2ae3df94><label class="field" data-v-2ae3df94><span data-v-2ae3df94>Email</span><input${ssrRenderAttr("value", email.value)} type="email" required autocomplete="email" data-v-2ae3df94></label><label class="field" data-v-2ae3df94><span data-v-2ae3df94>Пароль</span><input${ssrRenderAttr("value", password.value)} type="password" required autocomplete="current-password" data-v-2ae3df94></label>`);
      if (errorMessage.value) {
        _push(`<p class="error" data-v-2ae3df94>${ssrInterpolate(errorMessage.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit" class="btn-primary"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-2ae3df94>`);
      if (isLoading.value) {
        _push(`<span data-v-2ae3df94>Вход...</span>`);
      } else {
        _push(`<span data-v-2ae3df94>Войти</span>`);
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
export {
  login as default
};
