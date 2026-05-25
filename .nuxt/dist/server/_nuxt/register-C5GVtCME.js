import { i as useRoute, j as useRouter, m as useSupabaseClient, _ as __nuxt_component_0, c as _export_sfc } from "../server.mjs";
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderComponent } from "vue/server-renderer";
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
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "auth-page" }, _attrs))} data-v-84b862dc><h1 data-v-84b862dc>Регистрация</h1><p class="subtitle" data-v-84b862dc> Создайте аккаунт для входа в личный кабинет и оформления заказов на сайте. </p>`);
      if (successMessage.value) {
        _push(`<p class="success" data-v-84b862dc>${ssrInterpolate(successMessage.value)}</p>`);
      } else {
        _push(`<form class="form" data-v-84b862dc><label class="field" data-v-84b862dc><span data-v-84b862dc>Email</span><input${ssrRenderAttr("value", email.value)} type="email" required autocomplete="email" data-v-84b862dc></label><label class="field" data-v-84b862dc><span data-v-84b862dc>Пароль</span><input${ssrRenderAttr("value", password.value)} type="password" required minlength="6" autocomplete="new-password" data-v-84b862dc></label><label class="field" data-v-84b862dc><span data-v-84b862dc>Повторите пароль</span><input${ssrRenderAttr("value", passwordConfirm.value)} type="password" required minlength="6" autocomplete="new-password" data-v-84b862dc></label>`);
        if (errorMessage.value) {
          _push(`<p class="error" data-v-84b862dc>${ssrInterpolate(errorMessage.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit" class="btn-primary"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-84b862dc>`);
        if (isLoading.value) {
          _push(`<span data-v-84b862dc>Регистрация…</span>`);
        } else {
          _push(`<span data-v-84b862dc>Зарегистрироваться</span>`);
        }
        _push(`</button></form>`);
      }
      _push(`<p class="footer-link" data-v-84b862dc>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: { path: "/login", query: unref(route).query }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Уже есть аккаунт? Войти`);
          } else {
            return [
              createTextVNode("Уже есть аккаунт? Войти")
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
export {
  register as default
};
