import { y as defineEventHandler, aA as readBody, Z as getShopById, t as createError, aS as serverSupabaseServiceRole, a$ as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import { randomUUID } from 'node:crypto';
import { s as sanitizeAuthRedirectPath } from '../../../_/authRedirect.mjs';
import '@supabase/ssr';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:url';
import '@supabase/supabase-js';

function sanitizeInternalPath(path, defaultCitySlug) {
  return sanitizeAuthRedirectPath(path, defaultCitySlug);
}
const requestTelegramLink_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  const shopId = typeof (body == null ? void 0 : body.shopId) === "string" ? body.shopId.trim() : "";
  let shop = null;
  if (shopId) {
    shop = await getShopById(event, shopId);
    if (!shop) {
      throw createError({ statusCode: 404, statusMessage: "Shop not found" });
    }
  }
  const config = useRuntimeConfig();
  const defaultCitySlug = typeof ((_a = config.public) == null ? void 0 : _a.defaultCitySlug) === "string" && config.public.defaultCitySlug.trim() ? config.public.defaultCitySlug.trim() : "ulan-ude";
  const citySlug = typeof (body == null ? void 0 : body.citySlug) === "string" && body.citySlug.trim() ? body.citySlug.trim() : defaultCitySlug;
  const redirectPath = sanitizeInternalPath(body == null ? void 0 : body.redirectPath, defaultCitySlug);
  const serviceClient = await serverSupabaseServiceRole(event);
  let bridgePayload = {};
  const rawBridge = typeof (body == null ? void 0 : body.bridgeKey) === "string" ? body.bridgeKey.trim() : "";
  if (rawBridge && shop) {
    const { data: bridgeRow } = await serviceClient.from("auth_bridge_sessions").select("payload, shop_id, expires_at").eq("bridge_key", rawBridge).maybeSingle();
    const isExpired = (bridgeRow == null ? void 0 : bridgeRow.expires_at) ? new Date(String(bridgeRow.expires_at)).getTime() < Date.now() : true;
    const bridgeShop = (bridgeRow == null ? void 0 : bridgeRow.shop_id) != null ? String(bridgeRow.shop_id) : "";
    const matchesShop = bridgeShop === shop.id || bridgeShop === shop.slug;
    if (bridgeRow && !isExpired && matchesShop) {
      bridgePayload = { ...bridgeRow.payload };
      await serviceClient.from("auth_bridge_sessions").delete().eq("bridge_key", rawBridge);
    }
  }
  bridgePayload.link_context = {
    shop_slug: (shop == null ? void 0 : shop.slug) || void 0,
    city_slug: citySlug,
    redirect_path: redirectPath,
    custom_domain_hostname: (shop == null ? void 0 : shop.custom_domain) ? String(shop.custom_domain).trim() : null
  };
  const token = randomUUID();
  const { error } = await serviceClient.from("auth_tokens").insert({
    token,
    telegram_id: null,
    channel: "telegram",
    bridge_payload: bridgePayload
  });
  if (error) {
    console.error("request-telegram-link insert failed", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to create link token" });
  }
  const botStartParam = `link_${token}`;
  return {
    ok: true,
    token,
    botStartParam
  };
});

export { requestTelegramLink_post as default };
