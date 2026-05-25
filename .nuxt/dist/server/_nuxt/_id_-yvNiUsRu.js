import { _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, computed, ref, watch, mergeProps, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { useRoute } from "vue-router";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unctx/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/h3/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/defu/dist/defu.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ufo/dist/index.mjs";
import "@supabase/ssr";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/klona/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    computed(() => route.params.id);
    const pending = ref(true);
    const loadError = ref("");
    const saving = ref(false);
    const targetingJson = ref("{}");
    const targetingError = ref("");
    const form = ref({
      title: "",
      previewUrl: "",
      placement: "top_bar",
      isActive: true,
      validFrom: "",
      validUntil: "",
      slides: []
    });
    const categoryNames = ref([]);
    const previewSlideIndex = ref(0);
    const categoriesLoaded = ref(false);
    const categoriesLoading = ref(false);
    const previewSlide = computed(() => {
      if (!form.value.slides.length) return null;
      const safeIndex = Math.min(previewSlideIndex.value, form.value.slides.length - 1);
      return form.value.slides[safeIndex] ?? null;
    });
    const previewActionLabel = computed(() => {
      const type = previewSlide.value?.actionType;
      if (type === "add_to_cart") return "В корзину";
      if (type === "open_category") return "К категории";
      if (type === "apply_promo") return "Применить промокод";
      return "Подробнее";
    });
    const previewIsImage = computed(() => isImageUrl(previewSlide.value?.mediaUrl || ""));
    const previewIsVideo = computed(() => isVideoUrl(previewSlide.value?.mediaUrl || ""));
    const previewCardImageUrl = computed(() => {
      if (form.value.previewUrl) return form.value.previewUrl;
      if (previewSlide.value && isImageUrl(previewSlide.value.mediaUrl)) return previewSlide.value.mediaUrl;
      return "";
    });
    const previewStoryTitle = computed(() => form.value.title?.trim() || "Название кампании");
    function isImageUrl(url) {
      return !!url && /\.(png|jpe?g|gif|webp|avif)(\?|$)/i.test(url);
    }
    function isVideoUrl(url) {
      return !!url && /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
    }
    async function loadCategories() {
      try {
        const res = await fetch("/api/dashboard/menu/categories");
        const data = await res.json();
        if (data.ok && Array.isArray(data.items)) {
          categoryNames.value = data.items.map((c) => c.name).filter(Boolean);
        }
      } catch {
        categoryNames.value = [];
      }
    }
    async function ensureCategoriesLoaded() {
      if (categoriesLoaded.value || categoriesLoading.value) return;
      categoriesLoading.value = true;
      try {
        await loadCategories();
        categoriesLoaded.value = true;
      } finally {
        categoriesLoading.value = false;
      }
    }
    watch(
      () => form.value.slides.length,
      (length) => {
        if (!length) {
          previewSlideIndex.value = 0;
          return;
        }
        if (previewSlideIndex.value > length - 1) {
          previewSlideIndex.value = length - 1;
        }
      }
    );
    watch(
      () => form.value.slides.some((slide) => slide.actionType === "open_category"),
      (hasOpenCategoryAction) => {
        if (hasOpenCategoryAction) {
          void ensureCategoriesLoaded();
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex flex-wrap items-center justify-between gap-3"><div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/stories",
        class: "text-sm text-primary hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`← К списку`);
          } else {
            return [
              createTextVNode("← К списку")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="mt-2 text-2xl font-semibold">Кампания сториз</h1></div><button type="button" class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "Сохранение…" : "Сохранить")}</button></div>`);
      if (pending.value) {
        _push(`<div class="text-sm text-gray-500">Загрузка…</div>`);
      } else if (loadError.value) {
        _push(`<div class="text-sm text-red-500">${ssrInterpolate(loadError.value)}</div>`);
      } else {
        _push(`<div class="space-y-6"><div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6"><h2 class="text-lg font-medium text-gray-900">Предпросмотр</h2><p class="mt-1 text-sm text-gray-500"> Как будет выглядеть кружок в ленте и экран сторис для гостя. </p><div class="mt-4 grid gap-4 lg:grid-cols-2"><div class="rounded-lg border border-gray-100 bg-gray-50 p-4"><p class="text-sm font-medium text-gray-800">${ssrInterpolate(form.value.placement === "catalog_grid" ? "Превью в сетке каталога" : "Превью в ленте сторис")}</p>`);
        if (form.value.placement === "top_bar") {
          _push(`<div class="relative mt-4 mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6"><button type="button" class="absolute left-1 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border bg-white/90 text-gray-700 shadow-sm backdrop-blur md:inline-flex" style="${ssrRenderStyle({ "border-color": "rgb(245, 194, 222)" })}" aria-label="Прокрутить сторисы влево"> ← </button><div class="flex gap-3 overflow-x-auto [scrollbar-width:none]"><button type="button" class="group relative h-[176px] w-[128px] shrink-0 overflow-hidden rounded-2xl border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:h-[240px] sm:w-[200px]" style="${ssrRenderStyle({ "border-color": "rgb(245, 194, 222)", "background-color": "rgb(20, 22, 43)" })}">`);
          if (previewCardImageUrl.value) {
            _push(`<img${ssrRenderAttr("src", previewCardImageUrl.value)}${ssrRenderAttr("alt", previewStoryTitle.value)} class="h-full w-full object-cover">`);
          } else {
            _push(`<div class="flex h-full w-full items-end bg-gradient-to-br from-gray-700 to-gray-900 px-3 pb-4 text-left sm:px-4 sm:pb-5"><p class="line-clamp-3 text-sm font-semibold leading-tight text-white sm:text-base">${ssrInterpolate(previewStoryTitle.value)}</p></div>`);
          }
          _push(`<div class="pointer-events-none absolute inset-0 rounded-2xl border-0 transition group-hover:border-2" style="${ssrRenderStyle({ "border-color": "rgb(220, 50, 146)" })}"></div></button></div><button type="button" class="absolute right-1 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border bg-white/90 text-gray-700 shadow-sm backdrop-blur md:inline-flex" style="${ssrRenderStyle({ "border-color": "rgb(245, 194, 222)" })}" aria-label="Прокрутить сторисы вправо"> → </button></div>`);
        } else {
          _push(`<ul class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"><!--[-->`);
          ssrRenderList(2, (i) => {
            _push(`<li class="flex"><article class="flex h-full w-full flex-col overflow-hidden rounded-xl border bg-[#14162b] shadow-sm"><div class="aspect-square w-full bg-gray-800"></div><div class="p-4"><div class="h-4 w-2/3 rounded bg-gray-600/60"></div><div class="mt-2 h-3 w-full rounded bg-gray-600/40"></div><div class="mt-3 h-9 w-full rounded-lg bg-pink-200/80"></div></div></article></li>`);
          });
          _push(`<!--]--><li class="flex"><article class="flex h-full min-h-[280px] w-full cursor-pointer flex-col overflow-hidden rounded-xl border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:min-h-[320px]" role="button" style="${ssrRenderStyle({ "border-color": "rgb(245, 194, 222)", "background-color": "rgb(20, 22, 43)" })}"><div class="relative flex min-h-0 flex-1 flex-col">`);
          if (previewCardImageUrl.value) {
            _push(`<img${ssrRenderAttr("src", previewCardImageUrl.value)}${ssrRenderAttr("alt", previewStoryTitle.value)} class="absolute inset-0 h-full w-full object-cover">`);
          } else {
            _push(`<div class="absolute inset-0 flex items-center justify-center px-4 text-center text-white" style="${ssrRenderStyle({ "background": "linear-gradient(145deg, #334155 0%, rgba(15,23,42,0.88) 85%)" })}"><span class="text-sm font-semibold">${ssrInterpolate(previewStoryTitle.value)}</span></div>`);
          }
          _push(`<div class="relative mt-auto bg-gradient-to-t from-black/70 to-transparent p-4 pt-16"><p class="text-sm font-semibold text-white drop-shadow">${ssrInterpolate(previewStoryTitle.value)}</p><p class="mt-1 text-xs text-white/90">Сториз</p></div></div></article></li><li class="flex"><article class="flex h-full w-full flex-col overflow-hidden rounded-xl border bg-[#14162b] shadow-sm"><div class="aspect-square w-full bg-gray-800"></div><div class="p-4"><div class="h-4 w-2/3 rounded bg-gray-600/60"></div><div class="mt-2 h-3 w-full rounded bg-gray-600/40"></div><div class="mt-3 h-9 w-full rounded-lg bg-pink-200/80"></div></div></article></li></ul>`);
        }
        _push(`</div><div class="rounded-lg border border-gray-100 bg-gray-50 p-4"><div class="flex items-center justify-between gap-2"><p class="text-sm font-medium text-gray-800">Сторис на витрине</p>`);
        if (form.value.slides.length > 1) {
          _push(`<div class="flex max-w-[55%] items-center gap-1 overflow-x-auto"><!--[-->`);
          ssrRenderList(form.value.slides, (_, idx) => {
            _push(`<button type="button" class="${ssrRenderClass([idx === previewSlideIndex.value ? "border-primary bg-primary/10 text-primary" : "border-gray-300 text-gray-600 hover:bg-white", "shrink-0 rounded-full border px-2 py-1 text-xs transition-colors"])}">${ssrInterpolate(idx + 1)}</button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="mt-4 rounded-2xl bg-black/75 p-3 sm:p-4"><div class="relative mx-auto h-full w-full max-w-[400px]"><button type="button" class="absolute -right-2 -top-2 z-20 rounded-full bg-black/55 p-2 text-white shadow-sm sm:-right-12 sm:top-0" aria-label="Закрыть"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button><div class="relative aspect-[9/16] w-full overflow-hidden rounded-3xl bg-black">`);
        if (previewSlide.value) {
          _push(`<!--[-->`);
          if (previewIsImage.value) {
            _push(`<img${ssrRenderAttr("src", previewSlide.value.mediaUrl)} alt="Story slide preview" class="h-full w-full object-cover">`);
          } else if (previewIsVideo.value) {
            _push(`<video${ssrRenderAttr("src", previewSlide.value.mediaUrl)} class="h-full w-full object-cover" muted loop autoplay playsinline></video>`);
          } else {
            _push(`<div class="flex h-full w-full items-end bg-gradient-to-br from-gray-700 to-gray-900 p-4 text-white"><div class="space-y-2"><p class="text-lg font-semibold">${ssrInterpolate(previewSlide.value.payloadTitle || form.value.title || "Сторис")}</p><p class="text-xs text-white/80">${ssrInterpolate(previewSlide.value.payloadText || "Здесь будет ваш текст слайда.")}</p></div></div>`);
          }
          _push(`<div class="absolute inset-x-3 top-3 flex gap-1"><!--[-->`);
          ssrRenderList(form.value.slides.length || 1, (_, idx) => {
            _push(`<div class="${ssrRenderClass([idx <= previewSlideIndex.value ? "bg-white" : "bg-white/35", "h-1 flex-1 rounded-full"])}"></div>`);
          });
          _push(`<!--]--></div>`);
          if (previewSlide.value.actionType !== "none") {
            _push(`<div class="absolute inset-x-3 bottom-3 rounded-xl bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900">${ssrInterpolate(previewActionLabel.value)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<div class="flex h-full items-center justify-center px-4 text-center text-sm text-white/75"> Добавьте хотя бы один слайд, чтобы увидеть предпросмотр сторис. </div>`);
        }
        _push(`</div></div></div></div></div></div><div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6"><h2 class="text-lg font-medium text-gray-900">Основное</h2><div class="mt-4 grid gap-4 sm:grid-cols-2"><label class="block text-sm"><span class="text-gray-700">Название (под кружочком)</span><input${ssrRenderAttr("value", form.value.title)} type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"></label><label class="block text-sm"><span class="text-gray-700">Размещение</span><select class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"><option value="top_bar"${ssrIncludeBooleanAttr(Array.isArray(form.value.placement) ? ssrLooseContain(form.value.placement, "top_bar") : ssrLooseEqual(form.value.placement, "top_bar")) ? " selected" : ""}>Верхняя полоса (кружочки)</option><option value="catalog_grid"${ssrIncludeBooleanAttr(Array.isArray(form.value.placement) ? ssrLooseContain(form.value.placement, "catalog_grid") : ssrLooseEqual(form.value.placement, "catalog_grid")) ? " selected" : ""}>Сетка каталога (баннер)</option></select></label><label class="flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(form.value.isActive) ? ssrLooseContain(form.value.isActive, null) : form.value.isActive) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"> Активна </label><label class="block text-sm"><span class="text-gray-700">Превью (картинка кружочка)</span><input type="file" accept="image/png,image/jpeg,image/webp" class="mt-1 text-sm">`);
        if (form.value.previewUrl) {
          _push(`<span class="mt-1 block text-xs text-gray-500 truncate">${ssrInterpolate(form.value.previewUrl)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label><label class="block text-sm"><span class="text-gray-700">С даты (UTC, опционально)</span><input${ssrRenderAttr("value", form.value.validFrom)} type="datetime-local" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"></label><label class="block text-sm"><span class="text-gray-700">По дату (UTC, опционально)</span><input${ssrRenderAttr("value", form.value.validUntil)} type="datetime-local" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"></label></div><div class="mt-4"><label class="block text-sm"><span class="text-gray-700">Таргетинг (JSON). Пустой <code class="text-xs">{}</code> — для всех гостей.</span><textarea rows="4" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs" placeholder="{&quot;genders&quot;:[&quot;female&quot;],&quot;birthday_within_days&quot;:7}">${ssrInterpolate(targetingJson.value)}</textarea></label>`);
        if (targetingError.value) {
          _push(`<p class="mt-1 text-xs text-red-600">${ssrInterpolate(targetingError.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6"><div class="flex items-center justify-between"><h2 class="text-lg font-medium text-gray-900">Слайды</h2><button type="button" class="text-sm text-primary hover:underline"> + Слайд </button></div><ul class="mt-4 space-y-4"><!--[-->`);
        ssrRenderList(form.value.slides, (slide, idx) => {
          _push(`<li class="rounded-lg border border-gray-100 p-4"><div class="flex flex-wrap items-start justify-between gap-2"><span class="text-sm font-medium text-gray-700">Слайд ${ssrInterpolate(idx + 1)}</span><button type="button" class="text-sm text-red-600 hover:underline"> Удалить </button></div><div class="mt-3 grid gap-3 sm:grid-cols-2"><label class="block text-sm"><span class="text-gray-700">Медиа</span><input type="file" accept="image/*,video/mp4,video/webm" class="mt-1 text-sm">`);
          if (slide.mediaUrl) {
            _push(`<span class="mt-1 block truncate text-xs text-gray-500">${ssrInterpolate(slide.mediaUrl)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</label><label class="block text-sm"><span class="text-gray-700">Заголовок fallback-слайда</span><input${ssrRenderAttr("value", slide.payloadTitle)} type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="Заголовок для режима без картинки"></label><label class="block text-sm sm:col-span-2"><span class="text-gray-700">Текст fallback-слайда</span><textarea rows="2" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="Короткий текст, который покажется на сторис без медиа">${ssrInterpolate(slide.payloadText)}</textarea></label><label class="block text-sm"><span class="text-gray-700">Длительность (сек)</span><input${ssrRenderAttr("value", slide.durationSeconds)} type="number" min="1" max="120" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"></label><label class="block text-sm sm:col-span-2"><span class="text-gray-700">Действие кнопки</span><select class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"><option value="none"${ssrIncludeBooleanAttr(Array.isArray(slide.actionType) ? ssrLooseContain(slide.actionType, "none") : ssrLooseEqual(slide.actionType, "none")) ? " selected" : ""}>Нет</option><option value="add_to_cart"${ssrIncludeBooleanAttr(Array.isArray(slide.actionType) ? ssrLooseContain(slide.actionType, "add_to_cart") : ssrLooseEqual(slide.actionType, "add_to_cart")) ? " selected" : ""}>В корзину</option><option value="open_category"${ssrIncludeBooleanAttr(Array.isArray(slide.actionType) ? ssrLooseContain(slide.actionType, "open_category") : ssrLooseEqual(slide.actionType, "open_category")) ? " selected" : ""}>К категории</option><option value="apply_promo"${ssrIncludeBooleanAttr(Array.isArray(slide.actionType) ? ssrLooseContain(slide.actionType, "apply_promo") : ssrLooseEqual(slide.actionType, "apply_promo")) ? " selected" : ""}>Промокод (пока не на витрине)</option></select></label>`);
          if (slide.actionType === "add_to_cart") {
            _push(`<div class="sm:col-span-2"><label class="block text-sm"><span class="text-gray-700">ID товара (UUID)</span><input${ssrRenderAttr("value", slide.payloadItemId)} type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs" placeholder="uuid позиции меню"></label><label class="mt-2 block text-sm"><span class="text-gray-700">Кол-во</span><input${ssrRenderAttr("value", slide.payloadQty)} type="number" min="1" class="mt-1 w-32 rounded-lg border border-gray-300 px-3 py-2"></label></div>`);
          } else if (slide.actionType === "open_category") {
            _push(`<div class="sm:col-span-2"><label class="block text-sm"><span class="text-gray-700">Категория (как на витрине)</span><select class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"><option value=""${ssrIncludeBooleanAttr(Array.isArray(slide.payloadCategory) ? ssrLooseContain(slide.payloadCategory, "") : ssrLooseEqual(slide.payloadCategory, "")) ? " selected" : ""}>— выберите —</option><!--[-->`);
            ssrRenderList(categoryNames.value, (cat) => {
              _push(`<option${ssrRenderAttr("value", cat)}${ssrIncludeBooleanAttr(Array.isArray(slide.payloadCategory) ? ssrLooseContain(slide.payloadCategory, cat) : ssrLooseEqual(slide.payloadCategory, cat)) ? " selected" : ""}>${ssrInterpolate(cat)}</option>`);
            });
            _push(`<!--]--></select></label><p class="mt-1 text-xs text-gray-500"> В payload уйдёт <code>category</code> = строка id секции (имя категории в меню). </p></div>`);
          } else if (slide.actionType === "apply_promo") {
            _push(`<div class="sm:col-span-2"><label class="block text-sm"><span class="text-gray-700">Код промокода</span><input${ssrRenderAttr("value", slide.payloadCode)} type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"></label></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></li>`);
        });
        _push(`<!--]--></ul></div></div>`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/stories/campaigns/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
