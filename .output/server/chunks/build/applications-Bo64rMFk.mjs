import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "applications",
  __ssrInlineRender: true,
  setup(__props) {
    const typeFilter = ref("all");
    const statusFilter = ref("all");
    const applications = ref([
      { id: "app-1", type: "support", status: "new", assignee: "\u2014", note: "", subject: "\u041F\u0440\u043E\u0431\u043B\u0435\u043C\u0430 \u0441 \u043E\u043F\u043B\u0430\u0442\u043E\u0439", slaUntil: "2026-03-25 10:00" },
      { id: "app-2", type: "sales", status: "in_progress", assignee: "\u0410\u043B\u0438\u043D\u0430", note: "\u0421\u043E\u0437\u0432\u043E\u043D \u0432 14:00", subject: "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0433\u043E \u0444\u0438\u043B\u0438\u0430\u043B\u0430", slaUntil: "2026-03-25 17:00" }
    ]);
    const filteredApplications = computed(() => applications.value.filter((item) => {
      if (typeFilter.value !== "all" && item.type !== typeFilter.value) return false;
      if (statusFilter.value !== "all" && item.status !== statusFilter.value) return false;
      return true;
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h1 class="text-2xl font-semibold">\u0417\u0430\u044F\u0432\u043A\u0438</h1><p class="text-sm text-gray-600">\u041B\u0435\u0433\u043A\u043E\u0432\u0435\u0441\u043D\u044B\u0439 MVP workflow: \u0444\u0438\u043B\u044C\u0442\u0440, \u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439, \u0441\u0442\u0430\u0442\u0443\u0441, \u0437\u0430\u043C\u0435\u0442\u043A\u0438.</p><div class="rounded-xl border border-gray-200 bg-white p-4"><div class="mb-3 grid gap-2 md:grid-cols-3"><select class="rounded-lg border border-gray-300 px-2 py-2 text-sm"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(typeFilter)) ? ssrLooseContain(unref(typeFilter), "all") : ssrLooseEqual(unref(typeFilter), "all")) ? " selected" : ""}>\u0412\u0441\u0435 \u0442\u0438\u043F\u044B</option><option value="support"${ssrIncludeBooleanAttr(Array.isArray(unref(typeFilter)) ? ssrLooseContain(unref(typeFilter), "support") : ssrLooseEqual(unref(typeFilter), "support")) ? " selected" : ""}>Support</option><option value="sales"${ssrIncludeBooleanAttr(Array.isArray(unref(typeFilter)) ? ssrLooseContain(unref(typeFilter), "sales") : ssrLooseEqual(unref(typeFilter), "sales")) ? " selected" : ""}>Sales</option></select><select class="rounded-lg border border-gray-300 px-2 py-2 text-sm"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "all") : ssrLooseEqual(unref(statusFilter), "all")) ? " selected" : ""}>\u0412\u0441\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u044B</option><option value="new"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "new") : ssrLooseEqual(unref(statusFilter), "new")) ? " selected" : ""}>New</option><option value="in_progress"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "in_progress") : ssrLooseEqual(unref(statusFilter), "in_progress")) ? " selected" : ""}>In progress</option><option value="done"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "done") : ssrLooseEqual(unref(statusFilter), "done")) ? " selected" : ""}>Done</option></select></div><ul class="space-y-2"><!--[-->`);
      ssrRenderList(unref(filteredApplications), (item) => {
        _push(`<li class="rounded border border-gray-100 px-3 py-2 text-sm"><div class="flex items-center justify-between gap-3"><div><p class="font-medium text-gray-900">${ssrInterpolate(item.subject)}</p><p class="text-xs text-gray-500">${ssrInterpolate(item.type)} \xB7 SLA \u0434\u043E ${ssrInterpolate(item.slaUntil)}</p></div><select class="rounded border border-gray-300 px-2 py-1 text-xs"><option value="new"${ssrIncludeBooleanAttr(Array.isArray(item.status) ? ssrLooseContain(item.status, "new") : ssrLooseEqual(item.status, "new")) ? " selected" : ""}>New</option><option value="in_progress"${ssrIncludeBooleanAttr(Array.isArray(item.status) ? ssrLooseContain(item.status, "in_progress") : ssrLooseEqual(item.status, "in_progress")) ? " selected" : ""}>In progress</option><option value="done"${ssrIncludeBooleanAttr(Array.isArray(item.status) ? ssrLooseContain(item.status, "done") : ssrLooseEqual(item.status, "done")) ? " selected" : ""}>Done</option></select></div><div class="mt-2 grid gap-2 md:grid-cols-2"><input${ssrRenderAttr("value", item.assignee)} placeholder="\u041E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439" class="rounded border border-gray-300 px-2 py-1 text-xs"><input${ssrRenderAttr("value", item.note)} placeholder="\u0417\u0430\u043C\u0435\u0442\u043A\u0430" class="rounded border border-gray-300 px-2 py-1 text-xs"></div></li>`);
      });
      _push(`<!--]--></ul></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/applications.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
