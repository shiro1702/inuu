import { i as useRoute, _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, computed, ref, watch, withCtx, createTextVNode, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderTeleport } from "vue/server-renderer";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
import { u as useDashboardAccess } from "./useDashboardAccess-PseSveld.js";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unctx/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/defu/dist/defu.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ufo/dist/index.mjs";
import "@supabase/ssr";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/klona/dist/index.mjs";
const dashboardOrderStatusLabels = {
  new: "Новый",
  in_progress: "В работе",
  ready_for_pickup: "На выдаче",
  out_for_delivery: "Доставка",
  handed_to_customer: "Выдан",
  cancelled: "Отменён"
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
      if (s === "awaiting_send") return "Ждём окна отправки";
      if (s === "sent") return "Отправлено, ждём оценку";
      if (s === "send_failed") return "Ошибка отправки";
      if (s === "completed") return "Есть оценка";
      if (s === "expired") return "Истекло";
      return status || "—";
    }
    const allowedTransitions = computed(() => {
      if (!order.value) return [];
      return getAllowedOrderStatusTransitions(order.value.status, order.value.fulfillmentType);
    });
    watch(allowedTransitions, (list) => {
      if (list.length) nextStatus.value = list[0];
    });
    function shortId(id) {
      if (!id) return "—";
      return id.length > 14 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id;
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
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[-->`);
      if (loadError.value) {
        _push(`<section class="space-y-4"><h1 class="text-2xl font-semibold">Ошибка</h1><p class="text-sm text-red-700">${ssrInterpolate(loadError.value)}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/orders",
          class: "text-primary text-sm hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`К списку заказов`);
            } else {
              return [
                createTextVNode("К списку заказов")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</section>`);
      } else if (pending.value) {
        _push(`<section class="space-y-4"><p class="text-sm text-gray-600">Загрузка заказа…</p></section>`);
      } else if (order.value) {
        _push(`<section class="space-y-4"><div class="flex items-start justify-between gap-3"><div><h1 class="text-2xl font-semibold"> Заказ ${ssrInterpolate(order.value.orderNumber && order.value.orderNumber.trim() ? order.value.orderNumber : shortId(order.value.id))}</h1><p class="mt-1 font-mono text-xs text-gray-500">ID: ${ssrInterpolate(shortId(order.value.id))}</p><p class="mt-1 text-sm text-gray-600">${ssrInterpolate(order.value.customerTelegramId != null ? `Telegram ${order.value.customerTelegramId}` : order.value.customerProfileId ? `Профиль ${shortId(order.value.customerProfileId)}` : "Клиент")}</p></div><span class="${ssrRenderClass([statusClass(order.value.status), "rounded-full px-2 py-1 text-xs"])}">${ssrInterpolate(statusLabel(order.value.status))}</span></div><div class="grid gap-3 md:grid-cols-3"><div class="rounded-xl border border-gray-200 bg-white p-4"><p class="text-xs uppercase text-gray-500">Сумма</p><p class="mt-1 text-lg font-semibold">${ssrInterpolate(order.value.total)} ₽</p></div><div class="rounded-xl border border-gray-200 bg-white p-4"><p class="text-xs uppercase text-gray-500">Филиал</p><p class="mt-1 text-lg font-semibold">${ssrInterpolate(order.value.restaurantName)}</p></div><div class="rounded-xl border border-gray-200 bg-white p-4"><p class="text-xs uppercase text-gray-500">Город</p><p class="mt-1 text-lg font-semibold">${ssrInterpolate(order.value.cityName)}</p></div></div><div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">Состав</h2><ul class="mt-2 space-y-2 text-sm"><!--[-->`);
        ssrRenderList(order.value.items, (it, idx) => {
          _push(`<li class="flex justify-between gap-2 border-b border-gray-100 pb-2"><span>${ssrInterpolate(it.name)} × ${ssrInterpolate(it.quantity)}</span><span class="text-gray-600">${ssrInterpolate(it.price * it.quantity)} ₽</span></li>`);
        });
        _push(`<!--]--></ul>`);
        if (!order.value.items.length) {
          _push(`<p class="mt-2 text-sm text-gray-500">Позиции не указаны</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">Смена статуса</h2>`);
        if (!unref(can)("orders.status.change")) {
          _push(`<div class="mt-2 text-sm text-red-700">Недостаточно прав.</div>`);
        } else {
          _push(`<div class="mt-3 space-y-3"><label class="block text-sm"><span class="mb-1 block text-gray-600">Новый статус</span><select class="w-full rounded-lg border border-gray-300 px-2 py-2"><!--[-->`);
          ssrRenderList(allowedTransitions.value, (value) => {
            _push(`<option${ssrRenderAttr("value", value)}${ssrIncludeBooleanAttr(Array.isArray(nextStatus.value) ? ssrLooseContain(nextStatus.value, value) : ssrLooseEqual(nextStatus.value, value)) ? " selected" : ""}>${ssrInterpolate(statusLabel(value))}</option>`);
          });
          _push(`<!--]--></select></label><label class="block text-sm"><span class="mb-1 block text-gray-600">Комментарий (обязателен для отмены)</span><textarea rows="3" class="w-full rounded-lg border border-gray-300 px-2 py-2">${ssrInterpolate(comment.value)}</textarea></label>`);
          if (errorMessage.value) {
            _push(`<p class="text-sm text-red-700">${ssrInterpolate(errorMessage.value)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<button class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(saving.value || !allowedTransitions.value.length) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "Сохранение…" : "Применить")}</button></div>`);
        }
        _push(`</div>`);
        if (order.value.reviewPrompt?.moduleEnabled) {
          _push(`<div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">Запрос отзыва</h2>`);
          if (order.value.reviewPrompt.hasReview) {
            _push(`<p class="mt-2 text-sm text-gray-700"> Оценка сохранена: ${ssrInterpolate(order.value.reviewPrompt.reviewRating ?? "—")} из 5 </p>`);
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
              _push(`<li class="text-gray-500">Промпт ещё не создавался.</li>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</ul><button type="button" class="mt-3 rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(reviewPromptSending.value) ? " disabled" : ""}>${ssrInterpolate(reviewPromptSending.value ? "Отправка…" : "Отправить запрос сейчас")}</button><!--]-->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold">Таймлайн</h2><ul class="mt-2 space-y-2 text-sm"><!--[-->`);
        ssrRenderList(order.value.timeline, (item, idx) => {
          _push(`<li class="flex items-center justify-between gap-3 border-b border-gray-100 pb-2"><span>${ssrInterpolate(item.label)}</span><span class="shrink-0 text-gray-500">${ssrInterpolate(formatAt(item.at))}</span></li>`);
        });
        _push(`<!--]--></ul>`);
        if (!order.value.timeline.length) {
          _push(`<p class="mt-2 text-sm text-gray-500">Событий пока нет</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></section>`);
      } else {
        _push(`<section><h1 class="text-2xl font-semibold">Заказ не найден</h1><p class="mt-2 text-sm text-gray-600">Проверьте ссылку или вернитесь к списку заказов.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/orders",
          class: "mt-2 inline-block text-primary text-sm hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`К списку`);
            } else {
              return [
                createTextVNode("К списку")
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
          _push2(`<div class="${ssrRenderClass([t.kind === "error" ? "border-red-200 bg-red-50 text-red-900" : "border-green-200 bg-green-50 text-green-900", "pointer-events-auto flex items-start justify-between gap-2 rounded-lg border px-3 py-2 text-sm shadow-md"])}"><span>${ssrInterpolate(t.message)}</span><button type="button" class="shrink-0 text-lg leading-none opacity-60 hover:opacity-100">×</button></div>`);
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
export {
  _sfc_main as default
};
