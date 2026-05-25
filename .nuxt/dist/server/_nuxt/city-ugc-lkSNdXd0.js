import { defineComponent, ref, watch, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "city-ugc",
  __ssrInlineRender: true,
  setup(__props) {
    const pending = ref(false);
    const errorMessage = ref("");
    const items = ref([]);
    const cityOptions = ref([]);
    const festivalOptions = ref([]);
    const statusFilter = ref("pending");
    const cityFilter = ref("");
    const festivalFilter = ref("");
    const kindFilter = ref("all");
    const toasts = ref([]);
    function isVideo(url) {
      return /\.(mp4|webm|mov)(\?|$)/i.test(url);
    }
    async function loadQueue() {
      pending.value = true;
      errorMessage.value = "";
      try {
        const query = new URLSearchParams();
        query.set("status", statusFilter.value);
        if (cityFilter.value) query.set("city_id", cityFilter.value);
        if (festivalFilter.value) query.set("festival_id", festivalFilter.value);
        if (kindFilter.value) query.set("kind", kindFilter.value);
        const response = await fetch(`/api/dashboard/moderation/city-ugc?${query.toString()}`);
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload?.statusMessage || "Не удалось загрузить очередь модерации");
        }
        items.value = Array.isArray(payload.items) ? payload.items : [];
        cityOptions.value = Array.isArray(payload?.filters?.cities) ? payload.filters.cities : [];
        festivalOptions.value = Array.isArray(payload?.filters?.festivals) ? payload.filters.festivals : [];
      } catch (err) {
        errorMessage.value = err?.message || "Ошибка загрузки";
      } finally {
        pending.value = false;
      }
    }
    watch([statusFilter, cityFilter, festivalFilter, kindFilter], () => {
      void loadQueue();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex items-end justify-between gap-3"><div><h1 class="text-2xl font-semibold">Модерация UGC по городу</h1><p class="mt-1 text-sm text-gray-600">Единая очередь фестивальных сторис и видеоотзывов с фильтрацией по городам.</p></div><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">Обновить</button></div><div class="grid gap-2 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-4"><label class="text-sm"><span class="mb-1 block text-gray-600">Статус</span><select class="w-full rounded-lg border border-gray-300 px-3 py-2"><option value="pending"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "pending") : ssrLooseEqual(statusFilter.value, "pending")) ? " selected" : ""}>Pending</option><option value="all"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "all") : ssrLooseEqual(statusFilter.value, "all")) ? " selected" : ""}>Все</option><option value="approved_menu"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "approved_menu") : ssrLooseEqual(statusFilter.value, "approved_menu")) ? " selected" : ""}>Approved menu</option><option value="approved_feed"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "approved_feed") : ssrLooseEqual(statusFilter.value, "approved_feed")) ? " selected" : ""}>Approved feed</option><option value="approved_menu_and_feed"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "approved_menu_and_feed") : ssrLooseEqual(statusFilter.value, "approved_menu_and_feed")) ? " selected" : ""}>Approved both</option><option value="rejected"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "rejected") : ssrLooseEqual(statusFilter.value, "rejected")) ? " selected" : ""}>Rejected</option><option value="forwarded_to_corner"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "forwarded_to_corner") : ssrLooseEqual(statusFilter.value, "forwarded_to_corner")) ? " selected" : ""}>Forwarded</option><option value="shadow_banned"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "shadow_banned") : ssrLooseEqual(statusFilter.value, "shadow_banned")) ? " selected" : ""}>Shadow banned</option></select></label><label class="text-sm"><span class="mb-1 block text-gray-600">Город</span><select class="w-full rounded-lg border border-gray-300 px-3 py-2"><option value=""${ssrIncludeBooleanAttr(Array.isArray(cityFilter.value) ? ssrLooseContain(cityFilter.value, "") : ssrLooseEqual(cityFilter.value, "")) ? " selected" : ""}>Все</option><!--[-->`);
      ssrRenderList(cityOptions.value, (c) => {
        _push(`<option${ssrRenderAttr("value", c.id)}${ssrIncludeBooleanAttr(Array.isArray(cityFilter.value) ? ssrLooseContain(cityFilter.value, c.id) : ssrLooseEqual(cityFilter.value, c.id)) ? " selected" : ""}>${ssrInterpolate(c.name)}</option>`);
      });
      _push(`<!--]--></select></label><label class="text-sm"><span class="mb-1 block text-gray-600">Фестиваль</span><select class="w-full rounded-lg border border-gray-300 px-3 py-2"><option value=""${ssrIncludeBooleanAttr(Array.isArray(festivalFilter.value) ? ssrLooseContain(festivalFilter.value, "") : ssrLooseEqual(festivalFilter.value, "")) ? " selected" : ""}>Все</option><!--[-->`);
      ssrRenderList(festivalOptions.value, (f) => {
        _push(`<option${ssrRenderAttr("value", f.id)}${ssrIncludeBooleanAttr(Array.isArray(festivalFilter.value) ? ssrLooseContain(festivalFilter.value, f.id) : ssrLooseEqual(festivalFilter.value, f.id)) ? " selected" : ""}>${ssrInterpolate(f.name)}</option>`);
      });
      _push(`<!--]--></select></label><label class="text-sm"><span class="mb-1 block text-gray-600">Формат</span><select class="w-full rounded-lg border border-gray-300 px-3 py-2"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(kindFilter.value) ? ssrLooseContain(kindFilter.value, "all") : ssrLooseEqual(kindFilter.value, "all")) ? " selected" : ""}>Все</option><option value="story"${ssrIncludeBooleanAttr(Array.isArray(kindFilter.value) ? ssrLooseContain(kindFilter.value, "story") : ssrLooseEqual(kindFilter.value, "story")) ? " selected" : ""}>Story</option><option value="video_review"${ssrIncludeBooleanAttr(Array.isArray(kindFilter.value) ? ssrLooseContain(kindFilter.value, "video_review") : ssrLooseEqual(kindFilter.value, "video_review")) ? " selected" : ""}>Video review</option></select></label></div><div class="fixed right-4 top-4 z-[100] space-y-2"><!--[-->`);
      ssrRenderList(toasts.value, (toast) => {
        _push(`<div class="${ssrRenderClass([toast.type === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900", "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg"])}"><p class="max-w-xs">${ssrInterpolate(toast.message)}</p><button class="ml-1 text-xs">x</button></div>`);
      });
      _push(`<!--]--></div>`);
      if (pending.value) {
        _push(`<div class="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">Загрузка очереди...</div>`);
      } else if (errorMessage.value) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">${ssrInterpolate(errorMessage.value)}</div>`);
      } else {
        _push(`<div class="space-y-3">`);
        if (!items.value.length) {
          _push(`<div class="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">Пусто по выбранным фильтрам.</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(items.value, (item) => {
          _push(`<article class="rounded-xl border border-gray-200 bg-white p-4"><div class="flex flex-wrap items-start justify-between gap-2"><div><p class="text-sm font-semibold text-gray-900">${ssrInterpolate(item.cityName)} • ${ssrInterpolate(item.restaurantName)}</p><p class="text-xs text-gray-500">${ssrInterpolate(item.festivalName)} • ${ssrInterpolate(item.kind)} • ${ssrInterpolate(item.createdAt)}</p><p class="mt-1 text-xs text-gray-600">status: ${ssrInterpolate(item.status)} | rating: ${ssrInterpolate(item.rating ?? "—")} | category: ${ssrInterpolate(item.category ?? "—")}</p></div><span class="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">${ssrInterpolate(item.id.slice(0, 8))}</span></div><div class="mt-3">`);
          if (isVideo(item.mediaUrl)) {
            _push(`<video${ssrRenderAttr("src", item.mediaUrl)} controls class="max-h-56 w-full rounded-lg border border-gray-200 bg-black"></video>`);
          } else {
            _push(`<img${ssrRenderAttr("src", item.mediaUrl)} alt="ugc preview" class="max-h-56 rounded-lg border border-gray-200 object-contain">`);
          }
          _push(`</div><div class="mt-3 flex flex-wrap gap-2"><button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50">В меню</button><button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50">В ленту</button><button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50">Меню + лента</button><button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50">Менеджеру</button><button class="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50">Отклонить</button><button class="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50">Теневой бан</button></div></article>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/moderation/city-ugc.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
