import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { k as useRuntimeConfig } from './server.mjs';

const cityCache = /* @__PURE__ */ new Map();
function useCity(citySlugRef) {
  const route = useRoute();
  const config = useRuntimeConfig();
  const loading = ref(false);
  const error = ref(null);
  const city = ref(null);
  const slug = computed(() => {
    const param = route.params.city_slug;
    if (typeof param === "string" && param.trim()) return param.trim();
    if (Array.isArray(param) && typeof param[0] === "string") return param[0].trim();
    const fallback = config.public.defaultCitySlug;
    return typeof fallback === "string" && fallback.trim() ? fallback.trim() : "ulan-ude";
  });
  const cityBasePath = computed(() => `/${slug.value}`);
  const displayName = computed(() => {
    var _a, _b;
    return ((_a = city.value) == null ? void 0 : _a.editorialName) || ((_b = city.value) == null ? void 0 : _b.name) || "INUU";
  });
  async function load() {
    var _a;
    const key = slug.value;
    const cached = cityCache.get(key);
    if (cached) {
      city.value = cached;
      error.value = null;
      return cached;
    }
    loading.value = true;
    error.value = null;
    try {
      const res = await $fetch("/api/cities", { query: { slug: key } });
      if (!(res == null ? void 0 : res.ok) || !res.city) {
        city.value = null;
        error.value = "\u0413\u043E\u0440\u043E\u0434 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D";
        return null;
      }
      const dto = {
        id: res.city.id,
        name: res.city.name,
        slug: res.city.slug,
        timezone: res.city.timezone || "Asia/Irkutsk",
        editorialName: (_a = res.city.editorialName) != null ? _a : null
      };
      city.value = dto;
      cityCache.set(key, dto);
      return dto;
    } catch (e) {
      city.value = null;
      error.value = e instanceof Error ? e.message : "Failed to load city";
      return null;
    } finally {
      loading.value = false;
    }
  }
  watch(slug, () => {
    void load();
  }, { immediate: true });
  return {
    slug,
    city,
    cityId: computed(() => {
      var _a, _b;
      return (_b = (_a = city.value) == null ? void 0 : _a.id) != null ? _b : null;
    }),
    cityBasePath,
    displayName,
    loading,
    error,
    load
  };
}

export { useCity as u };
