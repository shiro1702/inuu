import { i as useRoute, _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, computed, ref, watch, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrLooseContain } from 'vue/server-renderer';
import { u as useDashboardAccess } from './useDashboardAccess-PseSveld.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    const { role } = useDashboardAccess();
    const canEditCritical = computed(() => role.value === "owner");
    const loading = ref(true);
    const branch = ref(null);
    const form = ref({
      name: "",
      address: "",
      lat: null,
      lon: null,
      supportsDelivery: false,
      supportsPickup: false,
      supportsDineIn: false,
      supportsQrMenu: false,
      supportsShowcaseOrder: false,
      useOrganizationWorkingHours: true,
      workingHours: {
        mon: { isOpen: true, openAt: "09:00", closeAt: "22:00" },
        tue: { isOpen: true, openAt: "09:00", closeAt: "22:00" },
        wed: { isOpen: true, openAt: "09:00", closeAt: "22:00" },
        thu: { isOpen: true, openAt: "09:00", closeAt: "22:00" },
        fri: { isOpen: true, openAt: "09:00", closeAt: "22:00" },
        sat: { isOpen: true, openAt: "09:00", closeAt: "22:00" },
        sun: { isOpen: true, openAt: "09:00", closeAt: "22:00" }
      }
    });
    const logs = ref([]);
    const allowedModes = ref(["delivery", "pickup"]);
    const allowedModesSet = computed(() => new Set(allowedModes.value));
    const orgDineInHallMode = ref("to-table");
    const workingDayRows = [
      { key: "mon", label: "\u041F\u043E\u043D\u0435\u0434\u0435\u043B\u044C\u043D\u0438\u043A" },
      { key: "tue", label: "\u0412\u0442\u043E\u0440\u043D\u0438\u043A" },
      { key: "wed", label: "\u0421\u0440\u0435\u0434\u0430" },
      { key: "thu", label: "\u0427\u0435\u0442\u0432\u0435\u0440\u0433" },
      { key: "fri", label: "\u041F\u044F\u0442\u043D\u0438\u0446\u0430" },
      { key: "sat", label: "\u0421\u0443\u0431\u0431\u043E\u0442\u0430" },
      { key: "sun", label: "\u0412\u043E\u0441\u043A\u0440\u0435\u0441\u0435\u043D\u044C\u0435" }
    ];
    const storefrontPath = ref("");
    const qrDataUrl = ref(null);
    const copyFeedback = ref("");
    const suggestItems = ref([]);
    const isSuggestLoading = ref(false);
    const tables = ref([]);
    const newTableNumber = ref("");
    const creatingTable = ref(false);
    const updatingTableId = ref("");
    const tablesError = ref("");
    const copyFeedbackByTableId = ref({});
    const tableQrDataById = ref({});
    const bulkFrom = ref(1);
    const bulkTo = ref(20);
    const creatingBulkTables = ref(false);
    const branchQrUrl = computed(() => {
      return "";
    });
    watch(
      [branch, storefrontPath, branchQrUrl],
      async () => {
        {
          qrDataUrl.value = null;
          return;
        }
      },
      { immediate: true }
    );
    function buildTableQrUrl(table) {
      return "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      if (branch.value) {
        _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><h1 class="text-2xl font-semibold">\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u0444\u0438\u043B\u0438\u0430\u043B\u0430</h1><p class="mt-1 text-sm text-gray-600">${ssrInterpolate(branch.value.name)}</p><div class="mt-2 flex flex-wrap items-center gap-3">`);
        if (branch.value && storefrontPath.value) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: { path: storefrontPath.value, query: { branch_id: branch.value.id } },
            target: "_blank",
            rel: "noopener noreferrer",
            class: "inline-flex items-center rounded-lg border border-primary bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` \u0412\u0438\u0442\u0440\u0438\u043D\u0430 \xB7 \u044D\u0442\u043E\u0442 \u0444\u0438\u043B\u0438\u0430\u043B `);
              } else {
                return [
                  createTextVNode(" \u0412\u0438\u0442\u0440\u0438\u043D\u0430 \xB7 \u044D\u0442\u043E\u0442 \u0444\u0438\u043B\u0438\u0430\u043B ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><span class="${ssrRenderClass([branch.value.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700", "rounded-full px-2.5 py-1 text-xs font-medium"])}">${ssrInterpolate(branch.value.isActive ? "Active" : "Inactive")}</span></div>`);
        if (branch.value && storefrontPath.value) {
          _push(`<div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold text-gray-900">QR \u0434\u043B\u044F \u0433\u043E\u0441\u0442\u0435\u0439</h2><p class="mt-1 text-xs text-gray-500"> \u0421\u0441\u044B\u043B\u043A\u0430 \u0432\u0435\u0434\u0451\u0442 \u043D\u0430 \u0432\u0438\u0442\u0440\u0438\u043D\u0443 \u0441 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u043C \u0444\u0438\u043B\u0438\u0430\u043B\u043E\u043C. \u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 <code class="rounded bg-gray-100 px-1">qr=1</code> \u043E\u0442\u043C\u0435\u0447\u0430\u0435\u0442 \u043F\u0435\u0440\u0435\u0445\u043E\u0434 \u0441 QR-\u0441\u0442\u0438\u043A\u0435\u0440\u0430 (\u043C\u043E\u0436\u043D\u043E \u043E\u0442\u0444\u0438\u043B\u044C\u0442\u0440\u043E\u0432\u0430\u0442\u044C \u0432 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0435). </p><div class="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start"><div class="rounded-lg border border-gray-100 bg-gray-50 p-3">`);
          if (qrDataUrl.value) {
            _push(`<img${ssrRenderAttr("src", qrDataUrl.value)} width="220" height="220" class="h-[220px] w-[220px]" alt="QR-\u043A\u043E\u0434 \u0441\u0441\u044B\u043B\u043A\u0438 \u043D\u0430 \u0432\u0438\u0442\u0440\u0438\u043D\u0443 \u0444\u0438\u043B\u0438\u0430\u043B\u0430">`);
          } else {
            _push(`<p class="flex h-[220px] w-[220px] items-center justify-center text-xs text-gray-400"> \u0413\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u044F\u2026 </p>`);
          }
          _push(`</div><div class="min-w-0 flex-1 space-y-2 text-sm"><p class="break-all rounded border border-gray-200 bg-gray-50 px-2 py-1.5 font-mono text-xs text-gray-800">${ssrInterpolate(branchQrUrl.value || "\u2014")}</p><button type="button" class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(!branchQrUrl.value) ? " disabled" : ""}>${ssrInterpolate(copyFeedback.value || "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443")}</button></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (branch.value && storefrontPath.value) {
          _push(`<div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold text-gray-900">\u0421\u0442\u043E\u043B\u0438\u043A\u0438 \u0438 QR</h2><p class="mt-1 text-xs text-gray-500"> \u0414\u043B\u044F \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0441\u0442\u043E\u043B\u0438\u043A\u0430 \u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u0430\u044F QR-\u0441\u0441\u044B\u043B\u043A\u0430 \u0441 \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442\u043E\u043C \u0441\u0442\u043E\u043B\u0438\u043A\u0430. </p><div class="mt-3 flex flex-col gap-2 sm:flex-row"><input${ssrRenderAttr("value", newTableNumber.value)} class="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm sm:max-w-xs" placeholder="\u041D\u043E\u043C\u0435\u0440 \u0441\u0442\u043E\u043B\u0438\u043A\u0430, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 12"${ssrIncludeBooleanAttr(!canEditCritical.value || creatingTable.value) ? " disabled" : ""}><button type="button" class="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(!canEditCritical.value || creatingTable.value || !newTableNumber.value.trim()) ? " disabled" : ""}>${ssrInterpolate(creatingTable.value ? "\u0414\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u043C..." : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u0442\u043E\u043B\u0438\u043A")}</button></div><div class="mt-2 flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-end"><label class="text-xs text-gray-600"><span class="mb-1 block">\u041E\u0442</span><input${ssrRenderAttr("value", bulkFrom.value)} type="number" min="1" class="w-28 rounded-lg border border-gray-300 px-2 py-1.5 text-sm"${ssrIncludeBooleanAttr(!canEditCritical.value || creatingBulkTables.value) ? " disabled" : ""}></label><label class="text-xs text-gray-600"><span class="mb-1 block">\u0414\u043E</span><input${ssrRenderAttr("value", bulkTo.value)} type="number" min="1" class="w-28 rounded-lg border border-gray-300 px-2 py-1.5 text-sm"${ssrIncludeBooleanAttr(!canEditCritical.value || creatingBulkTables.value) ? " disabled" : ""}></label><button type="button" class="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-white disabled:opacity-50"${ssrIncludeBooleanAttr(!canEditCritical.value || creatingBulkTables.value) ? " disabled" : ""}>${ssrInterpolate(creatingBulkTables.value ? "\u0413\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u0435\u043C..." : "\u0421\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D \u0441\u0442\u043E\u043B\u0438\u043A\u043E\u0432")}</button></div>`);
          if (tablesError.value) {
            _push(`<p class="mt-2 text-xs text-red-600">${ssrInterpolate(tablesError.value)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="mt-4 space-y-2"><!--[-->`);
          ssrRenderList(tables.value, (table) => {
            _push(`<div class="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center"><div class="rounded border border-gray-200 bg-white p-1.5">`);
            if (tableQrDataById.value[table.id]) {
              _push(`<img${ssrRenderAttr("src", tableQrDataById.value[table.id])} width="84" height="84" class="h-[84px] w-[84px]"${ssrRenderAttr("alt", `QR \u0434\u043B\u044F \u0441\u0442\u043E\u043B\u0438\u043A\u0430 \u2116${table.tableNumber}`)}>`);
            } else {
              _push(`<div class="flex h-[84px] w-[84px] items-center justify-center text-[10px] text-gray-400"> QR... </div>`);
            }
            _push(`</div><div class="min-w-0 flex-1"><p class="text-sm font-medium text-gray-900">\u0421\u0442\u043E\u043B\u0438\u043A \u2116${ssrInterpolate(table.tableNumber)}</p><p class="break-all text-xs text-gray-500">${ssrInterpolate(buildTableQrUrl())}</p></div><div class="flex items-center gap-2"><button type="button" class="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs hover:bg-gray-100 disabled:opacity-50"${ssrIncludeBooleanAttr(true) ? " disabled" : ""}>${ssrInterpolate(copyFeedbackByTableId.value[table.id] || "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C QR-\u0441\u0441\u044B\u043B\u043A\u0443")}</button><button type="button" class="${ssrRenderClass([table.isActive ? "border-amber-300 text-amber-700 hover:bg-amber-50" : "border-emerald-300 text-emerald-700 hover:bg-emerald-50", "rounded-lg border px-2.5 py-1.5 text-xs disabled:opacity-50"])}"${ssrIncludeBooleanAttr(!canEditCritical.value || updatingTableId.value === table.id) ? " disabled" : ""}>${ssrInterpolate(table.isActive ? "\u0414\u0435\u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u0442\u044C" : "\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u0442\u044C")}</button></div></div>`);
          });
          _push(`<!--]-->`);
          if (!tables.value.length) {
            _push(`<p class="text-xs text-gray-500">\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0441\u0442\u043E\u043B\u0438\u043A\u043E\u0432.</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2"><label class="text-sm"><span class="mb-1 block text-gray-600">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435</span><input${ssrRenderAttr("value", form.value.name)} class="w-full rounded-lg border border-gray-300 px-2 py-2"${ssrIncludeBooleanAttr(!canEditCritical.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">\u0410\u0434\u0440\u0435\u0441</span><div class="relative"><input${ssrRenderAttr("value", form.value.address)} class="w-full rounded-lg border border-gray-300 px-2 py-2"${ssrIncludeBooleanAttr(!canEditCritical.value) ? " disabled" : ""}>`);
        if (isSuggestLoading.value) {
          _push(`<div class="pointer-events-none absolute inset-y-0 right-2 flex items-center"><svg class="h-4 w-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg></div>`);
        } else {
          _push(`<!---->`);
        }
        if (suggestItems.value.length && canEditCritical.value) {
          _push(`<div class="absolute inset-x-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"><!--[-->`);
          ssrRenderList(suggestItems.value, (item) => {
            _push(`<button type="button" class="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-gray-800 transition hover:bg-gray-50"><span class="truncate">${ssrInterpolate(item.displayName)}</span></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></label><label class="inline-flex items-center gap-2 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(Array.isArray(form.value.supportsDelivery) ? ssrLooseContain(form.value.supportsDelivery, null) : form.value.supportsDelivery) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"${ssrIncludeBooleanAttr(!canEditCritical.value || !allowedModesSet.value.has("delivery")) ? " disabled" : ""}> \u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430 </label><label class="inline-flex items-center gap-2 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(Array.isArray(form.value.supportsPickup) ? ssrLooseContain(form.value.supportsPickup, null) : form.value.supportsPickup) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"${ssrIncludeBooleanAttr(!canEditCritical.value || !allowedModesSet.value.has("pickup")) ? " disabled" : ""}> \u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 </label><label class="inline-flex items-center gap-2 text-sm text-gray-700 md:col-span-2"><input${ssrIncludeBooleanAttr(Array.isArray(form.value.supportsDineIn) ? ssrLooseContain(form.value.supportsDineIn, null) : form.value.supportsDineIn) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"${ssrIncludeBooleanAttr(!canEditCritical.value || !allowedModesSet.value.has("dine-in")) ? " disabled" : ""}> \u0412 \u0437\u0430\u043B\u0435 </label>`);
        if (form.value.supportsDineIn && allowedModesSet.value.has("dine-in")) {
          _push(`<!--[-->`);
          if (orgDineInHallMode.value === "to-table") {
            _push(`<label class="inline-flex items-center gap-2 text-sm text-gray-700 md:col-span-2"><input${ssrIncludeBooleanAttr(Array.isArray(form.value.supportsQrMenu) ? ssrLooseContain(form.value.supportsQrMenu, null) : form.value.supportsQrMenu) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"${ssrIncludeBooleanAttr(!canEditCritical.value) ? " disabled" : ""}> \u0417\u0430\u043A\u0430\u0437\u044B \u0434\u043E \u0441\u0442\u043E\u043B\u0438\u043A\u0430 (QR \u0441\u043E \u0441\u0442\u043E\u043B\u0438\u043A\u0430) </label>`);
          } else {
            _push(`<!---->`);
          }
          if (orgDineInHallMode.value === "pickup-point") {
            _push(`<label class="inline-flex items-center gap-2 text-sm text-gray-700 md:col-span-2"><input${ssrIncludeBooleanAttr(Array.isArray(form.value.supportsShowcaseOrder) ? ssrLooseContain(form.value.supportsShowcaseOrder, null) : form.value.supportsShowcaseOrder) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"${ssrIncludeBooleanAttr(!canEditCritical.value) ? " disabled" : ""}> \u0417\u0430\u043A\u0430\u0437 \u043D\u0430 \u043E\u0431\u0449\u0443\u044E \u0432\u044B\u0434\u0430\u0447\u0443 (\u043F\u043E QR) </label>`);
          } else {
            _push(`<!---->`);
          }
          if (orgDineInHallMode.value === "qr-menu-browse") {
            _push(`<p class="md:col-span-2 text-xs text-gray-500"> \u0412 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438 \u0432\u043A\u043B\u044E\u0447\u0451\u043D \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043C\u0435\u043D\u044E \u0432 \u0437\u0430\u043B\u0435 \u2014 \u0437\u0430\u043A\u0430\u0437\u044B \u0447\u0435\u0440\u0435\u0437 \u0444\u0438\u043B\u0438\u0430\u043B \u043D\u0435 \u043D\u0430\u0441\u0442\u0440\u0430\u0438\u0432\u0430\u044E\u0442\u0441\u044F. </p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="md:col-span-2"><div class="mb-3 rounded border border-gray-200 bg-gray-50 p-3"><p class="text-sm font-medium text-gray-700">\u0413\u0440\u0430\u0444\u0438\u043A \u0440\u0430\u0431\u043E\u0442\u044B \u0444\u0438\u043B\u0438\u0430\u043B\u0430</p><p class="mt-1 text-xs text-gray-500"> \u041C\u043E\u0436\u043D\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u043E\u0431\u0449\u0438\u0439 \u0433\u0440\u0430\u0444\u0438\u043A \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430 \u0438\u043B\u0438 \u0437\u0430\u0434\u0430\u0442\u044C \u0441\u0432\u043E\u0439 \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u0444\u0438\u043B\u0438\u0430\u043B\u0430. </p><label class="mt-2 inline-flex items-center gap-2 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(Array.isArray(form.value.useOrganizationWorkingHours) ? ssrLooseContain(form.value.useOrganizationWorkingHours, null) : form.value.useOrganizationWorkingHours) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"${ssrIncludeBooleanAttr(!canEditCritical.value) ? " disabled" : ""}> \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u043E\u0431\u0449\u0438\u0439 \u0433\u0440\u0430\u0444\u0438\u043A \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430 </label>`);
        if (!form.value.useOrganizationWorkingHours) {
          _push(`<div class="mt-3 space-y-2"><!--[-->`);
          ssrRenderList(workingDayRows, (day) => {
            _push(`<div class="grid items-center gap-2 rounded border border-gray-200 bg-white px-2 py-2 md:grid-cols-[120px,120px,1fr,1fr]"><span class="text-sm text-gray-700">${ssrInterpolate(day.label)}</span><label class="inline-flex items-center gap-2 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(Array.isArray(form.value.workingHours[day.key].isOpen) ? ssrLooseContain(form.value.workingHours[day.key].isOpen, null) : form.value.workingHours[day.key].isOpen) ? " checked" : ""} type="checkbox"${ssrIncludeBooleanAttr(!canEditCritical.value) ? " disabled" : ""}> \u041E\u0442\u043A\u0440\u044B\u0442\u043E </label><label class="text-sm"><span class="mb-1 block text-xs text-gray-500">\u041E\u0442\u043A\u0440\u044B\u0442\u0438\u0435</span><input${ssrRenderAttr("value", form.value.workingHours[day.key].openAt)} type="time" class="w-full rounded border border-gray-300 px-2 py-1.5"${ssrIncludeBooleanAttr(!canEditCritical.value || !form.value.workingHours[day.key].isOpen) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-xs text-gray-500">\u0417\u0430\u043A\u0440\u044B\u0442\u0438\u0435</span><input${ssrRenderAttr("value", form.value.workingHours[day.key].closeAt)} type="time" class="w-full rounded border border-gray-300 px-2 py-1.5"${ssrIncludeBooleanAttr(!canEditCritical.value || !form.value.workingHours[day.key].isOpen) ? " disabled" : ""}></label></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><p class="mb-2 text-xs text-gray-500"> \u0412 \u0444\u0438\u043B\u0438\u0430\u043B\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B \u0442\u043E\u043B\u044C\u043A\u043E \u0442\u0435 \u0441\u043F\u043E\u0441\u043E\u0431\u044B \u0440\u0430\u0431\u043E\u0442\u044B, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u044B \u0432 \u043E\u0431\u0449\u0438\u0445 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430. </p>`);
        if (!canEditCritical.value) {
          _push(`<p class="mb-2 text-xs text-amber-700">\u041A\u0440\u0438\u0442\u0438\u0447\u043D\u044B\u0435 \u043F\u043E\u043B\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B \u0442\u043E\u043B\u044C\u043A\u043E Owner.</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"${ssrIncludeBooleanAttr(!canEditCritical.value) ? " disabled" : ""}> \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C </button><button class="ml-2 rounded border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"${ssrIncludeBooleanAttr(!canEditCritical.value) ? " disabled" : ""}> \u0414\u0435\u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u0442\u044C </button></div></div><div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439</h2><ul class="mt-2 space-y-2 text-sm"><!--[-->`);
        ssrRenderList(logs.value, (log, idx) => {
          _push(`<li class="flex items-center justify-between gap-3 border-b border-gray-100 pb-2"><span>${ssrInterpolate(log.action)}</span><span class="text-gray-500">${ssrInterpolate(log.at)}</span></li>`);
        });
        _push(`<!--]--></ul></div></section>`);
      } else if (loading.value) {
        _push(`<section${ssrRenderAttrs(mergeProps({
          class: "space-y-4",
          "aria-busy": "true",
          "aria-label": "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0444\u0438\u043B\u0438\u0430\u043B\u0430"
        }, _attrs))}><div class="animate-pulse"><div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div class="space-y-2"><div class="h-8 w-56 rounded-lg bg-gray-200"></div><div class="h-4 w-40 rounded bg-gray-100"></div><div class="flex gap-3 pt-1"><div class="h-4 w-28 rounded bg-gray-100"></div><div class="h-4 w-24 rounded bg-gray-100"></div><div class="h-8 w-36 rounded-lg bg-gray-200"></div></div></div><div class="h-6 w-16 rounded-full bg-gray-100"></div></div></div><div class="animate-pulse rounded-xl border border-gray-200 bg-white p-4"><div class="h-4 w-32 rounded bg-gray-200"></div><div class="mt-3 h-3 w-full max-w-md rounded bg-gray-100"></div><div class="mt-4 flex flex-col gap-4 sm:flex-row"><div class="h-[220px] w-[220px] rounded-lg bg-gray-100"></div><div class="min-w-0 flex-1 space-y-2"><div class="h-10 w-full rounded-lg bg-gray-100"></div><div class="h-9 w-36 rounded-lg bg-gray-200"></div></div></div></div><div class="animate-pulse rounded-xl border border-gray-200 bg-white p-4"><div class="h-4 w-36 rounded bg-gray-200"></div><div class="mt-3 h-10 w-full max-w-xs rounded-lg bg-gray-100"></div><div class="mt-2 h-16 w-full rounded-lg bg-gray-50"></div></div><div class="animate-pulse grid gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2"><div class="h-16 rounded-lg bg-gray-100"></div><div class="h-16 rounded-lg bg-gray-100"></div><div class="h-5 w-28 rounded bg-gray-100"></div><div class="h-5 w-28 rounded bg-gray-100"></div><div class="md:col-span-2 space-y-2"><div class="h-24 rounded-lg bg-gray-50"></div><div class="flex gap-2"><div class="h-9 w-24 rounded-lg bg-gray-200"></div><div class="h-9 w-32 rounded-lg bg-gray-100"></div></div></div></div><div class="animate-pulse rounded-xl border border-gray-200 bg-white p-4"><div class="h-4 w-44 rounded bg-gray-200"></div><div class="mt-3 space-y-2"><div class="h-8 rounded bg-gray-50"></div><div class="h-8 rounded bg-gray-50"></div></div></div></section>`);
      } else {
        _push(`<section${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-semibold">\u0424\u0438\u043B\u0438\u0430\u043B \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D</h1><p class="mt-2 text-sm text-gray-600">\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u0441\u044B\u043B\u043A\u0443 \u0438\u043B\u0438 \u0432\u0435\u0440\u043D\u0438\u0442\u0435\u0441\u044C \u043A \u0441\u043F\u0438\u0441\u043A\u0443 \u0444\u0438\u043B\u0438\u0430\u043B\u043E\u0432.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/branches",
          class: "mt-4 inline-block text-sm text-primary hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u041A \u0441\u043F\u0438\u0441\u043A\u0443 \u0444\u0438\u043B\u0438\u0430\u043B\u043E\u0432 `);
            } else {
              return [
                createTextVNode(" \u041A \u0441\u043F\u0438\u0441\u043A\u0443 \u0444\u0438\u043B\u0438\u0430\u043B\u043E\u0432 ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</section>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/branches/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
