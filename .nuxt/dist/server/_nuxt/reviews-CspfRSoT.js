import { defineComponent, ref, watch, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "reviews",
  __ssrInlineRender: true,
  setup(__props) {
    const pending = ref(false);
    const errorMessage = ref("");
    const featureBlocked = ref(false);
    const items = ref([]);
    const metrics = ref({
      public_rating: null,
      public_sample_count: 0,
      internal_quality_score: null,
      internal_sample_count: 0,
      negative_total: 0,
      negative_resolved: 0,
      negative_resolved_percent: 0
    });
    const statusFilter = ref("all");
    const onlyNegative = ref("0");
    const restaurantFilter = ref("");
    const actionBusy = ref("");
    const toasts = ref([]);
    function formatTs(iso) {
      try {
        return new Intl.DateTimeFormat("ru-RU", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));
      } catch {
        return iso;
      }
    }
    async function loadQueue() {
      pending.value = true;
      errorMessage.value = "";
      featureBlocked.value = false;
      try {
        const q = new URLSearchParams();
        if (statusFilter.value !== "all") q.set("status", statusFilter.value);
        if (onlyNegative.value === "1") q.set("only_negative", "1");
        if (restaurantFilter.value) q.set("restaurant_id", restaurantFilter.value);
        q.set("limit", "120");
        const response = await fetch(`/api/dashboard/reviews?${q.toString()}`);
        const payload = await response.json().catch(() => ({}));
        if (response.status === 402 || response.status === 403 || response.status === 404) {
          featureBlocked.value = true;
          items.value = [];
          return;
        }
        if (!response.ok) {
          const msg = typeof payload.statusMessage === "string" ? payload.statusMessage : "Не удалось загрузить отзывы";
          throw new Error(msg);
        }
        items.value = Array.isArray(payload.items) ? payload.items : [];
        const m = payload.metrics;
        if (m) metrics.value = m;
      } catch (err) {
        errorMessage.value = err instanceof Error ? err.message : "Ошибка загрузки";
      } finally {
        pending.value = false;
      }
    }
    watch([statusFilter, onlyNegative, restaurantFilter], () => {
      void loadQueue();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex flex-wrap items-end justify-between gap-3"><div><h1 class="text-2xl font-semibold text-gray-900">Отзывы</h1><p class="mt-1 text-sm text-gray-600"> Очередь негатива, модерация и метрики репутации (модуль <code class="rounded bg-gray-100 px-1">reputation_reviews_pro</code>). </p></div><button type="button" class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"> Обновить </button></div>`);
      if (featureBlocked.value) {
        _push(`<div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"> Модуль отзывов выключен или не выполнены зависимости (<code class="rounded bg-white/80 px-1">crm_orders_db</code>, <code class="rounded bg-white/80 px-1">core_telegram_orders</code>). Включите подписку в разделе интеграций / биллинга или через API <code class="rounded bg-white/80 px-1">/api/dashboard/features/toggle</code>. </div>`);
      } else {
        _push(`<div class="grid gap-3 md:grid-cols-2 lg:grid-cols-4"><div class="rounded-xl border border-gray-200 bg-white p-4"><p class="text-xs font-medium uppercase tracking-wide text-gray-500">Публичный рейтинг</p><p class="mt-1 text-2xl font-semibold text-gray-900">${ssrInterpolate(metrics.value.public_rating ?? "—")}</p><p class="mt-1 text-xs text-gray-500">Выборка: ${ssrInterpolate(metrics.value.public_sample_count)} · только опубликованные</p></div><div class="rounded-xl border border-gray-200 bg-white p-4"><p class="text-xs font-medium uppercase tracking-wide text-gray-500">Внутр. качество</p><p class="mt-1 text-2xl font-semibold text-gray-900">${ssrInterpolate(metrics.value.internal_quality_score ?? "—")}</p><p class="mt-1 text-xs text-gray-500">Выборка: ${ssrInterpolate(metrics.value.internal_sample_count)} · все статусы</p></div><div class="rounded-xl border border-gray-200 bg-white p-4"><p class="text-xs font-medium uppercase tracking-wide text-gray-500">Негатив (1–3★)</p><p class="mt-1 text-2xl font-semibold text-gray-900">${ssrInterpolate(metrics.value.negative_total)}</p><p class="mt-1 text-xs text-gray-500">Решено: ${ssrInterpolate(metrics.value.negative_resolved)} (${ssrInterpolate(metrics.value.negative_resolved_percent)}%)</p></div><div class="rounded-xl border border-gray-200 bg-white p-4"><p class="text-xs font-medium uppercase tracking-wide text-gray-500">Формула публичного рейтинга</p><p class="mt-1 text-sm text-gray-700">По последним 20 опубликованным отзывам (среднее звёзд).</p></div></div>`);
      }
      if (!featureBlocked.value) {
        _push(`<div class="grid gap-2 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-3"><label class="text-sm"><span class="mb-1 block text-gray-600">Статус</span><select class="w-full rounded-lg border border-gray-300 px-3 py-2"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "all") : ssrLooseEqual(statusFilter.value, "all")) ? " selected" : ""}>Все</option><option value="new"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "new") : ssrLooseEqual(statusFilter.value, "new")) ? " selected" : ""}>Новые</option><option value="manager_review"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "manager_review") : ssrLooseEqual(statusFilter.value, "manager_review")) ? " selected" : ""}>На менеджере</option><option value="published"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "published") : ssrLooseEqual(statusFilter.value, "published")) ? " selected" : ""}>Опубликовано</option><option value="rejected"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "rejected") : ssrLooseEqual(statusFilter.value, "rejected")) ? " selected" : ""}>Отклонено</option><option value="resolved"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "resolved") : ssrLooseEqual(statusFilter.value, "resolved")) ? " selected" : ""}>Решено</option></select></label><label class="text-sm"><span class="mb-1 block text-gray-600">Только негатив (≤3)</span><select class="w-full rounded-lg border border-gray-300 px-3 py-2"><option value="0"${ssrIncludeBooleanAttr(Array.isArray(onlyNegative.value) ? ssrLooseContain(onlyNegative.value, "0") : ssrLooseEqual(onlyNegative.value, "0")) ? " selected" : ""}>Нет</option><option value="1"${ssrIncludeBooleanAttr(Array.isArray(onlyNegative.value) ? ssrLooseContain(onlyNegative.value, "1") : ssrLooseEqual(onlyNegative.value, "1")) ? " selected" : ""}>Да</option></select></label><label class="text-sm"><span class="mb-1 block text-gray-600">Филиал (UUID)</span><input${ssrRenderAttr("value", restaurantFilter.value)} type="text" placeholder="опционально" class="w-full rounded-lg border border-gray-300 px-3 py-2"></label></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="fixed right-4 top-20 z-[100] space-y-2"><!--[-->`);
      ssrRenderList(toasts.value, (toast) => {
        _push(`<div class="${ssrRenderClass([toast.type === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900", "flex max-w-xs items-start gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg"])}"><p>${ssrInterpolate(toast.message)}</p><button type="button" class="ml-1 text-xs">×</button></div>`);
      });
      _push(`<!--]--></div>`);
      if (pending.value) {
        _push(`<div class="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600"> Загрузка… </div>`);
      } else if (errorMessage.value) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">${ssrInterpolate(errorMessage.value)}</div>`);
      } else if (!featureBlocked.value && !items.value.length) {
        _push(`<div class="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600"> Нет отзывов по фильтрам. </div>`);
      } else if (!featureBlocked.value) {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(items.value, (item) => {
          _push(`<article class="rounded-xl border border-gray-200 bg-white p-4"><div class="flex flex-wrap items-start justify-between gap-2"><div><p class="text-sm font-semibold text-gray-900">${ssrInterpolate(item.restaurantName)}</p><p class="text-xs text-gray-500"> Заказ ${ssrInterpolate(item.orderId.slice(0, 8))} · ${ssrInterpolate(formatTs(item.createdAt))} · ${ssrInterpolate(item.rating)}★ </p><p class="mt-1 text-xs text-gray-600">Статус: <span class="font-medium">${ssrInterpolate(item.status)}</span></p>`);
          if (item.comment) {
            _push(`<p class="mt-2 text-sm text-gray-800">${ssrInterpolate(item.comment)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><span class="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">${ssrInterpolate(item.id.slice(0, 8))}</span></div><div class="mt-3 flex flex-wrap gap-2"><button type="button" class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(actionBusy.value === item.id) ? " disabled" : ""}> Опубликовать </button><button type="button" class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(actionBusy.value === item.id) ? " disabled" : ""}> Отклонить </button><button type="button" class="rounded border border-emerald-300 px-2 py-1 text-xs text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"${ssrIncludeBooleanAttr(actionBusy.value === item.id) ? " disabled" : ""}> Решено </button><button type="button" class="rounded border border-amber-300 px-2 py-1 text-xs text-amber-900 hover:bg-amber-50 disabled:opacity-50"${ssrIncludeBooleanAttr(actionBusy.value === item.id) ? " disabled" : ""}> Вернуть в работу </button></div></article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/reviews.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
