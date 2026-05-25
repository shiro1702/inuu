import { defineComponent, ref, reactive, computed, watch, resolveComponent, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderStyle, ssrRenderComponent, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { u as useDashboardAccess } from "./useDashboardAccess-PseSveld.js";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/hookable/dist/index.mjs";
import "../server.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/unctx/dist/index.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/defu/dist/defu.mjs";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/ufo/dist/index.mjs";
import "@supabase/ssr";
import "/Users/arsalanbaranzaev/Desktop/projects/incity-new/node_modules/klona/dist/index.mjs";
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
      "Итальянская",
      "Японская",
      "Китайская",
      "Грузинская",
      "Корейская",
      "Европейская",
      "Веганская",
      "Стрит-фуд",
      "Пицца",
      "Бургеры",
      "Суши",
      "Кофейня"
    ];
    const fulfillmentOptions = [
      { value: "delivery", label: "Доставка", description: "Заказ с доставкой по адресу клиента." },
      { value: "pickup", label: "Самовывоз", description: "Клиент оформляет и забирает заказ сам." },
      { value: "dine-in", label: "В зале", description: "Гость в зале; подрежим (QR-просмотр, до столика, на выдачу) задаётся ниже." }
    ];
    const workingDayRows = [
      { key: "mon", label: "Понедельник" },
      { key: "tue", label: "Вторник" },
      { key: "wed", label: "Среда" },
      { key: "thu", label: "Четверг" },
      { key: "fri", label: "Пятница" },
      { key: "sat", label: "Суббота" },
      { key: "sun", label: "Воскресенье" }
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
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(settings.slug.trim().toLowerCase())) result.push("Slug должен быть в формате lowercase-kebab-case.");
      if (settings.displayName.trim().length < 2 || settings.displayName.trim().length > 60) result.push("Публичное название должно быть от 2 до 60 символов.");
      if (name.length < 2 || name.length > 60) result.push("Название должно быть от 2 до 60 символов.");
      if (form.identity.shortDescription.trim().length > 160) result.push("Короткое описание не должно превышать 160 символов.");
      if (form.identity.fullDescription.trim().length > 1e3) result.push("Полное описание не должно превышать 1000 символов.");
      for (const field of colorFields) {
        if (!/^#[0-9A-Fa-f]{6}$/.test(form.tokens[field.key])) {
          result.push(`Поле ${field.label} должно быть в формате #RRGGBB.`);
        }
      }
      for (const field of radiusFields) {
        const value = Number(form.radii[field.key]);
        if (!Number.isFinite(value) || value < 0 || value > 32) {
          result.push(`${field.label} должен быть в диапазоне 0-32.`);
        }
      }
      if (settings.contacts.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contacts.email)) {
        result.push("Некорректный email контакта.");
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
      if (form.identity.name !== baseline.identity.name) items.push("Изменено название ресторана");
      if (form.identity.shortDescription !== baseline.identity.shortDescription) items.push("Изменено короткое описание");
      if (form.identity.fullDescription !== baseline.identity.fullDescription) items.push("Изменено полное описание");
      if (form.identity.logoUrl !== baseline.identity.logoUrl) items.push("Обновлен URL основного логотипа");
      if (form.identity.faviconUrl !== baseline.identity.faviconUrl) items.push("Обновлен favicon");
      if (form.identity.restaurantCardImageUrl !== baseline.identity.restaurantCardImageUrl) items.push("Обновлена картинка карточки ресторана");
      if (form.identity.heroImageUrl !== baseline.identity.heroImageUrl) items.push("Обновлен hero image");
      if (originalSettings.value && settings.slug !== originalSettings.value.slug) items.push("Изменен slug");
      if (originalSettings.value && settings.displayName !== originalSettings.value.displayName) items.push("Изменено публичное название");
      for (const field of colorFields) {
        if (form.tokens[field.key] !== baseline.tokens[field.key]) items.push(`Изменен ${field.label}`);
      }
      for (const field of radiusFields) {
        if (form.radii[field.key] !== baseline.radii[field.key]) items.push(`Изменен ${field.label}`);
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
        _push(`<div class="${ssrRenderClass([toast.kind === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700", "pointer-events-auto flex items-start gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg"])}" role="status"><span class="min-w-0 flex-1 break-words">${ssrInterpolate(toast.message)}</span><button type="button" class="shrink-0 rounded px-1 leading-none text-gray-500 hover:bg-black/5 hover:text-gray-800" aria-label="Закрыть"> × </button></div>`);
      });
      _push(`<!--]--></div><div class="space-y-1"><h1 class="text-2xl font-semibold">Настройки организации</h1><p class="text-sm text-gray-600">Бренд, стиль и пресеты витрины ресторана.</p></div>`);
      if (loading.value) {
        _push(`<div class="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600"> Загружаем текущий стиль... </div>`);
      } else {
        _push(`<!--[-->`);
        if (isReadonly.value) {
          _push(`<div class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"> Режим только чтение: изменение стиля и айдентики доступно только Owner. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex flex-wrap gap-2"><button class="${ssrRenderClass([activeMainTab.value === "identity" ? "border-blue-400 bg-blue-50" : "border-gray-300", "rounded border px-3 py-1.5 text-sm"])}"> Айдентика </button><button class="${ssrRenderClass([activeMainTab.value === "contacts" ? "border-blue-400 bg-blue-50" : "border-gray-300", "rounded border px-3 py-1.5 text-sm"])}"> Контакты </button><button class="${ssrRenderClass([activeMainTab.value === "operations" ? "border-blue-400 bg-blue-50" : "border-gray-300", "rounded border px-3 py-1.5 text-sm"])}"> Операционные настройки </button><button class="${ssrRenderClass([activeMainTab.value === "styles" ? "border-blue-400 bg-blue-50" : "border-gray-300", "rounded border px-3 py-1.5 text-sm"])}"> Стили </button></div>`);
        if (activeMainTab.value === "identity") {
          _push(`<div class="space-y-4"><div class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2"><h2 class="md:col-span-2 text-sm font-semibold text-gray-900">Айдентика</h2><label class="text-sm"><span class="mb-1 block text-gray-600">Slug</span><input${ssrRenderAttr("value", settings.slug)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">Публичное название</span><input${ssrRenderAttr("value", settings.displayName)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="md:col-span-2 text-sm"><span class="mb-1 block text-gray-600">Короткий слоган под названием</span><input${ssrRenderAttr("value", settings.tagline)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><span class="mt-1 block text-xs text-gray-500">Показывается под названием ресторана в карточке и на витрине.</span></label><label class="text-sm"><span class="mb-1 block text-gray-600">Категория кухни</span><div class="rounded-lg border border-gray-300 p-2">`);
          if (selectedCuisineTags.value.length) {
            _push(`<div class="mb-2 flex flex-wrap gap-1.5"><!--[-->`);
            ssrRenderList(selectedCuisineTags.value, (tag) => {
              _push(`<span class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">${ssrInterpolate(tag)} <button type="button" class="text-gray-500 hover:text-gray-700"> x </button></span>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<input${ssrRenderAttr("value", cuisineSearch.value)} class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""} placeholder="Поиск тега кухни..."><div class="mt-2 flex flex-wrap gap-1.5"><!--[-->`);
          ssrRenderList(filteredCuisineSuggestions.value, (tag) => {
            _push(`<button type="button" class="rounded-full border border-gray-300 px-2 py-0.5 text-xs hover:bg-gray-50 disabled:opacity-50">${ssrInterpolate(tag)}</button>`);
          });
          _push(`<!--]-->`);
          if (canAddCuisineTag.value) {
            _push(`<button type="button" class="rounded-full border border-blue-300 bg-blue-50 px-2 py-0.5 text-xs text-blue-700 hover:bg-blue-100 disabled:opacity-50"> Добавить &quot;${ssrInterpolate(normalizedCuisineSearch.value)}&quot; </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></label><label class="text-sm"><span class="mb-1 block text-gray-600">Название ресторана</span><input${ssrRenderAttr("value", form.identity.name)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">Короткое описание (до 160)</span><input${ssrRenderAttr("value", form.identity.shortDescription)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="md:col-span-2 text-sm"><span class="mb-1 block text-gray-600">Полное описание (до 1000)</span><textarea rows="4" class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}>${ssrInterpolate(form.identity.fullDescription)}</textarea></label><div class="md:col-span-2 grid gap-3 md:grid-cols-2"><label class="text-sm"><span class="mb-1 block text-gray-600">Логотип (маленький, для шапки)</span><input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml"${ssrIncludeBooleanAttr(isReadonly.value || saving.value) ? " disabled" : ""}><p class="mt-1 text-xs text-gray-500">PNG/SVG/WebP, до 2MB, минимум 256x256.</p>`);
          if (form.identity.logoUrl) {
            _push(`<img${ssrRenderAttr("src", form.identity.logoUrl)} alt="logo" class="mt-2 h-14 w-14 rounded object-cover">`);
          } else {
            _push(`<!---->`);
          }
          _push(`</label><label class="text-sm"><span class="mb-1 block text-gray-600">Логотип (большой, для главной)</span><input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml"${ssrIncludeBooleanAttr(isReadonly.value || saving.value) ? " disabled" : ""}><p class="mt-1 text-xs text-gray-500">Если не задан, автоматически используется маленький логотип из шапки.</p>`);
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
          _push(`</label><label class="text-sm"><span class="mb-1 block text-gray-600">Картинка карточки ресторана</span><input type="file" accept="image/png,image/jpeg,image/webp"${ssrIncludeBooleanAttr(isReadonly.value || saving.value) ? " disabled" : ""}>`);
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
          _push(`</label></div></div><div class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2"><div><h2 class="text-sm font-semibold text-gray-900">Предпросмотр в агрегаторе</h2><div class="mt-3 rounded-lg border border-gray-200 p-3" style="${ssrRenderStyle({ backgroundColor: form.tokens.surfaceBackground })}">`);
          _push(ssrRenderComponent(_component_OrganizationRestaurantPreviewCard, {
            "display-name": settings.displayName || form.identity.name,
            tagline: settings.tagline,
            description: form.identity.shortDescription,
            "logo-url": form.identity.logoUrl,
            "hero-image-url": form.identity.restaurantCardImageUrl || form.identity.heroImageUrl,
            "style-config": { tokens: form.tokens, radii: form.radii }
          }, null, _parent));
          _push(`</div></div><div><h2 class="text-sm font-semibold text-gray-900">Предпросмотр своей страницы</h2><div class="mt-3 rounded-lg border border-gray-200 p-3" style="${ssrRenderStyle({ backgroundColor: form.tokens.surfaceBackground, color: form.tokens.textPrimary })}"><div class="rounded border p-3" style="${ssrRenderStyle({ backgroundColor: form.tokens.surfaceCard, borderRadius: `${form.radii.card}px` })}"><p class="text-sm font-semibold">${ssrInterpolate(settings.displayName || form.identity.name || "Название ресторана")}</p><p class="mt-1 text-xs" style="${ssrRenderStyle({ color: form.tokens.textMuted })}">${ssrInterpolate(form.identity.shortDescription || "Короткое описание")}</p><button class="mt-3 px-3 py-1.5 text-sm" style="${ssrRenderStyle({ backgroundColor: form.tokens.brandPrimary, color: form.tokens.textOnPrimary, borderRadius: `${form.radii.button}px` })}">Открыть меню</button></div></div></div></div><div class="flex flex-wrap gap-2"><button class="rounded border border-blue-500 bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"${ssrIncludeBooleanAttr(isReadonly.value || saving.value || !!validationErrors.value.length) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "Сохраняем..." : "Сохранить айдентику")}</button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeMainTab.value === "contacts") {
          _push(`<div class="space-y-4"><div class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2"><h2 class="md:col-span-2 text-sm font-semibold text-gray-900">Контакты</h2><label class="text-sm"><span class="mb-1 block text-gray-600">Телефон</span><input${ssrRenderAttr("value", settings.contacts.phone)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">Email</span><input${ssrRenderAttr("value", settings.contacts.email)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">MAX</span><input${ssrRenderAttr("value", settings.contacts.max)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">Telegram</span><input${ssrRenderAttr("value", settings.contacts.telegram)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><div class="md:col-span-2 rounded-lg border border-gray-200 p-3"><p class="text-sm font-medium text-gray-700">Реквизиты для публичного футера</p><p class="mt-1 text-xs text-gray-500"> Показываются на публичной витрине ресторана. </p><div class="mt-3 grid gap-3 md:grid-cols-3"><label class="text-sm"><span class="mb-1 block text-gray-600">Юр. наименование / ИП ФИО</span><input${ssrRenderAttr("value", settings.legal.legalName)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">ИНН</span><input${ssrRenderAttr("value", settings.legal.inn)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""} inputmode="numeric"></label><label class="text-sm"><span class="mb-1 block text-gray-600">ОГРН / ОГРНИП</span><input${ssrRenderAttr("value", settings.legal.ogrn)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""} inputmode="numeric"></label></div></div></div><div class="flex flex-wrap gap-2"><button class="rounded border border-blue-500 bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"${ssrIncludeBooleanAttr(isReadonly.value || saving.value || !!validationErrors.value.length) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "Сохраняем..." : "Сохранить контакты")}</button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeMainTab.value === "operations") {
          _push(`<div class="space-y-4"><div class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2"><h2 class="md:col-span-2 text-sm font-semibold text-gray-900">Операционные настройки</h2><label class="text-sm"><span class="mb-1 block text-gray-600">Статус</span><select class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><option value="open"${ssrIncludeBooleanAttr(Array.isArray(settings.ops.status) ? ssrLooseContain(settings.ops.status, "open") : ssrLooseEqual(settings.ops.status, "open")) ? " selected" : ""}>Открыт</option><option value="closed"${ssrIncludeBooleanAttr(Array.isArray(settings.ops.status) ? ssrLooseContain(settings.ops.status, "closed") : ssrLooseEqual(settings.ops.status, "closed")) ? " selected" : ""}>Закрыт</option><option value="coming_soon"${ssrIncludeBooleanAttr(Array.isArray(settings.ops.status) ? ssrLooseContain(settings.ops.status, "coming_soon") : ssrLooseEqual(settings.ops.status, "coming_soon")) ? " selected" : ""}>Скоро открытие</option><option value="temporarily_unavailable"${ssrIncludeBooleanAttr(Array.isArray(settings.ops.status) ? ssrLooseContain(settings.ops.status, "temporarily_unavailable") : ssrLooseEqual(settings.ops.status, "temporarily_unavailable")) ? " selected" : ""}>Временно недоступен</option></select></label><label class="text-sm"><span class="mb-1 block text-gray-600">Минимальный заказ</span><input${ssrRenderAttr("value", settings.ops.minOrderAmount)} type="number" min="0" class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">Время приготовления (мин)</span><input${ssrRenderAttr("value", settings.ops.prepTimeMinutes)} type="number" min="0" class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">Стоимость доставки</span><input${ssrRenderAttr("value", settings.ops.deliveryFee)} type="number" min="0" class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">Бесплатная доставка от</span><input${ssrRenderAttr("value", settings.ops.freeDeliveryFrom)} type="number" min="0" class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><div class="md:col-span-2 rounded-lg border border-gray-200 p-3"><p class="text-sm font-medium text-gray-700">Способы работы ресторана</p><p class="mt-1 text-xs text-gray-500"> Общие режимы. На уровне филиала их можно отключать точечно. </p><div class="mt-3 grid gap-2 md:grid-cols-2"><!--[-->`);
          ssrRenderList(fulfillmentOptions, (option) => {
            _push(`<label class="flex items-start gap-2 rounded border border-gray-200 p-2"><input type="checkbox" class="mt-0.5"${ssrIncludeBooleanAttr(settings.ops.fulfillmentTypes.includes(option.value)) ? " checked" : ""}${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><span><span class="block text-sm text-gray-700">${ssrInterpolate(option.label)}</span><span class="block text-xs text-gray-500">${ssrInterpolate(option.description)}</span></span></label>`);
          });
          _push(`<!--]--></div>`);
          if (settings.ops.fulfillmentTypes.includes("dine-in")) {
            _push(`<div class="mt-3 rounded border border-gray-200 bg-gray-50 p-3"><p class="text-sm font-medium text-gray-700">В зале: сценарий для гостя</p><p class="mt-1 text-xs text-gray-500">Один активный сценарий. Для «До столика» можно включить кнопки вызова персонала (гостевой экран — позже).</p><div class="mt-2 space-y-2"><label class="flex items-start gap-2 rounded border border-gray-200 bg-white p-2 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(ssrLooseEqual(settings.ops.dineInHallMode, "qr-menu-browse")) ? " checked" : ""} type="radio" value="qr-menu-browse" class="mt-0.5"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><span><span class="font-medium">QR-меню</span><span class="block text-xs text-gray-500">Только просмотр меню, без оформления заказа.</span></span></label><label class="flex items-start gap-2 rounded border border-gray-200 bg-white p-2 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(ssrLooseEqual(settings.ops.dineInHallMode, "to-table")) ? " checked" : ""} type="radio" value="to-table" class="mt-0.5"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><span><span class="font-medium">До столика</span><span class="block text-xs text-gray-500">Заказ по QR со столика; стол и вызов персонала.</span></span></label><label class="flex items-start gap-2 rounded border border-gray-200 bg-white p-2 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(ssrLooseEqual(settings.ops.dineInHallMode, "pickup-point")) ? " checked" : ""} type="radio" value="pickup-point" class="mt-0.5"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><span><span class="font-medium">На выдачу</span><span class="block text-xs text-gray-500">Заказ по QR, выдача с общей точки.</span></span></label></div>`);
            if (settings.ops.dineInHallMode === "to-table") {
              _push(`<div class="mt-3 rounded border border-gray-200 bg-white p-3"><p class="text-sm font-medium text-gray-700">Глобально разрешенные сервисные вызовы (экран стола)</p><label class="mt-2 flex items-center gap-2 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(Array.isArray(settings.ops.dineInStaffButtons.waiter) ? ssrLooseContain(settings.ops.dineInStaffButtons.waiter, null) : settings.ops.dineInStaffButtons.waiter) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}> Позвать официанта </label><label class="mt-1 flex items-center gap-2 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(Array.isArray(settings.ops.dineInStaffButtons.hookah) ? ssrLooseContain(settings.ops.dineInStaffButtons.hookah, null) : settings.ops.dineInStaffButtons.hookah) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}> Позвать кальянщика </label><label class="mt-1 flex items-center gap-2 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(Array.isArray(settings.ops.dineInStaffButtons.requestBill) ? ssrLooseContain(settings.ops.dineInStaffButtons.requestBill, null) : settings.ops.dineInStaffButtons.requestBill) ? " checked" : ""} type="checkbox" class="rounded border-gray-300"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}> Выставить счет </label></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="md:col-span-2 rounded-lg border border-gray-200 p-3"><p class="text-sm font-medium text-gray-700">График работы ресторана</p><p class="mt-1 text-xs text-gray-500"> Используется как базовый график для всех филиалов. В карточке филиала его можно переопределить. </p><div class="mt-3 space-y-2"><!--[-->`);
          ssrRenderList(workingDayRows, (day) => {
            _push(`<div class="grid items-center gap-2 rounded border border-gray-200 bg-gray-50 px-2 py-2 md:grid-cols-[120px,120px,1fr,1fr]"><span class="text-sm text-gray-700">${ssrInterpolate(day.label)}</span><label class="inline-flex items-center gap-2 text-sm text-gray-700"><input${ssrIncludeBooleanAttr(Array.isArray(settings.ops.workingHours[day.key].isOpen) ? ssrLooseContain(settings.ops.workingHours[day.key].isOpen, null) : settings.ops.workingHours[day.key].isOpen) ? " checked" : ""} type="checkbox"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}> Открыто </label><label class="text-sm"><span class="mb-1 block text-xs text-gray-500">Открытие</span><input${ssrRenderAttr("value", settings.ops.workingHours[day.key].openAt)} type="time" class="w-full rounded border border-gray-300 px-2 py-1.5"${ssrIncludeBooleanAttr(isReadonly.value || !settings.ops.workingHours[day.key].isOpen) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-xs text-gray-500">Закрытие</span><input${ssrRenderAttr("value", settings.ops.workingHours[day.key].closeAt)} type="time" class="w-full rounded border border-gray-300 px-2 py-1.5"${ssrIncludeBooleanAttr(isReadonly.value || !settings.ops.workingHours[day.key].isOpen) ? " disabled" : ""}></label></div>`);
          });
          _push(`<!--]--></div></div><label class="text-sm"><span class="mb-1 block text-gray-600">Принятие заказов</span><select class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><option value="manual"${ssrIncludeBooleanAttr(Array.isArray(settings.ops.orderAcceptanceMode) ? ssrLooseContain(settings.ops.orderAcceptanceMode, "manual") : ssrLooseEqual(settings.ops.orderAcceptanceMode, "manual")) ? " selected" : ""}>Ручное</option><option value="auto"${ssrIncludeBooleanAttr(Array.isArray(settings.ops.orderAcceptanceMode) ? ssrLooseContain(settings.ops.orderAcceptanceMode, "auto") : ssrLooseEqual(settings.ops.orderAcceptanceMode, "auto")) ? " selected" : ""}>Автоматическое</option></select></label><label class="text-sm"><span class="mb-1 block text-gray-600">Валюта</span><input${ssrRenderAttr("value", settings.locale.currency)} class="w-full rounded-lg border border-gray-300 px-3 py-2 uppercase"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm"><span class="mb-1 block text-gray-600">Часовой пояс</span><input${ssrRenderAttr("value", settings.locale.timezone)} class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label><label class="text-sm md:col-span-2"><span class="mb-1 block text-gray-600">Налоговый режим (РФ)</span><select class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><option value="none"${ssrIncludeBooleanAttr(Array.isArray(settings.tax.vatMode) ? ssrLooseContain(settings.tax.vatMode, "none") : ssrLooseEqual(settings.tax.vatMode, "none")) ? " selected" : ""}>Без НДС</option><option value="included"${ssrIncludeBooleanAttr(Array.isArray(settings.tax.vatMode) ? ssrLooseContain(settings.tax.vatMode, "included") : ssrLooseEqual(settings.tax.vatMode, "included")) ? " selected" : ""}>НДС включен в цену</option><option value="excluded"${ssrIncludeBooleanAttr(Array.isArray(settings.tax.vatMode) ? ssrLooseContain(settings.tax.vatMode, "excluded") : ssrLooseEqual(settings.tax.vatMode, "excluded")) ? " selected" : ""}>НДС начисляется сверху</option></select></label></div><div class="flex flex-wrap gap-2"><button class="rounded border border-blue-500 bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"${ssrIncludeBooleanAttr(isReadonly.value || saving.value || !!validationErrors.value.length) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "Сохраняем..." : "Сохранить операционные настройки")}</button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeMainTab.value === "styles") {
          _push(`<!--[--><div class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2"><div><h2 class="text-sm font-semibold text-gray-900">Предпросмотр стилей</h2><div class="mt-3 rounded-lg border border-gray-200 p-3" style="${ssrRenderStyle({ backgroundColor: form.tokens.surfaceBackground, color: form.tokens.textPrimary })}">`);
          _push(ssrRenderComponent(_component_OrganizationProductPreviewCard, {
            title: "Паста с трюфельным соусом",
            description: "Товарное превью с текущими цветами и скруглениями.",
            "image-url": form.identity.heroImageUrl,
            price: 490,
            "style-config": { tokens: form.tokens, radii: form.radii }
          }, null, _parent));
          _push(`<div class="mt-3 rounded border p-3" style="${ssrRenderStyle({ backgroundColor: form.tokens.surfaceCard, borderRadius: `${form.radii.modal}px` })}"><p class="text-sm font-semibold">Кнопки</p><div class="mt-2 flex flex-wrap gap-2"><button class="px-3 py-1.5 text-xs" style="${ssrRenderStyle({ backgroundColor: form.tokens.brandPrimary, color: form.tokens.textOnPrimary, borderRadius: `${form.radii.button}px` })}">Primary</button><button class="px-3 py-1.5 text-xs" style="${ssrRenderStyle({ backgroundColor: form.tokens.brandSecondary, color: form.tokens.textPrimary, borderRadius: `${form.radii.button}px` })}">Secondary</button><button class="px-3 py-1.5 text-xs" style="${ssrRenderStyle({ backgroundColor: form.tokens.brandAccent, color: form.tokens.textOnPrimary, borderRadius: `${form.radii.button}px` })}">Accent</button></div></div></div>`);
          if (!isContrastOk.value) {
            _push(`<p class="mt-2 text-xs text-amber-700"> Предупреждение: контраст \`textPrimary\` к \`surfaceBackground\` может быть ниже AA. </p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div><h2 class="text-sm font-semibold text-gray-900">Что изменилось</h2><ul class="mt-2 space-y-1 text-sm"><!--[-->`);
          ssrRenderList(diffItems.value, (item) => {
            _push(`<li class="rounded bg-gray-50 px-2 py-1">${ssrInterpolate(item)}</li>`);
          });
          _push(`<!--]-->`);
          if (!diffItems.value.length) {
            _push(`<li class="text-gray-500">Изменений нет</li>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</ul></div></div><div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold text-gray-900">Готовые пресеты</h2><div class="mt-3 grid gap-3 md:grid-cols-2"><!--[-->`);
          ssrRenderList(presets.value, (preset) => {
            _push(`<button class="${ssrRenderClass([preset.id === form.presetId ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white", "rounded-lg border p-3 text-left transition hover:border-gray-400"])}"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><div class="flex items-center justify-between"><strong class="text-sm">${ssrInterpolate(preset.title)}</strong><span class="text-xs text-gray-500">${ssrInterpolate(preset.id === form.presetId ? "Текущий" : "Применить")}</span></div><p class="mt-1 text-xs text-gray-600">${ssrInterpolate(preset.mood)}</p>`);
            if (preset.isSystem === false) {
              _push(`<p class="mt-1 text-[11px] text-violet-600">Пользовательский</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="mt-2 flex gap-2"><span class="h-4 w-4 rounded-full border border-gray-200" style="${ssrRenderStyle({ backgroundColor: preset.config.tokens.brandPrimary })}"></span><span class="h-4 w-4 rounded-full border border-gray-200" style="${ssrRenderStyle({ backgroundColor: preset.config.tokens.brandSecondary })}"></span><span class="h-4 w-4 rounded-full border border-gray-200" style="${ssrRenderStyle({ backgroundColor: preset.config.tokens.brandAccent })}"></span></div></button>`);
          });
          _push(`<!--]--></div><div class="mt-4 flex flex-wrap gap-2"><input${ssrRenderAttr("value", newPresetTitle.value)} class="w-64 rounded border border-gray-300 px-3 py-1.5 text-sm" placeholder="Название нового пресета"${ssrIncludeBooleanAttr(isReadonly.value || saving.value) ? " disabled" : ""}><input${ssrRenderAttr("value", newPresetMood.value)} class="w-64 rounded border border-gray-300 px-3 py-1.5 text-sm" placeholder="Настроение пресета"${ssrIncludeBooleanAttr(isReadonly.value || saving.value) ? " disabled" : ""}><button class="rounded border border-violet-400 bg-violet-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"${ssrIncludeBooleanAttr(isReadonly.value || saving.value || !newPresetTitle.value.trim()) ? " disabled" : ""}> Сохранить как новый пресет </button></div></div><div class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2"><h2 class="md:col-span-2 text-sm font-semibold text-gray-900">Цвета бренда</h2><!--[-->`);
          ssrRenderList(colorFields, (field) => {
            _push(`<label class="text-sm"><span class="mb-1 block text-gray-600">${ssrInterpolate(field.label)}</span><div class="flex items-center gap-2"><input type="color"${ssrRenderAttr("value", safeColor(form.tokens[field.key]))} class="h-9 w-11 cursor-pointer rounded border border-gray-300 bg-white p-1 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}><input${ssrRenderAttr("value", form.tokens[field.key])} class="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs uppercase"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""} placeholder="#000000"><span class="h-8 w-8 rounded border border-gray-300" style="${ssrRenderStyle({ backgroundColor: safeColor(form.tokens[field.key]) })}"></span></div></label>`);
          });
          _push(`<!--]--></div><div class="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2"><h2 class="md:col-span-2 text-sm font-semibold text-gray-900">Скругления</h2><!--[-->`);
          ssrRenderList(radiusFields, (field) => {
            _push(`<label class="text-sm"><span class="mb-1 block text-gray-600">${ssrInterpolate(field.label)} (0-32)</span><input${ssrRenderAttr("value", form.radii[field.key])} type="number" min="0" max="32" class="w-full rounded-lg border border-gray-300 px-3 py-2"${ssrIncludeBooleanAttr(isReadonly.value) ? " disabled" : ""}></label>`);
          });
          _push(`<!--]--></div><div class="flex flex-wrap gap-2"><button class="rounded border border-blue-500 bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"${ssrIncludeBooleanAttr(isReadonly.value || saving.value || !!validationErrors.value.length) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "Сохраняем..." : "Сохранить стили")}</button><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(isReadonly.value || saving.value || !hasRollback.value) ? " disabled" : ""}> Вернуть предыдущий стиль </button></div><!--]-->`);
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
        _push(`<div class="flex flex-wrap gap-2"><button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"${ssrIncludeBooleanAttr(isReadonly.value || saving.value) ? " disabled" : ""}> Отменить несохраненные изменения </button></div><div class="rounded-xl border border-gray-200 bg-white p-4"><h2 class="text-sm font-semibold text-gray-900">Audit log</h2><ul class="mt-2 space-y-2 text-sm"><!--[-->`);
        ssrRenderList(auditLog.value, (item, idx) => {
          _push(`<li class="flex items-start justify-between gap-3 border-b border-gray-100 pb-2"><span>${ssrInterpolate(item.notes?.[0] || item.action)}</span><span class="text-xs text-gray-500">${ssrInterpolate(formatDate(item.at))}</span></li>`);
        });
        _push(`<!--]-->`);
        if (!auditLog.value.length) {
          _push(`<li class="text-gray-500">Пока нет записей.</li>`);
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
export {
  _sfc_main as default
};
