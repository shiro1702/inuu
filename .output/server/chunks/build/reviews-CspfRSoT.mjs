import { defineComponent, ref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';

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
          const msg = typeof payload.statusMessage === "string" ? payload.statusMessage : "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043E\u0442\u0437\u044B\u0432\u044B";
          throw new Error(msg);
        }
        items.value = Array.isArray(payload.items) ? payload.items : [];
        const m = payload.metrics;
        if (m) metrics.value = m;
      } catch (err) {
        errorMessage.value = err instanceof Error ? err.message : "\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438";
      } finally {
        pending.value = false;
      }
    }
    watch([statusFilter, onlyNegative, restaurantFilter], () => {
      void loadQueue();
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex flex-wrap items-end justify-between gap-3"><div><h1 class="text-2xl font-semibold text-gray-900">\u041E\u0442\u0437\u044B\u0432\u044B</h1><p class="mt-1 text-sm text-gray-600"> \u041E\u0447\u0435\u0440\u0435\u0434\u044C \u043D\u0435\u0433\u0430\u0442\u0438\u0432\u0430, \u043C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F \u0438 \u043C\u0435\u0442\u0440\u0438\u043A\u0438 \u0440\u0435\u043F\u0443\u0442\u0430\u0446\u0438\u0438 (\u043C\u043E\u0434\u0443\u043B\u044C <code class="rounded bg-gray-100 px-1">reputation_reviews_pro</code>). </p></div><button type="button" class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"> \u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C </button></div>`);
      if (featureBlocked.value) {
        _push(`<div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"> \u041C\u043E\u0434\u0443\u043B\u044C \u043E\u0442\u0437\u044B\u0432\u043E\u0432 \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D \u0438\u043B\u0438 \u043D\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u044B \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 (<code class="rounded bg-white/80 px-1">crm_orders_db</code>, <code class="rounded bg-white/80 px-1">core_telegram_orders</code>). \u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0443 \u0432 \u0440\u0430\u0437\u0434\u0435\u043B\u0435 \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0439 / \u0431\u0438\u043B\u043B\u0438\u043D\u0433\u0430 \u0438\u043B\u0438 \u0447\u0435\u0440\u0435\u0437 API <code class="rounded bg-white/80 px-1">/api/dashboard/features/toggle</code>. </div>`);
      } else {
        _push(`<div class="grid gap-3 md:grid-cols-2 lg:grid-cols-4"><div class="rounded-xl border border-gray-200 bg-white p-4"><p class="text-xs font-medium uppercase tracking-wide text-gray-500">\u041F\u0443\u0431\u043B\u0438\u0447\u043D\u044B\u0439 \u0440\u0435\u0439\u0442\u0438\u043D\u0433</p><p class="mt-1 text-2xl font-semibold text-gray-900">${ssrInterpolate((_a = metrics.value.public_rating) != null ? _a : "\u2014")}</p><p class="mt-1 text-xs text-gray-500">\u0412\u044B\u0431\u043E\u0440\u043A\u0430: ${ssrInterpolate(metrics.value.public_sample_count)} \xB7 \u0442\u043E\u043B\u044C\u043A\u043E \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043D\u044B\u0435</p></div><div class="rounded-xl border border-gray-200 bg-white p-4"><p class="text-xs font-medium uppercase tracking-wide text-gray-500">\u0412\u043D\u0443\u0442\u0440. \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u043E</p><p class="mt-1 text-2xl font-semibold text-gray-900">${ssrInterpolate((_b = metrics.value.internal_quality_score) != null ? _b : "\u2014")}</p><p class="mt-1 text-xs text-gray-500">\u0412\u044B\u0431\u043E\u0440\u043A\u0430: ${ssrInterpolate(metrics.value.internal_sample_count)} \xB7 \u0432\u0441\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u044B</p></div><div class="rounded-xl border border-gray-200 bg-white p-4"><p class="text-xs font-medium uppercase tracking-wide text-gray-500">\u041D\u0435\u0433\u0430\u0442\u0438\u0432 (1\u20133\u2605)</p><p class="mt-1 text-2xl font-semibold text-gray-900">${ssrInterpolate(metrics.value.negative_total)}</p><p class="mt-1 text-xs text-gray-500">\u0420\u0435\u0448\u0435\u043D\u043E: ${ssrInterpolate(metrics.value.negative_resolved)} (${ssrInterpolate(metrics.value.negative_resolved_percent)}%)</p></div><div class="rounded-xl border border-gray-200 bg-white p-4"><p class="text-xs font-medium uppercase tracking-wide text-gray-500">\u0424\u043E\u0440\u043C\u0443\u043B\u0430 \u043F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0433\u043E \u0440\u0435\u0439\u0442\u0438\u043D\u0433\u0430</p><p class="mt-1 text-sm text-gray-700">\u041F\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u043C 20 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043D\u044B\u043C \u043E\u0442\u0437\u044B\u0432\u0430\u043C (\u0441\u0440\u0435\u0434\u043D\u0435\u0435 \u0437\u0432\u0451\u0437\u0434).</p></div></div>`);
      }
      if (!featureBlocked.value) {
        _push(`<div class="grid gap-2 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-3"><label class="text-sm"><span class="mb-1 block text-gray-600">\u0421\u0442\u0430\u0442\u0443\u0441</span><select class="w-full rounded-lg border border-gray-300 px-3 py-2"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "all") : ssrLooseEqual(statusFilter.value, "all")) ? " selected" : ""}>\u0412\u0441\u0435</option><option value="new"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "new") : ssrLooseEqual(statusFilter.value, "new")) ? " selected" : ""}>\u041D\u043E\u0432\u044B\u0435</option><option value="manager_review"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "manager_review") : ssrLooseEqual(statusFilter.value, "manager_review")) ? " selected" : ""}>\u041D\u0430 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0435</option><option value="published"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "published") : ssrLooseEqual(statusFilter.value, "published")) ? " selected" : ""}>\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043E</option><option value="rejected"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "rejected") : ssrLooseEqual(statusFilter.value, "rejected")) ? " selected" : ""}>\u041E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u043E</option><option value="resolved"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "resolved") : ssrLooseEqual(statusFilter.value, "resolved")) ? " selected" : ""}>\u0420\u0435\u0448\u0435\u043D\u043E</option></select></label><label class="text-sm"><span class="mb-1 block text-gray-600">\u0422\u043E\u043B\u044C\u043A\u043E \u043D\u0435\u0433\u0430\u0442\u0438\u0432 (\u22643)</span><select class="w-full rounded-lg border border-gray-300 px-3 py-2"><option value="0"${ssrIncludeBooleanAttr(Array.isArray(onlyNegative.value) ? ssrLooseContain(onlyNegative.value, "0") : ssrLooseEqual(onlyNegative.value, "0")) ? " selected" : ""}>\u041D\u0435\u0442</option><option value="1"${ssrIncludeBooleanAttr(Array.isArray(onlyNegative.value) ? ssrLooseContain(onlyNegative.value, "1") : ssrLooseEqual(onlyNegative.value, "1")) ? " selected" : ""}>\u0414\u0430</option></select></label><label class="text-sm"><span class="mb-1 block text-gray-600">\u0424\u0438\u043B\u0438\u0430\u043B (UUID)</span><input${ssrRenderAttr("value", restaurantFilter.value)} type="text" placeholder="\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E" class="w-full rounded-lg border border-gray-300 px-3 py-2"></label></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="fixed right-4 top-20 z-[100] space-y-2"><!--[-->`);
      ssrRenderList(toasts.value, (toast) => {
        _push(`<div class="${ssrRenderClass([toast.type === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900", "flex max-w-xs items-start gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg"])}"><p>${ssrInterpolate(toast.message)}</p><button type="button" class="ml-1 text-xs">\xD7</button></div>`);
      });
      _push(`<!--]--></div>`);
      if (pending.value) {
        _push(`<div class="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600"> \u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026 </div>`);
      } else if (errorMessage.value) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">${ssrInterpolate(errorMessage.value)}</div>`);
      } else if (!featureBlocked.value && !items.value.length) {
        _push(`<div class="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600"> \u041D\u0435\u0442 \u043E\u0442\u0437\u044B\u0432\u043E\u0432 \u043F\u043E \u0444\u0438\u043B\u044C\u0442\u0440\u0430\u043C. </div>`);
      } else if (!featureBlocked.value) {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(items.value, (item) => {
          _push(`<article class="rounded-xl border border-gray-200 bg-white p-4"><div class="flex flex-wrap items-start justify-between gap-2"><div><p class="text-sm font-semibold text-gray-900">${ssrInterpolate(item.restaurantName)}</p><p class="text-xs text-gray-500"> \u0417\u0430\u043A\u0430\u0437 ${ssrInterpolate(item.orderId.slice(0, 8))} \xB7 ${ssrInterpolate(formatTs(item.createdAt))} \xB7 ${ssrInterpolate(item.rating)}\u2605 </p><p class="mt-1 text-xs text-gray-600">\u0421\u0442\u0430\u0442\u0443\u0441: <span class="font-medium">${ssrInterpolate(item.status)}</span></p>`);
          if (item.comment) {
            _push(`<p class="mt-2 text-sm text-gray-800">${ssrInterpolate(item.comment)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><span class="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">${ssrInterpolate(item.id.slice(0, 8))}</span></div><div class="mt-3 flex flex-wrap gap-2"><button type="button" class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(actionBusy.value === item.id) ? " disabled" : ""}> \u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C </button><button type="button" class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(actionBusy.value === item.id) ? " disabled" : ""}> \u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C </button><button type="button" class="rounded border border-emerald-300 px-2 py-1 text-xs text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"${ssrIncludeBooleanAttr(actionBusy.value === item.id) ? " disabled" : ""}> \u0420\u0435\u0448\u0435\u043D\u043E </button><button type="button" class="rounded border border-amber-300 px-2 py-1 text-xs text-amber-900 hover:bg-amber-50 disabled:opacity-50"${ssrIncludeBooleanAttr(actionBusy.value === item.id) ? " disabled" : ""}> \u0412\u0435\u0440\u043D\u0443\u0442\u044C \u0432 \u0440\u0430\u0431\u043E\u0442\u0443 </button></div></article>`);
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

export { _sfc_main as default };
