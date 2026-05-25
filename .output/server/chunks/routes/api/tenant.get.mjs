import { y as defineEventHandler, T as getQuery, R as getOrganizationSettings, a0 as getStyleRecord, aS as serverSupabaseServiceRole, an as normalizeWeeklyWorkingHours, aJ as resolveEffectiveWorkingHours, aE as requireTenantShop } from '../../nitro/nitro.mjs';
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

const tenant_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const query = getQuery(event);
  const branchId = typeof query.branch_id === "string" && query.branch_id.trim() ? query.branch_id.trim() : typeof query.restaurant_id === "string" && query.restaurant_id.trim() ? query.restaurant_id.trim() : null;
  const tenantFromContext = event.context.tenant;
  if (tenantFromContext) {
    const shopId2 = tenantFromContext.shopId;
    let uiSettings2 = (_a = tenantFromContext.uiSettings) != null ? _a : {};
    let shopName2 = (_c = (_b = tenantFromContext.shop) == null ? void 0 : _b.name) != null ? _c : "";
    const orgSettings2 = await getOrganizationSettings(event, shopId2);
    let effectiveWorkingHours2 = orgSettings2.ops.workingHours;
    try {
      const record = await getStyleRecord(event, shopId2);
      const cfg = record.config;
      const nextSmallLogo = typeof cfg.identity.logoSmallUrl === "string" ? cfg.identity.logoSmallUrl.trim() : "";
      const nextLargeLogo = typeof cfg.identity.logoLargeUrl === "string" ? cfg.identity.logoLargeUrl.trim() : "";
      const nextLogo = nextSmallLogo || (typeof cfg.identity.logoUrl === "string" ? cfg.identity.logoUrl.trim() : "");
      const nextDesc = typeof cfg.identity.shortDescription === "string" ? cfg.identity.shortDescription.trim() : "";
      const fallbackLogo = typeof (uiSettings2 == null ? void 0 : uiSettings2.logo_url) === "string" ? uiSettings2.logo_url : "";
      const fallbackDesc = typeof (uiSettings2 == null ? void 0 : uiSettings2.description) === "string" ? uiSettings2.description : "";
      uiSettings2 = {
        ...uiSettings2,
        // MVP: если identity не заполнена — не ломаем старые shops.ui_settings.
        logo_url: nextLogo || fallbackLogo,
        logo_large_url: nextLargeLogo || nextLogo || fallbackLogo,
        description: nextDesc || fallbackDesc,
        ...deriveTenantThemeFromStyle(cfg),
        // Радиусы пробрасываем в theme-систему CSS vars.
        radius_button: `${cfg.radii.button}px`,
        radius_modal: `${cfg.radii.modal}px`,
        radius_input: `${cfg.radii.input}px`,
        radius_card: `${cfg.radii.card}px`,
        organization_timezone: orgSettings2.locale.timezone,
        organization_working_hours: orgSettings2.ops.workingHours,
        organization_dine_in_staff_buttons: orgSettings2.ops.dineInStaffButtons,
        effective_working_hours: effectiveWorkingHours2
      };
      shopName2 = cfg.identity.name || shopName2;
    } catch {
    }
    if (branchId) {
      try {
        const client = await serverSupabaseServiceRole(event);
        const branchRes = await client.from("restaurants").select("use_organization_working_hours,working_hours").eq("shop_id", shopId2).eq("id", branchId).eq("is_active", true).maybeSingle();
        if (branchRes.data) {
          const branchWorkingHours = normalizeWeeklyWorkingHours(branchRes.data.working_hours, orgSettings2.ops.workingHours);
          effectiveWorkingHours2 = resolveEffectiveWorkingHours(orgSettings2.ops.workingHours, {
            useOrganizationHours: branchRes.data.use_organization_working_hours !== false,
            workingHours: branchWorkingHours
          });
          uiSettings2 = {
            ...uiSettings2,
            effective_working_hours: effectiveWorkingHours2
          };
        }
      } catch {
      }
    }
    uiSettings2 = {
      ...uiSettings2,
      organization_timezone: orgSettings2.locale.timezone,
      organization_working_hours: orgSettings2.ops.workingHours,
      organization_dine_in_staff_buttons: orgSettings2.ops.dineInStaffButtons,
      effective_working_hours: effectiveWorkingHours2
    };
    return {
      ok: true,
      shopId: shopId2,
      tenantSlug: tenantFromContext.shop.slug,
      isCustomDomain: !!tenantFromContext.isCustomDomain,
      shop: {
        id: tenantFromContext.shop.id,
        slug: tenantFromContext.shop.slug,
        name: shopName2,
        legalName: tenantFromContext.shop.legal_name || null,
        inn: tenantFromContext.shop.inn || null,
        ogrn: tenantFromContext.shop.ogrn || null
      },
      uiSettings: uiSettings2
    };
  }
  const { shopId, shop } = await requireTenantShop(event);
  let uiSettings = (_d = shop.ui_settings) != null ? _d : {};
  let shopName = shop.name;
  const orgSettings = await getOrganizationSettings(event, shopId);
  let effectiveWorkingHours = orgSettings.ops.workingHours;
  try {
    const record = await getStyleRecord(event, shopId);
    const cfg = record.config;
    const nextSmallLogo = typeof cfg.identity.logoSmallUrl === "string" ? cfg.identity.logoSmallUrl.trim() : "";
    const nextLargeLogo = typeof cfg.identity.logoLargeUrl === "string" ? cfg.identity.logoLargeUrl.trim() : "";
    const nextLogo = nextSmallLogo || (typeof cfg.identity.logoUrl === "string" ? cfg.identity.logoUrl.trim() : "");
    const nextDesc = typeof cfg.identity.shortDescription === "string" ? cfg.identity.shortDescription.trim() : "";
    const fallbackLogo = typeof (uiSettings == null ? void 0 : uiSettings.logo_url) === "string" ? uiSettings.logo_url : "";
    const fallbackDesc = typeof (uiSettings == null ? void 0 : uiSettings.description) === "string" ? uiSettings.description : "";
    uiSettings = {
      ...uiSettings,
      logo_url: nextLogo || fallbackLogo,
      logo_large_url: nextLargeLogo || nextLogo || fallbackLogo,
      description: nextDesc || fallbackDesc,
      ...deriveTenantThemeFromStyle(cfg),
      radius_button: `${cfg.radii.button}px`,
      radius_modal: `${cfg.radii.modal}px`,
      radius_input: `${cfg.radii.input}px`,
      radius_card: `${cfg.radii.card}px`,
      organization_timezone: orgSettings.locale.timezone,
      organization_working_hours: orgSettings.ops.workingHours,
      organization_dine_in_staff_buttons: orgSettings.ops.dineInStaffButtons,
      effective_working_hours: effectiveWorkingHours
    };
    shopName = cfg.identity.name || shopName;
  } catch {
  }
  if (branchId) {
    try {
      const client = await serverSupabaseServiceRole(event);
      const branchRes = await client.from("restaurants").select("use_organization_working_hours,working_hours").eq("shop_id", shopId).eq("id", branchId).eq("is_active", true).maybeSingle();
      if (branchRes.data) {
        const branchWorkingHours = normalizeWeeklyWorkingHours(branchRes.data.working_hours, orgSettings.ops.workingHours);
        effectiveWorkingHours = resolveEffectiveWorkingHours(orgSettings.ops.workingHours, {
          useOrganizationHours: branchRes.data.use_organization_working_hours !== false,
          workingHours: branchWorkingHours
        });
        uiSettings = {
          ...uiSettings,
          effective_working_hours: effectiveWorkingHours
        };
      }
    } catch {
    }
  }
  uiSettings = {
    ...uiSettings,
    organization_timezone: orgSettings.locale.timezone,
    organization_working_hours: orgSettings.ops.workingHours,
    organization_dine_in_staff_buttons: orgSettings.ops.dineInStaffButtons,
    effective_working_hours: effectiveWorkingHours
  };
  return {
    ok: true,
    shopId: shop.id,
    tenantSlug: shop.slug,
    isCustomDomain: false,
    shop: {
      id: shop.id,
      slug: shop.slug,
      name: shopName,
      legalName: shop.legal_name || null,
      inn: shop.inn || null,
      ogrn: shop.ogrn || null
    },
    uiSettings
  };
});
function hexToRgb(hex) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return null;
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16)
  };
}
function mixHex(a, b, amount) {
  const aRgb = hexToRgb(a);
  const bRgb = hexToRgb(b);
  if (!aRgb || !bRgb) return a;
  const t = Math.max(0, Math.min(1, amount));
  const r = Math.round(aRgb.r * (1 - t) + bRgb.r * t);
  const g = Math.round(aRgb.g * (1 - t) + bRgb.g * t);
  const bl = Math.round(aRgb.b * (1 - t) + bRgb.b * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}
function derivePrimaryVariants(brandPrimary) {
  const primary = brandPrimary;
  return {
    primary,
    primary_50: mixHex(primary, "#ffffff", 0.85),
    primary_100: mixHex(primary, "#ffffff", 0.7),
    primary_600: mixHex(primary, "#000000", 0.25),
    primary_700: mixHex(primary, "#000000", 0.35)
  };
}
function deriveTenantThemeFromStyle(cfg) {
  return {
    ...derivePrimaryVariants(cfg.tokens.brandPrimary),
    on_primary: cfg.tokens.textOnPrimary,
    secondary: cfg.tokens.brandSecondary,
    accent: cfg.tokens.brandAccent,
    surface_background: cfg.tokens.surfaceBackground,
    surface_card: cfg.tokens.surfaceCard,
    text_primary: cfg.tokens.textPrimary,
    text_muted: cfg.tokens.textMuted,
    state_success: cfg.tokens.stateSuccess,
    state_warning: cfg.tokens.stateWarning,
    state_error: cfg.tokens.stateError
  };
}

export { tenant_get as default };
