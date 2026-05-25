import { defineComponent, ref, reactive, computed, watch, resolveComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderStyle, ssrRenderComponent, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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
  __name: "organization",
  __ssrInlineRender: true,
  setup(__props) {
    const { role } = useDashboardAccess();
    const loading = ref(true);
    const saving = ref(false);
    const hasRollback = ref(false);
    const presets = ref([]);
    const auditLog = ref([]);
    const originalConfig = ref(null);
    const originalSettings = ref(null);
    const newPresetTitle = ref("");
    const newPresetMood = ref("");
    const activeMainTab = ref("identity");
    const toasts = ref([]);
    const form = reactive({
      identity: {
        name: "",
        shortDescription: "",
        fullDescription: "",
        logoSmallUrl: "",
        logoUrl: "",
        logoLargeUrl: "",
        faviconUrl: "",
        restaurantCardImageUrl: "",
        heroImageUrl: ""
      },
      tokens: {
        brandPrimary: "#000000",
        textOnPrimary: "#FFFFFF",
        brandSecondary: "#000000",
        brandAccent: "#000000",
        surfaceBackground: "#FFFFFF",
        surfaceCard: "#FFFFFF",
        textPrimary: "#111111",
        textMuted: "#666666",
        stateSuccess: "#16A34A",
        stateWarning: "#D97706",
        stateError: "#DC2626"
      },
      radii: { button: 8, modal: 14, input: 8, card: 12 },
      presetId: null
    });
    const settings = reactive({
      slug: "",
      displayName: "",
      tagline: "",
      cuisine: "",
      contacts: {
        phone: "",
        max: "",
        telegram: "",
        email: ""
      },
      ops: {
        status: "open",
        minOrderAmount: 500,
        prepTimeMinutes: 30,
        deliveryFee: 150,
        freeDeliveryFrom: 1e3,
        fulfillmentTypes: ["delivery", "pickup"],
        dineInHallMode: "to-table",
        dineInStaffButtons: { waiter: true, hookah: false, requestBill: true },
        orderAcceptanceMode: "manual",
        ordersPaused: false,
        ordersPausedReason: "",
        workingHours: {
          mon: { isOpen: true, openAt: "09:00", closeAt: "22:00" },
          tue: { isOpen: true, openAt: "09:00", closeAt: "22:00" },
          wed: { isOpen: true, openAt: "09:00", closeAt: "22:00" },
          thu: { isOpen: true, openAt: "09:00", closeAt: "22:00" },
          fri: { isOpen: true, openAt: "09:00", closeAt: "22:00" },
          sat: { isOpen: true, openAt: "09:00", closeAt: "22:00" },
          sun: { isOpen: true, openAt: "09:00", closeAt: "22:00" }
        }
      },
      locale: {
        currency: "RUB",
        timezone: "Asia/Irkutsk",
        languages: ["ru"]
      },
      tax: {
        vatMode: "none"
      },
      legal: {
        legalName: "",
        inn: "",
        ogrn: ""
      }
    });
    const languagesRaw = ref("ru");
    const cuisineSearch = ref("");
    const selectedCuisineTags = ref([]);
    const defaultCuisineSuggestions = [
      "\u0418\u0442\u0430\u043B\u044C\u044F\u043D\u0441\u043A\u0430\u044F",
      "\u042F\u043F\u043E\u043D\u0441\u043A\u0430\u044F",
      "\u041A\u0438\u0442\u0430\u0439\u0441\u043A\u0430\u044F",
      "\u0413\u0440\u0443\u0437\u0438\u043D\u0441\u043A\u0430\u044F",
      "\u041A\u043E\u0440\u0435\u0439\u0441\u043A\u0430\u044F",
      "\u0415\u0432\u0440\u043E\u043F\u0435\u0439\u0441\u043A\u0430\u044F",
      "\u0412\u0435\u0433\u0430\u043D\u0441\u043A\u0430\u044F",
      "\u0421\u0442\u0440\u0438\u0442-\u0444\u0443\u0434",
      "\u041F\u0438\u0446\u0446\u0430",
      "\u0411\u0443\u0440\u0433\u0435\u0440\u044B",
      "\u0421\u0443\u0448\u0438",
      "\u041A\u043E\u0444\u0435\u0439\u043D\u044F"
    ];
    const fulfillmentOptions = [
      { value: "delivery", label: "\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430", description: "\u0417\u0430\u043A\u0430\u0437 \u0441 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u043E\u0439 \u043F\u043E \u0430\u0434\u0440\u0435\u0441\u0443 \u043A\u043B\u0438\u0435\u043D\u0442\u0430." },
      { value: "pickup", label: "\u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437", description: "\u041A\u043B\u0438\u0435\u043D\u0442 \u043E\u0444\u043E\u0440\u043C\u043B\u044F\u0435\u0442 \u0438 \u0437\u0430\u0431\u0438\u0440\u0430\u0435\u0442 \u0437\u0430\u043A\u0430\u0437 \u0441\u0430\u043C." },
      { value: "dine-in", label: "\u0412 \u0437\u0430\u043B\u0435", description: "\u0413\u043E\u0441\u0442\u044C \u0432 \u0437\u0430\u043B\u0435; \u043F\u043E\u0434\u0440\u0435\u0436\u0438\u043C (QR-\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440, \u0434\u043E \u0441\u0442\u043E\u043B\u0438\u043A\u0430, \u043D\u0430 \u0432\u044B\u0434\u0430\u0447\u0443) \u0437\u0430\u0434\u0430\u0451\u0442\u0441\u044F \u043D\u0438\u0436\u0435." }
    ];
    const workingDayRows = [
      { key: "mon", label: "\u041F\u043E\u043D\u0435\u0434\u0435\u043B\u044C\u043D\u0438\u043A" },
      { key: "tue", label: "\u0412\u0442\u043E\u0440\u043D\u0438\u043A" },
      { key: "wed", label: "\u0421\u0440\u0435\u0434\u0430" },
      { key: "thu", label: "\u0427\u0435\u0442\u0432\u0435\u0440\u0433" },
      { key: "fri", label: "\u041F\u044F\u0442\u043D\u0438\u0446\u0430" },
      { key: "sat", label: "\u0421\u0443\u0431\u0431\u043E\u0442\u0430" },
      { key: "sun", label: "\u0412\u043E\u0441\u043A\u0440\u0435\u0441\u0435\u043D\u044C\u0435" }
    ];
    const colorFields = [
      { key: "brandPrimary", label: "brand.primary" },
      { key: "textOnPrimary", label: "text.onPrimary" },
      { key: "brandSecondary", label: "brand.secondary" },
      { key: "brandAccent", label: "brand.accent" },
      { key: "surfaceBackground", label: "surface.background" },
      { key: "surfaceCard", label: "surface.card" },
      { key: "textPrimary", label: "text.primary" },
      { key: "textMuted", label: "text.muted" },
      { key: "stateSuccess", label: "state.success" },
      { key: "stateWarning", label: "state.warning" },
      { key: "stateError", label: "state.error" }
    ];
    const radiusFields = [
      { key: "button", label: "radius.button" },
      { key: "modal", label: "radius.modal" },
      { key: "input", label: "radius.input" },
      { key: "card", label: "radius.card" }
    ];
    const isReadonly = computed(() => role.value !== "owner");
    const normalizedCuisineSearch = computed(() => cuisineSearch.value.trim());
    const filteredCuisineSuggestions = computed(() => {
      const query = normalizedCuisineSearch.value.toLowerCase();
      return defaultCuisineSuggestions.filter((tag) => !selectedCuisineTags.value.includes(tag)).filter((tag) => !query || tag.toLowerCase().includes(query)).slice(0, 8);
    });
    const canAddCuisineTag = computed(() => {
      const tag = normalizedCuisineSearch.value;
      if (!tag) return false;
      return !selectedCuisineTags.value.some((item) => item.toLowerCase() === tag.toLowerCase());
    });
    const validationErrors = computed(() => {
      const result = [];
      const name = form.identity.name.trim();
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(settings.slug.trim().toLowerCase())) result.push("Slug \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 lowercase-kebab-case.");
      if (settings.displayName.trim().length < 2 || settings.displayName.trim().length > 60) result.push("\u041F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u043E\u0442 2 \u0434\u043E 60 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.");
      if (name.length < 2 || name.length > 60) result.push("\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u043E\u0442 2 \u0434\u043E 60 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.");
      if (form.identity.shortDescription.trim().length > 160) result.push("\u041A\u043E\u0440\u043E\u0442\u043A\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u043F\u0440\u0435\u0432\u044B\u0448\u0430\u0442\u044C 160 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.");
      if (form.identity.fullDescription.trim().length > 1e3) result.push("\u041F\u043E\u043B\u043D\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u043F\u0440\u0435\u0432\u044B\u0448\u0430\u0442\u044C 1000 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.");
      for (const field of colorFields) {
        if (!/^#[0-9A-Fa-f]{6}$/.test(form.tokens[field.key])) {
          result.push(`\u041F\u043E\u043B\u0435 ${field.label} \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 #RRGGBB.`);
        }
      }
      for (const field of radiusFields) {
        const value = Number(form.radii[field.key]);
        if (!Number.isFinite(value) || value < 0 || value > 32) {
          result.push(`${field.label} \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0432 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D\u0435 0-32.`);
        }
      }
      if (settings.contacts.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contacts.email)) {
        result.push("\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 email \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0430.");
      }
      return result;
    });
    const isContrastOk = computed(() => {
      const bg = hexToRgb(form.tokens.surfaceBackground);
      const text = hexToRgb(form.tokens.textPrimary);
      if (!bg || !text) return true;
      const ratio = contrastRatio(bg, text);
      return ratio >= 4.5;
    });
    const diffItems = computed(() => {
      if (!originalConfig.value) return [];
      const baseline = originalConfig.value;
      const items = [];
      if (form.identity.name !== baseline.identity.name) items.push("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u043E \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430");
      if (form.identity.shortDescription !== baseline.identity.shortDescription) items.push("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u043E \u043A\u043E\u0440\u043E\u0442\u043A\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435");
      if (form.identity.fullDescription !== baseline.identity.fullDescription) items.push("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u043E \u043F\u043E\u043B\u043D\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435");
      if (form.identity.logoUrl !== baseline.identity.logoUrl) items.push("\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D URL \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0433\u043E \u043B\u043E\u0433\u043E\u0442\u0438\u043F\u0430");
      if (form.identity.faviconUrl !== baseline.identity.faviconUrl) items.push("\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D favicon");
      if (form.identity.restaurantCardImageUrl !== baseline.identity.restaurantCardImageUrl) items.push("\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0430 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430");
      if (form.identity.heroImageUrl !== baseline.identity.heroImageUrl) items.push("\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D hero image");
      if (originalSettings.value && settings.slug !== originalSettings.value.slug) items.push("\u0418\u0437\u043C\u0435\u043D\u0435\u043D slug");
      if (originalSettings.value && settings.displayName !== originalSettings.value.displayName) items.push("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u043E \u043F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435");
      for (const field of colorFields) {
        if (form.tokens[field.key] !== baseline.tokens[field.key]) items.push(`\u0418\u0437\u043C\u0435\u043D\u0435\u043D ${field.label}`);
      }
      for (const field of radiusFields) {
        if (form.radii[field.key] !== baseline.radii[field.key]) items.push(`\u0418\u0437\u043C\u0435\u043D\u0435\u043D ${field.label}`);
      }
      return items;
    });
    function formatDate(value) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return date.toLocaleString("ru-RU");
    }
    function safeColor(value) {
      return /^#[0-9A-Fa-f]{6}$/.test(value) ? value : "#FFFFFF";
    }
    function hexToRgb(hex) {
      if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return null;
      return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16)
      };
    }
    function relativeLuminance(input) {
      const transform = (x) => {
        const value = x / 255;
        return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      };
      const r = transform(input.r);
      const g = transform(input.g);
      const b = transform(input.b);
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    function contrastRatio(a, b) {
      const l1 = relativeLuminance(a);
      const l2 = relativeLuminance(b);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }
    watch(languagesRaw, (value) => {
      settings.locale.languages = value.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_OrganizationRestaurantPreviewCard = resolveComponent("OrganizationRestaurantPreviewCard");
      const _component_OrganizationProductPreviewCard = resolveComponent("OrganizationProductPreviewCard");
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2"><!--[-->`);
      ssrRenderList(toasts.value, (toast) => {
        _push(`<div class="${ssrRenderClass([toast.kind === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700", "pointer-events-auto flex items-start gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg"])}" role="status"><span class="min-w-0 flex-1 break-words">${ssrInterpolate(toast.message)}</span><button type="button" class="shrink-0 rounded px-1 leading-none text-gray-500 hover:bg-black/5 hover:text-gray-800" aria-label="\u0417\u0430\u043A\u0440\u044B\u0442\u044C"> \xD7 </button></div>`);
      });
      _push(`<!--]--></div><div class="space-y-1"><h1 class="text-2xl font-semibold">\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438</h1><p class="text-sm text-gray-600">\u0411\u0440\u0435\u043D\u0434, \u0441\u0442\u0438\u043B\u044C \u0438 \u043F\u0440\u0435\u0441\u0435\u0442\u044B \u0432\u0438\u0442\u0440\u0438\u043D\u044B \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430.</p></div>`);
      if (loading.value) {
        _push(`<div class="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600"> \u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C \u0442\u0435\u043A\u0443\u0449\u0438\u0439 \u0441\u0442\u0438\u043B\u044C... </div>`);
      } else {
        _push(`<!--[-->`);
        if (isReadonly.value) {
          _push(`<div class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"> \u0420\u0435\u0436\u0438\u043C \u0442\u043E\u043B\u044C\u043A\u043E \u0447\u0442\u0435\u043D\u0438\u0435: \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0441\u0442\u0438\u043B\u044F \u0438 \u0430\u0439\u0434\u0435\u043D\u0442\u0438\u043A\u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u0442\u043E\u043B\u044C\u043A\u043E Owner. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex flex-wrap gap-2"><button class="${ssrRenderClass([activeMainTab.value === "identity" ? "border-blue-400 bg-blue-50" : "border-gray-300", "rounded border px-3 py-1.5 text-sm"])}"> \u0410\u0439\u0434\u0435\u043D\u0442\u0438\u043A\u0430 </button><button class="${ssrRenderClass([activeMainTab.value === "contacts" ? "border-blue-400 bg-blue-50" : "border-gray-300", "rounded border px-3 py-1.5 text-sm"])}"> \u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B </button><button class="${ssrRenderClass([activeMainTab.value === "operations" ? "border-blue-400 bg-blue-50" : "border-gray-300", "rounded border px-3 py-1.5 text-sm"])}"> \u041E\u043F\u0435\u0440\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 </button><button class="${ssrRenderClass([activeMainTab.value === "styles" ? "border-blue-400 bg-blue-50" : "border-gray-300", "rounded border px-3 py-1.5 text-sm"])}"> \u0421\u0442\u0438\u043B\u0438 </button></div>`);
        if (activeMainTab.value === "identity") {
          _push(`<div class="space-y-4"><div class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2"><h2 class="md:col-span-2 text-sm font-semibold text-gray-900">\u0410\u0439\u0434\u0435\u043D\u0442\u0438\u043A\u0430</h2><label class="text-sm"><span class="mb-1 block text-gray-600">Slug</span><input${ssrRenderAttr("value", settings.slug)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">\u041F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435</span><input${ssrRenderAttr("value", settings.displayName)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="md:col-span-2 text-sm"><span class="mb-1 block text-gray-600">\u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0439 \u0441\u043B\u043E\u0433\u0430\u043D \u043F\u043E\u0434 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435\u043C</span><input${ssrRenderAttr("value", settings.tagline)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><span class="mt-1 block text-xs text-gray-500">\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u043F\u043E\u0434 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435\u043C \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430 \u0432 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0435 \u0438 \u043D\u0430 \u0432\u0438\u0442\u0440\u0438\u043D\u0435.</span></label><label class="text-sm"><span class="mb-1 block text-gray-600">\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F \u043A\u0443\u0445\u043D\u0438</span><div class="rounded-lg border border-gray-300 p-2">`);
          if (selectedCuisineTags.value.length) {
            _push(`<div class="mb-2 flex flex-wrap gap-1.5"><!--[-->`);
            ssrRenderList(selectedCuisineTags.value, (tag) => {
              _push(`<span class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">${ssrInterpolate(tag)} <button type="button" class="text-gray-500 hover:text-gray-700"> x </button></span>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<input${ssrRenderAttr("value", cuisineSearch.value)} class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""} placeholder="\u041F\u043E\u0438\u0441\u043A \u0442\u0435\u0433\u0430 \u043A\u0443\u0445\u043D\u0438..."><div class="mt-2 flex flex-wrap gap-1.5"><!--[-->`);
          ssrRenderList(filteredCuisineSuggestions.value, (tag) => {
            _push(`<button type="button" class="rounded-full border border-gray-300 px-2 py-0.5 text-xs hover:bg-gray-50 disabled:opacity-50">${ssrInterpolate(tag)}</button>`);
          });
          _push(`<!--]-->`);
          if (canAddCuisineTag.value) {
            _push(`<button type="button" class="rounded-full border border-blue-300 bg-blue-50 px-2 py-0.5 text-xs text-blue-700 hover:bg-blue-100 disabled:opacity-50"> \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C &quot;${ssrInterpolate(normalizedCuisineSearch.value)}&quot; </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></label><label class="text-sm"><span class="mb-1 block text-gray-600">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430</span><input${ssrRenderAttr("value", form.identity.name)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">\u041A\u043E\u0440\u043E\u0442\u043A\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 (\u0434\u043E 160)</span><input${ssrRenderAttr("value", form.identity.shortDescription)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="md:col-span-2 text-sm"><span class="mb-1 block text-gray-600">\u041F\u043E\u043B\u043D\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 (\u0434\u043E 1000)</span><textarea rows="4" class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}>${ssrInterpolate(form.identity.fullDescription)}</textarea></label><div class="md:col-span-2 grid gap-3 md:grid-cols-2"><label class="text-sm"><span class="mb-1 block text-gray-600">\u041B\u043E\u0433\u043E\u0442\u0438\u043F (\u043C\u0430\u043B\u0435\u043D\u044C\u043A\u0438\u0439, \u0434\u043B\u044F \u0448\u0430\u043F\u043A\u0438)</span><input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml"${ssrIncludeBooleanAttr(isReadonly.value || saving.value) ? " disabled" : ""}><p class="mt-1 text-xs text-gray-500">PNG/SVG/WebP, \u0434\u043E 2MB, \u043C\u0438\u043D\u0438\u043C\u0443\u043C 256x256.</p>`);
          if (form.identity.logoUrl) {
            _push(`<img${ssrRenderAttr("src", form.identity.logoUrl)} alt="logo" class="mt-2 h-14 w-14 rounded object-cover">`);
          } else {
            _push(`<!---->`);
          }
          _push(`</label><label class="text-sm"><span class="mb-1 block text-gray-600">\u041B\u043E\u0433\u043E\u0442\u0438\u043F (\u0431\u043E\u043B\u044C\u0448\u043E\u0439, \u0434\u043B\u044F \u0433\u043B\u0430\u0432\u043D\u043E\u0439)</span><input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml"${ssrIncludeBooleanAttr(isReadonly.value || saving.value) ? " disabled" : ""}><p class="mt-1 text-xs text-gray-500">\u0415\u0441\u043B\u0438 \u043D\u0435 \u0437\u0430\u0434\u0430\u043D, \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u0438\u0439 \u043B\u043E\u0433\u043E\u0442\u0438\u043F \u0438\u0437 \u0448\u0430\u043F\u043A\u0438.</p>`);
          if (form.identity.logoLargeUrl || form.identity.logoUrl) {
            _push(`<img${ssrRenderAttr("src", form.identity.logoLargeUrl || form.identity.logoUrl)} alt="logo-large" class="mt-2 h-14 w-auto rounded object-cover">`);
          } else {
            _push(`<!---->`);
          }
          _push(`</label><label class="text-sm"><span class="mb-1 block text-gray-600">Favicon</span><input type="file" accept="image/png,image/x-icon,image/svg+xml"${ssrIncludeBooleanAttr(isReadonly.value || saving.value) ? " disabled" : ""}>`);
          if (form.identity.faviconUrl) {
            _push(`<img${ssrRenderAttr("src", form.identity.faviconUrl)} alt="favicon" class="mt-2 h-10 w-10 rounded object-cover">`);
          } else {
            _push(`<!---->`);
          }
          _push(`</label><label class="text-sm"><span class="mb-1 block text-gray-600">\u041A\u0430\u0440\u0442\u0438\u043D\u043A\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430</span><input type="file" accept="image/png,image/jpeg,image/webp"${ssrIncludeBooleanAttr(isReadonly.value || saving.value) ? " disabled" : ""}>`);
          if (form.identity.restaurantCardImageUrl) {
            _push(`<img${ssrRenderAttr("src", form.identity.restaurantCardImageUrl)} alt="restaurant card" class="mt-2 h-16 w-full rounded object-cover">`);
          } else {
            _push(`<!---->`);
          }
          _push(`</label><label class="text-sm"><span class="mb-1 block text-gray-600">Hero image</span><input type="file" accept="image/png,image/jpeg,image/webp"${ssrIncludeBooleanAttr(isReadonly.value || saving.value) ? " disabled" : ""}>`);
          if (form.identity.heroImageUrl) {
            _push(`<img${ssrRenderAttr("src", form.identity.heroImageUrl)} alt="hero" class="mt-2 h-16 w-full rounded object-cover">`);
          } else {
            _push(`<!---->`);
          }
          _push(`</label></div></div><div class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2"><div><h2 class="text-sm font-semibold text-gray-900">\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0432 \u0430\u0433\u0440\u0435\u0433\u0430\u0442\u043E\u0440\u0435</h2><div class="mt-3 rounded-lg border border-gray-200 p-3" style="${ssrRenderStyle({ backgroundColor: form.tokens.surfaceBackground })}">`);
          _push(ssrRenderComponent(_component_OrganizationRestaurantPreviewCard, {
            "display-name": settings.displayName || form.identity.name,
            tagline: settings.tagline,
            description: form.identity.shortDescription,
            "logo-url": form.identity.logoUrl,
            "hero-image-url": form.identity.restaurantCardImageUrl || form.identity.heroImageUrl,
            "style-config": { tokens: form.tokens, radii: form.radii }
          }, null, _parent));
          _push(`</div></div><div><h2 class="text-sm font-semibold text-gray-900">\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0441\u0432\u043E\u0435\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B</h2><div class="mt-3 rounded-lg border border-gray-200 p-3" style="${ssrRenderStyle({ backgroundColor: form.tokens.surfaceBackground, color: form.tokens.textPrimary })}"><div class="rounded border p-3" style="${ssrRenderStyle({ backgroundColor: form.tokens.surfaceCard, borderRadius: `${form.radii.card}px` })}"><p class="text-sm font-semibold">${ssrInterpolate(settings.displayName || form.identity.name || "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430")}</p><p class="mt-1 text-xs" style="${ssrRenderStyle({ color: form.tokens.textMuted })}">${ssrInterpolate(form.identity.shortDescription || "\u041A\u043E\u0440\u043E\u0442\u043A\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435")}</p><button class="mt-3 px-3 py-1.5 text-sm" style="${ssrRenderStyle({ backgroundColor: form.tokens.brandPrimary, color: form.tokens.textOnPrimary, borderRadius: `${form.radii.button}px` })}">\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E</button></div></div></div></div><div class="flex flex-wrap gap-2"><button class="rounded border border-blue-500 bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"${ssrIncludeBooleanAttr(isReadonly.value || saving.value || !!validationErrors.value.length) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "\u0421\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u043C..." : "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0430\u0439\u0434\u0435\u043D\u0442\u0438\u043A\u0443")}</button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeMainTab.value === "contacts") {
          _push(`<div class="space-y-4"><div class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2"><h2 class="md:col-span-2 text-sm font-semibold text-gray-900">\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B</h2><label class="text-sm"><span class="mb-1 block text-gray-600">\u0422\u0435\u043B\u0435\u0444\u043E\u043D</span><input${ssrRenderAttr("value", settings.contacts.phone)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">Email</span><input${ssrRenderAttr("value", settings.contacts.email)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">MAX</span><input${ssrRenderAttr("value", settings.contacts.max)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">Telegram</span><input${ssrRenderAttr("value", settings.contacts.telegram)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><div class="md:col-span-2 rounded-lg border border-gray-200 p-3"><p class="text-sm font-medium text-gray-700">\u0420\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u044B \u0434\u043B\u044F \u043F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0433\u043E \u0444\u0443\u0442\u0435\u0440\u0430</p><p class="mt-1 text-xs text-gray-500"> \u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E\u0442\u0441\u044F \u043D\u0430 \u043F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0439 \u0432\u0438\u0442\u0440\u0438\u043D\u0435 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430. </p><div class="mt-3 grid gap-3 md:grid-cols-3"><label class="text-sm"><span class="mb-1 block text-gray-600">\u042E\u0440. \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 / \u0418\u041F \u0424\u0418\u041E</span><input${ssrRenderAttr("value", settings.legal.legalName)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">\u0418\u041D\u041D</span><input${ssrRenderAttr("value", settings.legal.inn)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""} inputmode="numeric"></label><label class="text-sm"><span class="mb-1 block text-gray-600">\u041E\u0413\u0420\u041D / \u041E\u0413\u0420\u041D\u0418\u041F</span><input${ssrRenderAttr("value", settings.legal.ogrn)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""} inputmode="numeric"></label></div></div></div><div class="flex flex-wrap gap-2"><button class="rounded border border-blue-500 bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"${ssrIncludeBooleanAttr(isReadonly.value || saving.value || !!validationErrors.value.length) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "\u0421\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u043C..." : "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u044B")}</button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeMainTab.value === "operations") {
          _push(`<div class="space-y-4"><div class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2"><h2 class="md:col-span-2 text-sm font-semibold text-gray-900">\u041E\u043F\u0435\u0440\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</h2><label class="text-sm"><span class="mb-1 block text-gray-600">\u0421\u0442\u0430\u0442\u0443\u0441</span><select class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><option value="open"${ssrIncludeBooleanAttr(Array.isArray(settings.ops.status) ? ssrLooseContain(settings.ops.status, "open") : ssrLooseEqual(settings.ops.status, "open")) ? " selected" : ""}>\u041E\u0442\u043A\u0440\u044B\u0442</option><option value="closed"${ssrIncludeBooleanAttr(Array.isArray(settings.ops.status) ? ssrLooseContain(settings.ops.status, "closed") : ssrLooseEqual(settings.ops.status, "closed")) ? " selected" : ""}>\u0417\u0430\u043A\u0440\u044B\u0442</option><option value="coming_soon"${ssrIncludeBooleanAttr(Array.isArray(settings.ops.status) ? ssrLooseContain(settings.ops.status, "coming_soon") : ssrLooseEqual(settings.ops.status, "coming_soon")) ? " selected" : ""}>\u0421\u043A\u043E\u0440\u043E \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u0435</option><option value="temporarily_unavailable"${ssrIncludeBooleanAttr(Array.isArray(settings.ops.status) ? ssrLooseContain(settings.ops.status, "temporarily_unavailable") : ssrLooseEqual(settings.ops.status, "temporarily_unavailable")) ? " selected" : ""}>\u0412\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D</option></select></label><label class="text-sm"><span class="mb-1 block text-gray-600">\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0437\u0430\u043A\u0430\u0437</span><input${ssrRenderAttr("value", settings.ops.minOrderAmount)} type="number" min="0" class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">\u0412\u0440\u0435\u043C\u044F \u043F\u0440\u0438\u0433\u043E\u0442\u043E\u0432\u043B\u0435\u043D\u0438\u044F (\u043C\u0438\u043D)</span><input${ssrRenderAttr("value", settings.ops.prepTimeMinutes)} type="number" min="0" class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438</span><input${ssrRenderAttr("value", settings.ops.deliveryFee)} type="number" min="0" class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u0430\u044F \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430 \u043E\u0442</span><input${ssrRenderAttr("value", settings.ops.freeDeliveryFrom)} type="number" min="0" class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><div class="md:col-span-2 rounded-lg border border-gray-200 p-3"><p class="text-sm font-medium text-gray-700">\u0421\u043F\u043E\u0441\u043E\u0431\u044B \u0440\u0430\u0431\u043E\u0442\u044B \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430</p><p class="mt-1 text-xs text-gray-500"> \u041E\u0431\u0449\u0438\u0435 \u0440\u0435\u0436\u0438\u043C\u044B. \u041D\u0430 \u0443\u0440\u043E\u0432\u043D\u0435 \u0444\u0438\u043B\u0438\u0430\u043B\u0430 \u0438\u0445 \u043C\u043E\u0436\u043D\u043E \u043E\u0442\u043A\u043B\u044E\u0447\u0430\u0442\u044C \u0442\u043E\u0447\u0435\u0447\u043D\u043E. </p><div class="mt-3 grid gap-2 md:grid-cols-2"><!--[-->`);
          ssrRenderList(fulfillmentOptions, (option) => {
            _push(`<label class="flex items-start gap-2 rounded border border-gray-200 p-2"><input type="checkbox" class="mt-0.5"${ssrIncludeBooleanAttr(settings.ops.fulfillmentTypes.includes(option.value)) ? " checked" : ""}${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><span><span class="block text-sm text-gray-700">${ssrInterpolate(option.label)}</span><span class="block text-xs text-gray-500">${ssrInterpolate(option.description)}</span></span></label>`);
          });
          _push(`<!--]--></div>`);
          if (settings.ops.fulfillmentTypes.includes("dine-in")) {
            _push(`<div class="mt-3 rounded border border-gray-200 bg-gray-50 p-3"><p class="text-sm font-medium text-gray-700">\u0412 \u0437\u0430\u043B\u0435: \u0441\u0446\u0435\u043D\u0430\u0440\u0438\u0439 \u0434\u043B\u044F \u0433\u043E\u0441\u0442\u044F</p><p class="mt-1 text-xs text-gray-500">\u041E\u0434\u0438\u043D \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u0441\u0446\u0435\u043D\u0430\u0440\u0438\u0439. \u0414\u043B\u044F \xAB\u0414\u043E \u0441\u0442\u043E\u043B\u0438\u043A\u0430\xBB \u043C\u043E\u0436\u043D\u043E \u0432\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0438 \u0432\u044B\u0437\u043E\u0432\u0430 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u0430 (\u0433\u043E\u0441\u0442\u0435\u0432\u043E\u0439 \u044D\u043A\u0440\u0430\u043D \u2014 \u043F\u043E\u0437\u0436\u0435).</p><div class="mt-2 space-y-2"><label class="flex items-start gap-2 rounded border border-gray-200 bg-white p-2 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(ssrLooseEqual(settings.ops.dineInHallMode, "qr-menu-browse")) ? " checked" : ""} type="radio" value="qr-menu-browse" class="mt-0.5"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><span><span class="font-medium">QR-\u043C\u0435\u043D\u044E</span><span class="block text-xs text-gray-500">\u0422\u043E\u043B\u044C\u043A\u043E \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043C\u0435\u043D\u044E, \u0431\u0435\u0437 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u044F \u0437\u0430\u043A\u0430\u0437\u0430.</span></span></label><label class="flex items-start gap-2 rounded border border-gray-200 bg-white p-2 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(ssrLooseEqual(settings.ops.dineInHallMode, "to-table")) ? " checked" : ""} type="radio" value="to-table" class="mt-0.5"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><span><span class="font-medium">\u0414\u043E \u0441\u0442\u043E\u043B\u0438\u043A\u0430</span><span class="block text-xs text-gray-500">\u0417\u0430\u043A\u0430\u0437 \u043F\u043E QR \u0441\u043E \u0441\u0442\u043E\u043B\u0438\u043A\u0430; \u0441\u0442\u043E\u043B \u0438 \u0432\u044B\u0437\u043E\u0432 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u0430.</span></span></label><label class="flex items-start gap-2 rounded border border-gray-200 bg-white p-2 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(ssrLooseEqual(settings.ops.dineInHallMode, "pickup-point")) ? " checked" : ""} type="radio" value="pickup-point" class="mt-0.5"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><span><span class="font-medium">\u041D\u0430 \u0432\u044B\u0434\u0430\u0447\u0443</span><span class="block text-xs text-gray-500">\u0417\u0430\u043A\u0430\u0437 \u043F\u043E QR, \u0432\u044B\u0434\u0430\u0447\u0430 \u0441 \u043E\u0431\u0449\u0435\u0439 \u0442\u043E\u0447\u043A\u0438.</span></span></label></div>`);
            if (settings.ops.dineInHallMode === "to-table") {
              _push(`<div class="mt-3 rounded border border-gray-200 bg-white p-3"><p class="text-sm font-medium text-gray-700">\u0413\u043B\u043E\u0431\u0430\u043B\u044C\u043D\u043E \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u043D\u044B\u0435 \u0441\u0435\u0440\u0432\u0438\u0441\u043D\u044B\u0435 \u0432\u044B\u0437\u043E\u0432\u044B (\u044D\u043A\u0440\u0430\u043D \u0441\u0442\u043E\u043B\u0430)</p><label class="mt-2 flex items-center gap-2 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(Array.isArray(settings.ops.dineInStaffButtons.waiter) ? ssrLooseContain(settings.ops.dineInStaffButtons.waiter, null) : settings.ops.dineInStaffButtons.waiter) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}> \u041F\u043E\u0437\u0432\u0430\u0442\u044C \u043E\u0444\u0438\u0446\u0438\u0430\u043D\u0442\u0430 </label><label class="mt-1 flex items-center gap-2 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(Array.isArray(settings.ops.dineInStaffButtons.hookah) ? ssrLooseContain(settings.ops.dineInStaffButtons.hookah, null) : settings.ops.dineInStaffButtons.hookah) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}> \u041F\u043E\u0437\u0432\u0430\u0442\u044C \u043A\u0430\u043B\u044C\u044F\u043D\u0449\u0438\u043A\u0430 </label><label class="mt-1 flex items-center gap-2 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(Array.isArray(settings.ops.dineInStaffButtons.requestBill) ? ssrLooseContain(settings.ops.dineInStaffButtons.requestBill, null) : settings.ops.dineInStaffButtons.requestBill) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}> \u0412\u044B\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0441\u0447\u0435\u0442 </label></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="md:col-span-2 rounded-lg border border-gray-200 p-3"><p class="text-sm font-medium text-gray-700">\u0413\u0440\u0430\u0444\u0438\u043A \u0440\u0430\u0431\u043E\u0442\u044B \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0430</p><p class="mt-1 text-xs text-gray-500"> \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u043A\u0430\u043A \u0431\u0430\u0437\u043E\u0432\u044B\u0439 \u0433\u0440\u0430\u0444\u0438\u043A \u0434\u043B\u044F \u0432\u0441\u0435\u0445 \u0444\u0438\u043B\u0438\u0430\u043B\u043E\u0432. \u0412 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0435 \u0444\u0438\u043B\u0438\u0430\u043B\u0430 \u0435\u0433\u043E \u043C\u043E\u0436\u043D\u043E \u043F\u0435\u0440\u0435\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u044C. </p><div class="mt-3 space-y-2"><!--[-->`);
          ssrRenderList(workingDayRows, (day) => {
            _push(`<div class="grid items-center gap-2 rounded border border-gray-200 bg-gray-50 px-2 py-2 md:grid-cols-[120px,120px,1fr,1fr]"><span class="text-sm text-gray-700">${ssrInterpolate(day.label)}</span><label class="inline-flex items-center gap-2 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(Array.isArray(settings.ops.workingHours[day.key].isOpen) ? ssrLooseContain(settings.ops.workingHours[day.key].isOpen, null) : settings.ops.workingHours[day.key].isOpen) ? " checked" : ""} type="checkbox"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}> \u041E\u0442\u043A\u0440\u044B\u0442\u043E </label><label class="text-sm"><span class="mb-1 block text-xs text-gray-500">\u041E\u0442\u043A\u0440\u044B\u0442\u0438\u0435</span><input${ssrRenderAttr("value", settings.ops.workingHours[day.key].openAt)} type="time" class="w-full rounded border border-gray-300 px-2 py-1.5"${ssrIncludeBooleanAttr(isReadonly.value || !settings.ops.workingHours[day.key].isOpen) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-xs text-gray-500">\u0417\u0430\u043A\u0440\u044B\u0442\u0438\u0435</span><input${ssrRenderAttr("value", settings.ops.workingHours[day.key].closeAt)} type="time" class="w-full rounded border border-gray-300 px-2 py-1.5"${ssrIncludeBooleanAttr(isReadonly.value || !settings.ops.workingHours[day.key].isOpen) ? " disabled" : ""}></label></div>`);
          });
          _push(`<!--]--></div></div><label class="text-sm"><span class="mb-1 block text-gray-600">\u041F\u0440\u0438\u043D\u044F\u0442\u0438\u0435 \u0437\u0430\u043A\u0430\u0437\u043E\u0432</span><select class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><option value="manual"${ssrIncludeBooleanAttr(Array.isArray(settings.ops.orderAcceptanceMode) ? ssrLooseContain(settings.ops.orderAcceptanceMode, "manual") : ssrLooseEqual(settings.ops.orderAcceptanceMode, "manual")) ? " selected" : ""}>\u0420\u0443\u0447\u043D\u043E\u0435</option><option value="auto"${ssrIncludeBooleanAttr(Array.isArray(settings.ops.orderAcceptanceMode) ? ssrLooseContain(settings.ops.orderAcceptanceMode, "auto") : ssrLooseEqual(settings.ops.orderAcceptanceMode, "auto")) ? " selected" : ""}>\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435</option></select></label><label class="text-sm"><span class="mb-1 block text-gray-600">\u0412\u0430\u043B\u044E\u0442\u0430</span><input${ssrRenderAttr("value", settings.locale.currency)} class="w-full rounded-lg border border-gray-300 px-3 py-2 uppercase"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">\u0427\u0430\u0441\u043E\u0432\u043E\u0439 \u043F\u043E\u044F\u0441</span><input${ssrRenderAttr("value", settings.locale.timezone)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm md:col-span-2"><span class="mb-1 block text-gray-600">\u041D\u0430\u043B\u043E\u0433\u043E\u0432\u044B\u0439 \u0440\u0435\u0436\u0438\u043C (\u0420\u0424)</span><select class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><option value="none"${ssrIncludeBooleanAttr(Array.isArray(settings.tax.vatMode) ? ssrLooseContain(settings.tax.vatMode, "none") : ssrLooseEqual(settings.tax.vatMode, "none")) ? " selected" : ""}>\u0411\u0435\u0437 \u041D\u0414\u0421</option><option value="included"${ssrIncludeBooleanAttr(Array.isArray(settings.tax.vatMode) ? ssrLooseContain(settings.tax.vatMode, "included") : ssrLooseEqual(settings.tax.vatMode, "included")) ? " selected" : ""}>\u041D\u0414\u0421 \u0432\u043A\u043B\u044E\u0447\u0435\u043D \u0432 \u0446\u0435\u043D\u0443</option><option value="excluded"${ssrIncludeBooleanAttr(Array.isArray(settings.tax.vatMode) ? ssrLooseContain(settings.tax.vatMode, "excluded") : ssrLooseEqual(settings.tax.vatMode, "excluded")) ? " selected" : ""}>\u041D\u0414\u0421 \u043D\u0430\u0447\u0438\u0441\u043B\u044F\u0435\u0442\u0441\u044F \u0441\u0432\u0435\u0440\u0445\u0443</option></select></label></div><div class="flex flex-wrap gap-2"><button class="rounded border border-blue-500 bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"${ssrIncludeBooleanAttr(isReadonly.value || saving.value || !!validationErrors.value.length) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "\u0421\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u043C..." : "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438")}</button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeMainTab.value === "styles") {
          _push(`<!--[--><div class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2"><div><h2 class="text-sm font-semibold text-gray-900">\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0441\u0442\u0438\u043B\u0435\u0439</h2><div class="mt-3 rounded-lg border border-gray-200 p-3" style="${ssrRenderStyle({ backgroundColor: form.tokens.surfaceBackground, color: form.tokens.textPrimary })}">`);
          _push(ssrRenderComponent(_component_OrganizationProductPreviewCard, {
            title: "\u041F\u0430\u0441\u0442\u0430 \u0441 \u0442\u0440\u044E\u0444\u0435\u043B\u044C\u043D\u044B\u043C \u0441\u043E\u0443\u0441\u043E\u043C",
            description: "\u0422\u043E\u0432\u0430\u0440\u043D\u043E\u0435 \u043F\u0440\u0435\u0432\u044C\u044E \u0441 \u0442\u0435\u043A\u0443\u0449\u0438\u043C\u0438 \u0446\u0432\u0435\u0442\u0430\u043C\u0438 \u0438 \u0441\u043A\u0440\u0443\u0433\u043B\u0435\u043D\u0438\u044F\u043C\u0438.",
            "image-url": form.identity.heroImageUrl,
            price: 490,
            "style-config": { tokens: form.tokens, radii: form.radii }
          }, null, _parent));
          _push(`<div class="mt-3 rounded border p-3" style="${ssrRenderStyle({ backgroundColor: form.tokens.surfaceCard, borderRadius: `${form.radii.modal}px` })}"><p class="text-sm font-semibold">\u041A\u043D\u043E\u043F\u043A\u0438</p><div class="mt-2 flex flex-wrap gap-2"><button class="px-3 py-1.5 text-xs" style="${ssrRenderStyle({ backgroundColor: form.tokens.brandPrimary, color: form.tokens.textOnPrimary, borderRadius: `${form.radii.button}px` })}">Primary</button><button class="px-3 py-1.5 text-xs" style="${ssrRenderStyle({ backgroundColor: form.tokens.brandSecondary, color: form.tokens.textPrimary, borderRadius: `${form.radii.button}px` })}">Secondary</button><button class="px-3 py-1.5 text-xs" style="${ssrRenderStyle({ backgroundColor: form.tokens.brandAccent, color: form.tokens.textOnPrimary, borderRadius: `${form.radii.button}px` })}">Accent</button></div></div></div>`);
          if (!isContrastOk.value) {
            _push(`<p class="mt-2 text-xs text-amber-700"> \u041F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435: \u043A\u043E\u043D\u0442\u0440\u0430\u0441\u0442 \`textPrimary\` \u043A \`surfaceBackground\` \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043D\u0438\u0436\u0435 AA. </p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div><h2 class="text-sm font-semibold text-gray-900">\u0427\u0442\u043E \u0438\u0437\u043C\u0435\u043D\u0438\u043B\u043E\u0441\u044C</h2><ul class="mt-2 space-y-1 text-sm"><!--[-->`);
          ssrRenderList(diffItems.value, (item) => {
            _push(`<li class="rounded bg-gray-50 px-2 py-1">${ssrInterpolate(item)}</li>`);
          });
          _push(`<!--]-->`);
          if (!diffItems.value.length) {
            _push(`<li class="text-gray-500">\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439 \u043D\u0435\u0442</li>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</ul></div></div><div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold text-gray-900">\u0413\u043E\u0442\u043E\u0432\u044B\u0435 \u043F\u0440\u0435\u0441\u0435\u0442\u044B</h2><div class="mt-3 grid gap-3 md:grid-cols-2"><!--[-->`);
          ssrRenderList(presets.value, (preset) => {
            _push(`<button class="${ssrRenderClass([preset.id === form.presetId ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white", "rounded-lg border p-3 text-left transition hover:border-gray-400"])}"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><div class="flex items-center justify-between"><strong class="text-sm">${ssrInterpolate(preset.title)}</strong><span class="text-xs text-gray-500">${ssrInterpolate(preset.id === form.presetId ? "\u0422\u0435\u043A\u0443\u0449\u0438\u0439" : "\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C")}</span></div><p class="mt-1 text-xs text-gray-600">${ssrInterpolate(preset.mood)}</p>`);
            if (preset.isSystem === false) {
              _push(`<p class="mt-1 text-[11px] text-violet-600">\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0439</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="mt-2 flex gap-2"><span class="h-4 w-4 rounded-full border border-gray-200" style="${ssrRenderStyle({ backgroundColor: preset.config.tokens.brandPrimary })}"></span><span class="h-4 w-4 rounded-full border border-gray-200" style="${ssrRenderStyle({ backgroundColor: preset.config.tokens.brandSecondary })}"></span><span class="h-4 w-4 rounded-full border border-gray-200" style="${ssrRenderStyle({ backgroundColor: preset.config.tokens.brandAccent })}"></span></div></button>`);
          });
          _push(`<!--]--></div><div class="mt-4 flex flex-wrap gap-2"><input${ssrRenderAttr("value", newPresetTitle.value)} class="w-64 rounded border border-gray-300 px-3 py-1.5 text-sm" placeholder="\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0433\u043E \u043F\u0440\u0435\u0441\u0435\u0442\u0430"${ssrIncludeBooleanAttr(isReadonly.value || saving.value) ? " disabled" : ""}><input${ssrRenderAttr("value", newPresetMood.value)} class="w-64 rounded border border-gray-300 px-3 py-1.5 text-sm" placeholder="\u041D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u0435 \u043F\u0440\u0435\u0441\u0435\u0442\u0430"${ssrIncludeBooleanAttr(isReadonly.value || saving.value) ? " disabled" : ""}><button class="rounded border border-violet-400 bg-violet-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"${ssrIncludeBooleanAttr(isReadonly.value || saving.value || !newPresetTitle.value.trim()) ? " disabled" : ""}> \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043A\u0430\u043A \u043D\u043E\u0432\u044B\u0439 \u043F\u0440\u0435\u0441\u0435\u0442 </button></div></div><div class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2"><h2 class="md:col-span-2 text-sm font-semibold text-gray-900">\u0426\u0432\u0435\u0442\u0430 \u0431\u0440\u0435\u043D\u0434\u0430</h2><!--[-->`);
          ssrRenderList(colorFields, (field) => {
            _push(`<label class="text-sm"><span class="mb-1 block text-gray-600">${ssrInterpolate(field.label)}</span><div class="flex items-center gap-2"><input type="color"${ssrRenderAttr("value", safeColor(form.tokens[field.key]))} class="h-9 w-11 cursor-pointer rounded border border-gray-300 bg-white p-1 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><input${ssrRenderAttr("value", form.tokens[field.key])} class="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs uppercase"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""} placeholder="#000000"><span class="h-8 w-8 rounded border border-gray-300" style="${ssrRenderStyle({ backgroundColor: safeColor(form.tokens[field.key]) })}"></span></div></label>`);
          });
          _push(`<!--]--></div><div class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2"><h2 class="md:col-span-2 text-sm font-semibold text-gray-900">\u0421\u043A\u0440\u0443\u0433\u043B\u0435\u043D\u0438\u044F</h2><!--[-->`);
          ssrRenderList(radiusFields, (field) => {
            _push(`<label class="text-sm"><span class="mb-1 block text-gray-600">${ssrInterpolate(field.label)} (0-32)</span><input${ssrRenderAttr("value", form.radii[field.key])} type="number" min="0" max="32" class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label>`);
          });
          _push(`<!--]--></div><div class="flex flex-wrap gap-2"><button class="rounded border border-blue-500 bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"${ssrIncludeBooleanAttr(isReadonly.value || saving.value || !!validationErrors.value.length) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "\u0421\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u043C..." : "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0441\u0442\u0438\u043B\u0438")}</button><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(isReadonly.value || saving.value || !hasRollback.value) ? " disabled" : ""}> \u0412\u0435\u0440\u043D\u0443\u0442\u044C \u043F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0438\u0439 \u0441\u0442\u0438\u043B\u044C </button></div><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (validationErrors.value.length) {
          _push(`<div class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><ul class="space-y-1"><!--[-->`);
          ssrRenderList(validationErrors.value, (item) => {
            _push(`<li>${ssrInterpolate(item)}</li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex flex-wrap gap-2"><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(isReadonly.value || saving.value) ? " disabled" : ""}> \u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u043D\u0435\u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043D\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F </button></div><div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold text-gray-900">Audit log</h2><ul class="mt-2 space-y-2 text-sm"><!--[-->`);
        ssrRenderList(auditLog.value, (item, idx) => {
          var _a;
          _push(`<li class="flex items-start justify-between gap-3 border-b border-gray-100 pb-2"><span>${ssrInterpolate(((_a = item.notes) == null ? void 0 : _a[0]) || item.action)}</span><span class="text-xs text-gray-500">${ssrInterpolate(formatDate(item.at))}</span></li>`);
        });
        _push(`<!--]-->`);
        if (!auditLog.value.length) {
          _push(`<li class="text-gray-500">\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0437\u0430\u043F\u0438\u0441\u0435\u0439.</li>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</ul></div><!--]-->`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/settings/organization.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
