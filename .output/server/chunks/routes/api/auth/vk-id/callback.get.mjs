import { y as defineEventHandler, T as getQuery, t as createError, aS as serverSupabaseServiceRole, aQ as sendRedirect, F as exchangeVkCode, H as fetchVkUserInfo, j as buildAuthSiteLinkUrl, a$ as useRuntimeConfig } from '../../../../nitro/nitro.mjs';
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

function toErrorMessage(raw) {
  if (typeof raw !== "string") return "vk_oauth_failed";
  return encodeURIComponent(raw.slice(0, 200));
}
const callback_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g;
  const query = getQuery(event);
  const code = typeof query.code === "string" ? query.code.trim() : "";
  const state = typeof query.state === "string" ? query.state.trim() : "";
  const deviceId = typeof query.device_id === "string" ? query.device_id.trim() : "";
  const errorFromVk = typeof query.error === "string" ? query.error.trim() : "";
  const config = useRuntimeConfig();
  const appUrlBase = (config.appUrl || "").replace(/\/$/, "");
  const defaultCitySlug = typeof ((_a = config.public) == null ? void 0 : _a.defaultCitySlug) === "string" && config.public.defaultCitySlug.trim() ? config.public.defaultCitySlug.trim() : "ulan-ude";
  if (!state) {
    throw createError({ statusCode: 400, statusMessage: "state is required" });
  }
  const serviceClient = await serverSupabaseServiceRole(event);
  const { data: row, error: rowError } = await serviceClient.from("auth_tokens").select("token, channel, expires_at, vk_state, vk_code_verifier, vk_user_id, bridge_payload").eq("vk_state", state).maybeSingle();
  if (rowError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to read VK auth token" });
  }
  if (!row || String(row.channel || "") !== "vk") {
    throw createError({ statusCode: 400, statusMessage: "Invalid VK state" });
  }
  const token = String(row.token);
  const expiresAt = new Date(String(row.expires_at)).getTime();
  if (Number.isFinite(expiresAt) && expiresAt < Date.now()) {
    await serviceClient.from("auth_tokens").delete().eq("token", token);
    return sendRedirect(event, `/link-vk?token=${encodeURIComponent(token)}&error=token_expired`, 302);
  }
  if (errorFromVk) {
    return sendRedirect(event, `/link-vk?token=${encodeURIComponent(token)}&error=${toErrorMessage(errorFromVk)}`, 302);
  }
  if (!code) {
    return sendRedirect(event, `/link-vk?token=${encodeURIComponent(token)}&error=missing_code`, 302);
  }
  const vkClientId = String(((_b = config.public) == null ? void 0 : _b.vkIdClientId) || "").trim();
  const vkClientSecret = String(config.vkIdClientSecret || "").trim();
  const vkRedirectUri = String(config.vkIdRedirectUri || "").trim();
  const vkBaseUrl = String(config.vkIdBaseUrl || "").trim() || "https://id.vk.com";
  const codeVerifier = String(row.vk_code_verifier || "").trim();
  if (!vkClientId || !vkClientSecret || !vkRedirectUri || !codeVerifier) {
    throw createError({ statusCode: 500, statusMessage: "VK OAuth configuration is invalid" });
  }
  try {
    const tokenRes = await exchangeVkCode({
      baseUrl: vkBaseUrl,
      clientId: vkClientId,
      clientSecret: vkClientSecret,
      redirectUri: vkRedirectUri,
      code,
      codeVerifier,
      deviceId: deviceId || void 0,
      state
    });
    const accessToken = String(tokenRes.access_token || "").trim();
    if (!accessToken) throw new Error("missing_access_token");
    const userInfo = await fetchVkUserInfo({
      baseUrl: vkBaseUrl,
      accessToken
    });
    const vkUserRaw = (_d = (_c = userInfo == null ? void 0 : userInfo.user) == null ? void 0 : _c.user_id) != null ? _d : tokenRes.user_id;
    const vkUserId = vkUserRaw != null ? String(vkUserRaw).trim() : "";
    if (!vkUserId) throw new Error("missing_vk_user_id");
    const existingVk = String(row.vk_user_id || "").trim();
    if (existingVk && existingVk !== vkUserId) {
      return sendRedirect(event, `/link-vk?token=${encodeURIComponent(token)}&error=token_already_bound`, 302);
    }
    const bridgePayload = {
      ...row.bridge_payload || {},
      vk_email: typeof ((_e = userInfo == null ? void 0 : userInfo.user) == null ? void 0 : _e.email) === "string" ? userInfo.user.email : null,
      vk_phone: typeof ((_f = userInfo == null ? void 0 : userInfo.user) == null ? void 0 : _f.phone) === "string" ? userInfo.user.phone : null
    };
    if (!existingVk) {
      const { error: updErr } = await serviceClient.from("auth_tokens").update({
        vk_user_id: vkUserId,
        vk_device_id: deviceId || null,
        bridge_payload: bridgePayload
      }).eq("token", token).is("vk_user_id", null);
      if (updErr) {
        throw updErr;
      }
    } else {
      await serviceClient.from("auth_tokens").update({
        vk_device_id: deviceId || null,
        bridge_payload: bridgePayload
      }).eq("token", token);
    }
    const link = buildAuthSiteLinkUrl({
      linkPath: "link-vk",
      appUrlBase,
      defaultCitySlug,
      token,
      bridgePayload,
      tenantShop: (_g = event.context.tenant) == null ? void 0 : _g.shop
    });
    return sendRedirect(event, link, 302);
  } catch (err) {
    const status = (err == null ? void 0 : err.statusMessage) || (err == null ? void 0 : err.message) || "vk_oauth_failed";
    return sendRedirect(event, `/link-vk?token=${encodeURIComponent(token)}&error=${toErrorMessage(status)}`, 302);
  }
});

export { callback_get as default };
