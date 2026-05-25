import { y as defineEventHandler, aA as readBody, t as createError, aS as serverSupabaseServiceRole, a$ as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';
import '@supabase/ssr';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:url';

async function findAuthUserIdByEmail(serviceClient, email) {
  var _a;
  let page = 1;
  const perPage = 200;
  while (page <= 10) {
    const { data, error } = await serviceClient.auth.admin.listUsers({ page, perPage });
    if (error) return null;
    const users = (_a = data == null ? void 0 : data.users) != null ? _a : [];
    const hit = users.find((user) => (user.email || "").toLowerCase() === email.toLowerCase());
    if (hit == null ? void 0 : hit.id) return hit.id;
    if (users.length < perPage) break;
    page += 1;
  }
  return null;
}
const exchangeVkSession_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.token)) {
    throw createError({ statusCode: 400, statusMessage: "Token is required" });
  }
  const config = useRuntimeConfig();
  const supabaseUrl = config.supabaseUrl || "";
  const supabaseAnonKey = config.public.supabaseKey || "";
  if (!supabaseUrl || !supabaseAnonKey) {
    throw createError({ statusCode: 500, statusMessage: "Supabase URL or anon key missing" });
  }
  const serviceClient = await serverSupabaseServiceRole(event);
  const { data: tokenRow, error: tokenError } = await serviceClient.from("auth_tokens").select("*").eq("token", body.token).eq("channel", "vk").maybeSingle();
  if (tokenError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to check VK token" });
  }
  if (!tokenRow) {
    throw createError({ statusCode: 400, statusMessage: "Invalid VK token" });
  }
  if (new Date(tokenRow.expires_at).getTime() < Date.now()) {
    await serviceClient.from("auth_tokens").delete().eq("token", body.token);
    throw createError({ statusCode: 400, statusMessage: "Token expired" });
  }
  const vkUserId = String(tokenRow.vk_user_id || "").trim();
  if (!vkUserId) {
    throw createError({
      statusCode: 409,
      statusMessage: "VK confirmation pending"
    });
  }
  const bridgePayload = tokenRow.bridge_payload || {};
  const vkEmail = typeof bridgePayload.vk_email === "string" ? bridgePayload.vk_email.trim() : "";
  const vkPhone = typeof bridgePayload.vk_phone === "string" ? bridgePayload.vk_phone.trim() : "";
  const { data: existingProfile, error: profileError } = await serviceClient.from("profiles").select("id").eq("vk_user_id", vkUserId).maybeSingle();
  if (profileError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to prepare VK profile" });
  }
  const syntheticEmail = `vk_${vkUserId.replace(/[^a-zA-Z0-9._-]/g, "_")}@vk.local`;
  const secret = config.sessionSecret || "vk-session-secret";
  const syntheticPassword = crypto.createHash("sha256").update(`${vkUserId}:${secret}`).digest("hex");
  let userId;
  if (!existingProfile) {
    const { data: createdUser, error: createUserError } = await serviceClient.auth.admin.createUser({
      email: syntheticEmail,
      password: syntheticPassword,
      email_confirm: true,
      user_metadata: {
        vk_user_id: vkUserId,
        ...vkPhone ? { phone: vkPhone } : {}
      }
    });
    if (createUserError || !(createdUser == null ? void 0 : createdUser.user)) {
      throw createError({ statusCode: 500, statusMessage: "Failed to create VK user" });
    }
    userId = createdUser.user.id;
    const { error: upsertError } = await serviceClient.from("profiles").upsert(
      {
        id: userId,
        vk_user_id: vkUserId,
        vk_email: vkEmail || null,
        vk_phone: vkPhone || null
      },
      { onConflict: "id" }
    );
    if (upsertError) {
      throw createError({ statusCode: 500, statusMessage: "Failed to link VK profile" });
    }
  } else {
    userId = String(existingProfile.id);
    const { error: updateError } = await serviceClient.auth.admin.updateUserById(userId, {
      email: syntheticEmail,
      password: syntheticPassword,
      email_confirm: true
    });
    if (updateError) {
      const message = String(updateError.message || "").toLowerCase();
      const isEmailConflict = message.includes("email") && (message.includes("already") || message.includes("exists") || message.includes("duplicate"));
      if (!isEmailConflict) {
        throw createError({ statusCode: 500, statusMessage: "Failed to prepare existing VK user" });
      }
      const syntheticUserId = await findAuthUserIdByEmail(serviceClient, syntheticEmail);
      if (!syntheticUserId) {
        throw createError({ statusCode: 500, statusMessage: "Failed to repair VK user mapping" });
      }
      const { error: normalizeError } = await serviceClient.auth.admin.updateUserById(syntheticUserId, {
        password: syntheticPassword,
        email_confirm: true,
        user_metadata: {
          vk_user_id: vkUserId,
          ...vkPhone ? { phone: vkPhone } : {}
        }
      });
      if (normalizeError) {
        throw createError({ statusCode: 500, statusMessage: "Failed to normalize synthetic VK user" });
      }
      const { error: rebindError } = await serviceClient.from("profiles").update({
        id: syntheticUserId,
        vk_user_id: vkUserId,
        vk_email: vkEmail || null,
        vk_phone: vkPhone || null
      }).eq("id", userId);
      if (rebindError) {
        throw createError({ statusCode: 500, statusMessage: "Failed to rebind VK profile" });
      }
      userId = syntheticUserId;
    } else {
      await serviceClient.from("profiles").update({
        vk_user_id: vkUserId,
        vk_email: vkEmail || null,
        vk_phone: vkPhone || null
      }).eq("id", userId);
    }
  }
  const supabaseForAuth = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
  const { data: signInData, error: signInError } = await supabaseForAuth.auth.signInWithPassword({
    email: syntheticEmail,
    password: syntheticPassword
  });
  if (signInError || !(signInData == null ? void 0 : signInData.session)) {
    throw createError({ statusCode: 500, statusMessage: "Failed to create VK Supabase session" });
  }
  await serviceClient.from("auth_tokens").delete().eq("token", body.token);
  return {
    success: true,
    userId,
    vkUserId,
    bridge_payload: (_a = tokenRow.bridge_payload) != null ? _a : null,
    access_token: signInData.session.access_token,
    refresh_token: signInData.session.refresh_token,
    expires_in: signInData.session.expires_in
  };
});

export { exchangeVkSession_post as default };
