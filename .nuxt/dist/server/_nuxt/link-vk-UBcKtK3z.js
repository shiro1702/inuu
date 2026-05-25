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
  __name: "link-vk",
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
    computed(() => {
      const e = route.query.error;
      return typeof e === "string" && e.trim() ? decodeURIComponent(e) : "";
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "link-vk-page" }, _attrs))} data-v-cfefb714><h1 data-v-cfefb714>Вход через VK</h1>`);
      if (!token.value) {
        _push(`<p data-v-cfefb714>Некорректная ссылка: отсутствует токен.</p>`);
      } else {
        _push(`<div data-v-cfefb714>`);
        if (statusLine.value) {
          _push(`<p class="status" data-v-cfefb714>${ssrInterpolate(statusLine.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="button" class="btn btn-primary"${ssrIncludeBooleanAttr(isLoading.value || isSuccess.value || !token.value) ? " disabled" : ""} data-v-cfefb714>`);
        if (isLoading.value) {
          _push(`<span data-v-cfefb714>Завершение входа…</span>`);
        } else if (isSuccess.value) {
          _push(`<span data-v-cfefb714>Готово</span>`);
        } else {
          _push(`<span data-v-cfefb714>Повторить попытку</span>`);
        }
        _push(`</button>`);
        if (errorMessage.value) {
          _push(`<p class="error" data-v-cfefb714>${ssrInterpolate(errorMessage.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (isSuccess.value) {
          _push(`<p class="success" data-v-cfefb714>Вход выполнен. Перенаправляем…</p>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/link-vk.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const linkVk = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cfefb714"]]);
export {
  linkVk as default
};
