import { y as defineEventHandler, aB as requireDashboardAccess, T as getQuery, aS as serverSupabaseServiceRole } from '../../../../nitro/nitro.mjs';
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

const notifications_get = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  const query = getQuery(event);
  const page = Math.max(Number(query.page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(query.pageSize) || 25, 1), 100);
  const restaurantId = typeof query.restaurantId === "string" ? query.restaurantId.trim() : "";
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  const client = await serverSupabaseServiceRole(event);
  const { data: shop } = await client.from("shops").select("channel_policy").eq("id", access.shopId).maybeSingle();
  let restaurantsQuery = client.from("restaurants").select("id,name,manager_notification_mode,manager_group_chat_id,manager_max_chat_id,manager_recipients,service_calls_enabled,service_call_types,integration_keys").eq("shop_id", access.shopId).order("created_at", { ascending: false });
  if (restaurantId) restaurantsQuery = restaurantsQuery.eq("id", restaurantId);
  const { data: restaurants } = await restaurantsQuery.range(from, to);
  const rows = restaurants != null ? restaurants : [];
  const pagedRows = rows.slice(0, pageSize);
  const restaurantIds = pagedRows.map((row) => row.id).filter(Boolean);
  let bindingsByRestaurant = /* @__PURE__ */ new Map();
  if (restaurantIds.length) {
    const { data: bindings } = await client.from("restaurant_staff_bot_bindings").select("id,restaurant_id,channel,external_user_id,staff_role,display_name,is_active,updated_at").in("restaurant_id", restaurantIds).order("updated_at", { ascending: false });
    const grouped = /* @__PURE__ */ new Map();
    for (const row of bindings || []) {
      const restaurantIdValue = String(row.restaurant_id || "");
      if (!restaurantIdValue) continue;
      const current = grouped.get(restaurantIdValue) || [];
      current.push({
        id: String(row.id),
        channel: String(row.channel),
        externalUserId: String(row.external_user_id || ""),
        staffRole: String(row.staff_role || ""),
        displayName: typeof row.display_name === "string" ? String(row.display_name) : "",
        isActive: Boolean(row.is_active)
      });
      grouped.set(restaurantIdValue, current);
    }
    bindingsByRestaurant = grouped;
  }
  return {
    ok: true,
    channelPolicy: (_a = shop == null ? void 0 : shop.channel_policy) != null ? _a : { primary: "telegram", secondary: "max", maxEnabled: false },
    restaurants: pagedRows.map((row) => {
      const integrationKeys = (row == null ? void 0 : row.integration_keys) && typeof row.integration_keys === "object" ? row.integration_keys : {};
      const rawEtaPresets = Array.isArray(integrationKeys.eta_presets) ? integrationKeys.eta_presets : [];
      const etaPresets = rawEtaPresets.map((value) => Number(value)).filter((value) => Number.isFinite(value) && value > 0).slice(0, 8);
      return {
        id: row.id,
        name: row.name,
        managerNotificationMode: row.manager_notification_mode || "group",
        managerGroupChatId: row.manager_group_chat_id || "",
        managerMaxChatId: row.manager_max_chat_id || "",
        managerRecipients: Array.isArray(row.manager_recipients) ? row.manager_recipients : [],
        serviceCallsEnabled: row.service_calls_enabled === true,
        serviceCallTypes: Array.isArray(row.service_call_types) ? row.service_call_types : ["call_waiter", "call_hookah", "request_bill"],
        staffBotBindings: bindingsByRestaurant.get(String(row.id)) || [],
        unifiedOrderFlowEnabled: true,
        etaButtonsEnabled: Boolean(integrationKeys.eta_buttons_enabled),
        etaPresets: etaPresets.length ? etaPresets : [10, 15, 20, 30, 45],
        etaRateLimitSec: (() => {
          const raw = Number(integrationKeys.eta_rate_limit_sec);
          if (!Number.isFinite(raw) || raw < 30) return 180;
          return Math.min(3600, Math.floor(raw));
        })()
      };
    }),
    pagination: {
      page,
      pageSize,
      hasNext: rows.length > pageSize,
      hasPrev: page > 1
    }
  };
});

export { notifications_get as default };
