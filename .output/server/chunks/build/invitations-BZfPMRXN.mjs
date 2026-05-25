import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useDashboardAccess } from './useDashboardAccess-PseSveld.mjs';
import './server.mjs';
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
  __name: "invitations",
  __ssrInlineRender: true,
  setup(__props) {
    const { role } = useDashboardAccess();
    const email = ref("");
    const selectedRole = ref("manager");
    const errorMessage = ref(null);
    const statusFilter = ref("all");
    const invites = ref([
      { id: "inv-1", email: "manager@teleshop.app", role: "manager", status: "pending", expiresAt: "2026-03-27", resentAt: null },
      { id: "inv-2", email: "operator@teleshop.app", role: "operator", status: "accepted", expiresAt: "2026-03-24", resentAt: null }
    ]);
    const filteredInvites = computed(() => invites.value.filter((item) => statusFilter.value === "all" || item.status === statusFilter.value));
    function canResend(invite) {
      if (invite.status !== "pending") return false;
      if (!invite.resentAt) return true;
      return Date.now() - invite.resentAt > 6e4;
    }
    function statusClass(status) {
      if (status === "accepted") return "bg-green-100 text-green-700";
      if (status === "revoked") return "bg-red-100 text-red-700";
      if (status === "expired") return "bg-amber-100 text-amber-700";
      return "bg-gray-100 text-gray-700";
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h1 class="text-2xl font-semibold">\u041F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u044F \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u043E\u0432</h1><p class="text-sm text-gray-600">\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 invite-\u0441\u0441\u044B\u043B\u043E\u043A, \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u0441\u0442\u0430\u0442\u0443\u0441\u043E\u0432 \u0438 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0435 resend.</p>`);
      if (unref(role) !== "owner") {
        _push(`<div class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"> \u0422\u043E\u043B\u044C\u043A\u043E Owner \u043C\u043E\u0436\u0435\u0442 \u0443\u043F\u0440\u0430\u0432\u043B\u044F\u0442\u044C \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u044F\u043C\u0438. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">\u041F\u0440\u0438\u0433\u043B\u0430\u0441\u0438\u0442\u044C \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430</h2><div class="mt-3 grid gap-3 md:grid-cols-2"><input${ssrRenderAttr("value", email.value)} type="email" required placeholder="email@example.com" class="rounded-lg border border-gray-300 px-3 py-2 text-sm"><select class="rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="manager"${ssrIncludeBooleanAttr(Array.isArray(selectedRole.value) ? ssrLooseContain(selectedRole.value, "manager") : ssrLooseEqual(selectedRole.value, "manager")) ? " selected" : ""}>Manager</option><option value="operator"${ssrIncludeBooleanAttr(Array.isArray(selectedRole.value) ? ssrLooseContain(selectedRole.value, "operator") : ssrLooseEqual(selectedRole.value, "operator")) ? " selected" : ""}>\u041E\u043F\u0435\u0440\u0430\u0442\u043E\u0440 \u0437\u0430\u043A\u0430\u0437\u043E\u0432</option></select></div>`);
      if (errorMessage.value) {
        _push(`<p class="mt-2 text-sm text-red-700">${ssrInterpolate(errorMessage.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="mt-3 rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}> \u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435 </button></form><div class="rounded-xl border border-gray-200 bg-white p-4"><div class="mb-3 flex items-center justify-between gap-3"><h2 class="text-sm font-semibold">\u0421\u043F\u0438\u0441\u043E\u043A \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0439</h2><select class="rounded border border-gray-300 px-2 py-1 text-xs"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "all") : ssrLooseEqual(statusFilter.value, "all")) ? " selected" : ""}>\u0412\u0441\u0435</option><option value="pending"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "pending") : ssrLooseEqual(statusFilter.value, "pending")) ? " selected" : ""}>Pending</option><option value="accepted"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "accepted") : ssrLooseEqual(statusFilter.value, "accepted")) ? " selected" : ""}>Accepted</option><option value="expired"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "expired") : ssrLooseEqual(statusFilter.value, "expired")) ? " selected" : ""}>Expired</option><option value="revoked"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "revoked") : ssrLooseEqual(statusFilter.value, "revoked")) ? " selected" : ""}>Revoked</option></select></div><ul class="space-y-2 text-sm"><!--[-->`);
      ssrRenderList(filteredInvites.value, (invite) => {
        _push(`<li class="rounded border border-gray-100 px-3 py-2"><div class="flex items-center justify-between gap-3"><div><p class="font-medium text-gray-900">${ssrInterpolate(invite.email)}</p><p class="text-xs text-gray-500">\u0420\u043E\u043B\u044C: ${ssrInterpolate(invite.role)} \xB7 \u0418\u0441\u0442\u0435\u043A\u0430\u0435\u0442: ${ssrInterpolate(invite.expiresAt)}</p></div><span class="${ssrRenderClass([statusClass(invite.status), "rounded-full px-2 py-0.5 text-xs"])}">${ssrInterpolate(invite.status)}</span></div><div class="mt-2 flex gap-2"><button class="rounded border border-gray-300 px-2 py-1 text-xs disabled:opacity-50"${ssrIncludeBooleanAttr(!canResend(invite) || unref(role) !== "owner") ? " disabled" : ""}> Resend </button><button class="rounded border border-red-300 px-2 py-1 text-xs text-red-700 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(role) !== "owner") ? " disabled" : ""}> Revoke </button></div></li>`);
      });
      _push(`<!--]--></ul></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/team/invitations.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
