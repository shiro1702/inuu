import { i as useRoute, _ as __nuxt_component_0$2 } from './server.mjs';
import { defineComponent, computed, ref, watch, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderTeleport } from 'vue/server-renderer';
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

const dashboardOrderStatusLabels = {
  new: "\u041D\u043E\u0432\u044B\u0439",
  in_progress: "\u0412 \u0440\u0430\u0431\u043E\u0442\u0435",
  ready_for_pickup: "\u041D\u0430 \u0432\u044B\u0434\u0430\u0447\u0435",
  out_for_delivery: "\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430",
  handed_to_customer: "\u0412\u044B\u0434\u0430\u043D",
  cancelled: "\u041E\u0442\u043C\u0435\u043D\u0451\u043D"
};
function isDeliveryFulfillment(fulfillmentType) {
  return (fulfillmentType || "").toLowerCase() === "delivery";
}
function getAllowedOrderStatusTransitions(current, fulfillmentType) {
  const delivery = isDeliveryFulfillment(fulfillmentType);
  switch (current) {
    case "new":
      return ["in_progress", "cancelled"];
    case "in_progress":
      if (delivery) return ["out_for_delivery", "handed_to_customer", "cancelled"];
      return ["ready_for_pickup", "handed_to_customer", "cancelled"];
    case "ready_for_pickup":
      return ["handed_to_customer", "cancelled"];
    case "out_for_delivery":
      return ["handed_to_customer", "cancelled"];
    case "handed_to_customer":
    case "cancelled":
    default:
      return [];
  }
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { can } = useDashboardAccess();
    computed(() => String(route.params.id || ""));
    const order = ref(null);
    const pending = ref(true);
    const loadError = ref(null);
    const errorMessage = ref(null);
    const comment = ref("");
    const nextStatus = ref("in_progress");
    const saving = ref(false);
    const reviewPromptSending = ref(false);
    const toasts = ref([]);
    function reviewPromptStatusLabel(status) {
      const s = (status || "").toLowerCase();
      if (s === "awaiting_send") return "\u0416\u0434\u0451\u043C \u043E\u043A\u043D\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0438";
      if (s === "sent") return "\u041E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E, \u0436\u0434\u0451\u043C \u043E\u0446\u0435\u043D\u043A\u0443";
      if (s === "send_failed") return "\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0438";
      if (s === "completed") return "\u0415\u0441\u0442\u044C \u043E\u0446\u0435\u043D\u043A\u0430";
      if (s === "expired") return "\u0418\u0441\u0442\u0435\u043A\u043B\u043E";
      return status || "\u2014";
    }
    const allowedTransitions = computed(() => {
      if (!order.value) return [];
      return getAllowedOrderStatusTransitions(order.value.status, order.value.fulfillmentType);
    });
    watch(allowedTransitions, (list) => {
      if (list.length) nextStatus.value = list[0];
    });
    function shortId(id) {
      if (!id) return "\u2014";
      return id.length > 14 ? `${id.slice(0, 8)}\u2026${id.slice(-4)}` : id;
    }
    function formatAt(iso) {
      try {
        const d = new Date(iso);
        return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      } catch {
        return iso;
      }
    }
    function statusLabel(value) {
      return dashboardOrderStatusLabels[value];
    }
    function statusClass(value) {
      if (value === "handed_to_customer") return "bg-green-100 text-green-700";
      if (value === "cancelled") return "bg-red-100 text-red-700";
      if (value === "in_progress") return "bg-blue-100 text-blue-700";
      if (value === "ready_for_pickup") return "bg-amber-100 text-amber-900";
      if (value === "out_for_delivery") return "bg-violet-100 text-violet-800";
      return "bg-gray-100 text-gray-700";
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<!--[-->`);
      if (loadError.value) {
        _push(`<section class="space-y-4"><h1 class="text-2xl font-semibold">\u041E\u0448\u0438\u0431\u043A\u0430</h1><p class="text-sm text-red-700">${ssrInterpolate(loadError.value)}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/orders",
          class: "text-primary text-sm hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u041A \u0441\u043F\u0438\u0441\u043A\u0443 \u0437\u0430\u043A\u0430\u0437\u043E\u0432`);
            } else {
              return [
                createTextVNode("\u041A \u0441\u043F\u0438\u0441\u043A\u0443 \u0437\u0430\u043A\u0430\u0437\u043E\u0432")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</section>`);
      } else if (pending.value) {
        _push(`<section class="space-y-4"><p class="text-sm text-gray-600">\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0437\u0430\u043A\u0430\u0437\u0430\u2026</p></section>`);
      } else if (order.value) {
        _push(`<section class="space-y-4"><div class="flex items-start justify-between gap-3"><div><h1 class="text-2xl font-semibold"> \u0417\u0430\u043A\u0430\u0437 ${ssrInterpolate(order.value.orderNumber && order.value.orderNumber.trim() ? order.value.orderNumber : shortId(order.value.id))}</h1><p class="mt-1 font-mono text-xs text-gray-500">ID: ${ssrInterpolate(shortId(order.value.id))}</p><p class="mt-1 text-sm text-gray-600">${ssrInterpolate(order.value.customerTelegramId != null ? `Telegram ${order.value.customerTelegramId}` : order.value.customerProfileId ? `\u041F\u0440\u043E\u0444\u0438\u043B\u044C ${shortId(order.value.customerProfileId)}` : "\u041A\u043B\u0438\u0435\u043D\u0442")}</p></div><span class="${ssrRenderClass([statusClass(order.value.status), "rounded-full px-2 py-1 text-xs"])}">${ssrInterpolate(statusLabel(order.value.status))}</span></div><div class="grid gap-3 md:grid-cols-3"><div class="rounded-xl border border-gray-200 bg-white p-4"><p class="text-xs uppercase text-gray-500">\u0421\u0443\u043C\u043C\u0430</p><p class="mt-1 text-lg font-semibold">${ssrInterpolate(order.value.total)} \u20BD</p></div><div class="rounded-xl border border-gray-200 bg-white p-4"><p class="text-xs uppercase text-gray-500">\u0424\u0438\u043B\u0438\u0430\u043B</p><p class="mt-1 text-lg font-semibold">${ssrInterpolate(order.value.restaurantName)}</p></div><div class="rounded-xl border border-gray-200 bg-white p-4"><p class="text-xs uppercase text-gray-500">\u0413\u043E\u0440\u043E\u0434</p><p class="mt-1 text-lg font-semibold">${ssrInterpolate(order.value.cityName)}</p></div></div><div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">\u0421\u043E\u0441\u0442\u0430\u0432</h2><ul class="mt-2 space-y-2 text-sm"><!--[-->`);
        ssrRenderList(order.value.items, (it, idx) => {
          _push(`<li class="flex justify-between gap-2 border-b border-gray-100 pb-2"><span>${ssrInterpolate(it.name)} \xD7 ${ssrInterpolate(it.quantity)}</span><span class="text-gray-600">${ssrInterpolate(it.price * it.quantity)} \u20BD</span></li>`);
        });
        _push(`<!--]--></ul>`);
        if (!order.value.items.length) {
          _push(`<p class="mt-2 text-sm text-gray-500">\u041F\u043E\u0437\u0438\u0446\u0438\u0438 \u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u044B</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">\u0421\u043C\u0435\u043D\u0430 \u0441\u0442\u0430\u0442\u0443\u0441\u0430</h2>`);
        if (!unref(can)("orders.status.change")) {
          _push(`<div class="mt-2 text-sm text-red-700">\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u043F\u0440\u0430\u0432.</div>`);
        } else {
          _push(`<div class="mt-3 space-y-3"><label class="block text-sm"><span class="mb-1 block text-gray-600">\u041D\u043E\u0432\u044B\u0439 \u0441\u0442\u0430\u0442\u0443\u0441</span><select class="w-full rounded-lg border border-gray-300 px-2 py-2"><!--[-->`);
          ssrRenderList(allowedTransitions.value, (value) => {
            _push(`<option${ssrRenderAttr("value", value)}${ssrIncludeBooleanAttr(Array.isArray(nextStatus.value) ? ssrLooseContain(nextStatus.value, value) : ssrLooseEqual(nextStatus.value, value)) ? " selected" : ""}>${ssrInterpolate(statusLabel(value))}</option>`);
          });
          _push(`<!--]--></select></label><label class="block text-sm"><span class="mb-1 block text-gray-600">\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 (\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D \u0434\u043B\u044F \u043E\u0442\u043C\u0435\u043D\u044B)</span><textarea rows="3" class="w-full rounded-lg border border-gray-300 px-2 py-2">${ssrInterpolate(comment.value)}</textarea></label>`);
          if (errorMessage.value) {
            _push(`<p class="text-sm text-red-700">${ssrInterpolate(errorMessage.value)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<button class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(saving.value || !allowedTransitions.value.length) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435\u2026" : "\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C")}</button></div>`);
        }
        _push(`</div>`);
        if ((_a = order.value.reviewPrompt) == null ? void 0 : _a.moduleEnabled) {
          _push(`<div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">\u0417\u0430\u043F\u0440\u043E\u0441 \u043E\u0442\u0437\u044B\u0432\u0430</h2>`);
          if (order.value.reviewPrompt.hasReview) {
            _push(`<p class="mt-2 text-sm text-gray-700"> \u041E\u0446\u0435\u043D\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0430: ${ssrInterpolate((_b = order.value.reviewPrompt.reviewRating) != null ? _b : "\u2014")} \u0438\u0437 5 </p>`);
          } else {
            _push(`<!--[--><ul class="mt-2 space-y-2 text-sm"><!--[-->`);
            ssrRenderList(order.value.reviewPrompt.prompts, (p, idx) => {
              _push(`<li class="flex flex-wrap justify-between gap-2 border-b border-gray-100 pb-2"><span class="font-medium">${ssrInterpolate(p.channel === "max" ? "MAX" : "Telegram")}</span><span class="text-gray-600">${ssrInterpolate(reviewPromptStatusLabel(p.status))}</span>`);
              if (p.lastError) {
                _push(`<span class="w-full text-xs text-red-600">${ssrInterpolate(p.lastError)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</li>`);
            });
            _push(`<!--]-->`);
            if (!order.value.reviewPrompt.prompts.length) {
              _push(`<li class="text-gray-500">\u041F\u0440\u043E\u043C\u043F\u0442 \u0435\u0449\u0451 \u043D\u0435 \u0441\u043E\u0437\u0434\u0430\u0432\u0430\u043B\u0441\u044F.</li>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</ul><button type="button" class="mt-3 rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(reviewPromptSending.value) ? " disabled" : ""}>${ssrInterpolate(reviewPromptSending.value ? "\u041E\u0442\u043F\u0440\u0430\u0432\u043A\u0430\u2026" : "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u043F\u0440\u043E\u0441 \u0441\u0435\u0439\u0447\u0430\u0441")}</button><!--]-->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">\u0422\u0430\u0439\u043C\u043B\u0430\u0439\u043D</h2><ul class="mt-2 space-y-2 text-sm"><!--[-->`);
        ssrRenderList(order.value.timeline, (item, idx) => {
          _push(`<li class="flex items-center justify-between gap-3 border-b border-gray-100 pb-2"><span>${ssrInterpolate(item.label)}</span><span class="shrink-0 text-gray-500">${ssrInterpolate(formatAt(item.at))}</span></li>`);
        });
        _push(`<!--]--></ul>`);
        if (!order.value.timeline.length) {
          _push(`<p class="mt-2 text-sm text-gray-500">\u0421\u043E\u0431\u044B\u0442\u0438\u0439 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></section>`);
      } else {
        _push(`<section><h1 class="text-2xl font-semibold">\u0417\u0430\u043A\u0430\u0437 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D</h1><p class="mt-2 text-sm text-gray-600">\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u0441\u044B\u043B\u043A\u0443 \u0438\u043B\u0438 \u0432\u0435\u0440\u043D\u0438\u0442\u0435\u0441\u044C \u043A \u0441\u043F\u0438\u0441\u043A\u0443 \u0437\u0430\u043A\u0430\u0437\u043E\u0432.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/orders",
          class: "mt-2 inline-block text-primary text-sm hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u041A \u0441\u043F\u0438\u0441\u043A\u0443`);
            } else {
              return [
                createTextVNode("\u041A \u0441\u043F\u0438\u0441\u043A\u0443")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</section>`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="pointer-events-none fixed right-4 top-4 z-[200] flex max-w-sm flex-col gap-2"><!--[-->`);
        ssrRenderList(toasts.value, (t) => {
          _push2(`<div class="${ssrRenderClass([t.kind === "error" ? "border-red-200 bg-red-50 text-red-900" : "border-green-200 bg-green-50 text-green-900", "pointer-events-auto flex items-start justify-between gap-2 rounded-lg border px-3 py-2 text-sm shadow-md"])}"><span>${ssrInterpolate(t.message)}</span><button type="button" class="shrink-0 text-lg leading-none opacity-60 hover:opacity-100">\xD7</button></div>`);
        });
        _push2(`<!--]--></div>`);
      }, "body", false, _parent);
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/orders/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
