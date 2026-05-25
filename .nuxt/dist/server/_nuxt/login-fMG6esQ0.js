import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from "vue";
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
      const value = route.query.redirect;
      if (typeof value === "string" && value.startsWith("/dashboard")) return value;
      return "/dashboard";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "auth-page" }, _attrs))} data-v-0d5a774f><h1 data-v-0d5a774f>Вход в дашборд</h1><p class="subtitle" data-v-0d5a774f> Войдите в аккаунт, чтобы открыть кабинет управления магазином. </p><form class="form" data-v-0d5a774f><label class="field" data-v-0d5a774f><span data-v-0d5a774f>Email</span><input${ssrRenderAttr("value", unref(email))} type="email" required autocomplete="email" data-v-0d5a774f></label><label class="field" data-v-0d5a774f><span data-v-0d5a774f>Пароль</span><input${ssrRenderAttr("value", unref(password))} type="password" required autocomplete="current-password" data-v-0d5a774f></label>`);
      if (unref(errorMessage)) {
        _push(`<p class="error" data-v-0d5a774f>${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit" class="btn-primary"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} data-v-0d5a774f>`);
      if (unref(isLoading)) {
        _push(`<span data-v-0d5a774f>Вход...</span>`);
      } else {
        _push(`<span data-v-0d5a774f>Войти</span>`);
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
export {
  login as default
};
