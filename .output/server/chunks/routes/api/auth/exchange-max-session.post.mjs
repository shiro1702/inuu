import { y as defineEventHandler, aA as readBody, t as createError, aS as serverSupabaseServiceRole, am as normalizePhone, aT as serverSupabaseUser, ai as migrateCustomerDeliveryAddresses, aV as setProfilePhone, I as findProfileIdByPhone, a$ as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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
const exchangeMaxSession_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
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
  const { data: tokenRow, error: tokenError } = await serviceClient.from("auth_tokens").select("*").eq("token", body.token).eq("channel", "max").maybeSingle();
  if (tokenError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to check MAX token" });
  }
  if (!tokenRow) {
    throw createError({ statusCode: 400, statusMessage: "Invalid MAX token" });
  }
  if (new Date(tokenRow.expires_at).getTime() < Date.now()) {
    await serviceClient.from("auth_tokens").delete().eq("token", body.token);
    throw createError({ statusCode: 400, statusMessage: "Token expired" });
  }
  const maxUserId = String(tokenRow.max_user_id || "").trim();
  if (!maxUserId) {
    throw createError({
      statusCode: 409,
      statusMessage: "MAX confirmation pending"
    });
  }
  const maxConversationId = String(tokenRow.max_conversation_id || "").trim() || null;
  const bridgePayload = tokenRow.bridge_payload || {};
  const sharedPhoneRaw = bridgePayload.max_shared_phone;
  const sharedPhone = typeof sharedPhoneRaw === "string" && sharedPhoneRaw.trim() ? normalizePhone(sharedPhoneRaw.trim()) : "";
  const linkProfileRaw = bridgePayload.link_profile_id;
  const linkProfileId = typeof linkProfileRaw === "string" && linkProfileRaw.trim() ? linkProfileRaw.trim() : "";
  if (linkProfileId) {
    const supabaseUser = await serverSupabaseUser(event);
    const sessionUid = (() => {
      const u = supabaseUser;
      const id = typeof (u == null ? void 0 : u.id) === "string" ? u.id.trim() : "";
      if (id) return id;
      return typeof (u == null ? void 0 : u.sub) === "string" ? u.sub.trim() : "";
    })();
    if (!sessionUid || sessionUid !== linkProfileId) {
      throw createError({
        statusCode: 403,
        statusMessage: "\u0412\u043E\u0439\u0434\u0438\u0442\u0435 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435 \u0432 \u044D\u0442\u043E\u043C \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435 \u043F\u043E\u0434 \u0442\u0435\u043C \u0436\u0435 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u043E\u043C \u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0443 MAX \u0441\u043D\u043E\u0432\u0430."
      });
    }
    const { data: holder, error: holderErr } = await serviceClient.from("profiles").select("id").eq("max_user_id", maxUserId).maybeSingle();
    if (holderErr) {
      throw createError({ statusCode: 500, statusMessage: "Failed to resolve MAX profile holder" });
    }
    const maxHolderId = (holder == null ? void 0 : holder.id) ? String(holder.id) : null;
    if (maxHolderId && maxHolderId !== linkProfileId) {
      await migrateCustomerDeliveryAddresses(serviceClient, maxHolderId, linkProfileId);
      await serviceClient.from("profiles").update({ max_user_id: null, max_conversation_id: null }).eq("id", maxHolderId);
    }
    const { error: attachErr } = await serviceClient.from("profiles").update({
      max_user_id: maxUserId,
      max_conversation_id: maxConversationId
    }).eq("id", linkProfileId);
    if (attachErr) {
      throw createError({ statusCode: 500, statusMessage: "Failed to attach MAX to profile" });
    }
    const { data: authUser, error: authReadErr } = await serviceClient.auth.admin.getUserById(linkProfileId);
    if (authReadErr || !(authUser == null ? void 0 : authUser.user)) {
      throw createError({ statusCode: 500, statusMessage: "Failed to read auth user for MAX link" });
    }
    const meta = (_a = authUser.user.user_metadata) != null ? _a : {};
    await serviceClient.auth.admin.updateUserById(linkProfileId, {
      user_metadata: {
        ...meta,
        max_user_id: maxUserId,
        ...maxConversationId ? { max_conversation_id: maxConversationId } : {}
      }
    });
    if (sharedPhone) {
      await setProfilePhone(serviceClient, linkProfileId, sharedPhone);
    }
    await serviceClient.from("auth_tokens").delete().eq("token", body.token);
    return {
      success: true,
      userId: linkProfileId,
      maxUserId,
      bridge_payload: (_b = tokenRow.bridge_payload) != null ? _b : null,
      session_unchanged: true
    };
  }
  const { data: existingProfileByMax, error: profileError } = await serviceClient.from("profiles").select("id").eq("max_user_id", maxUserId).maybeSingle();
  if (profileError) {
    throw createError({ statusCode: 500, statusMessage: "Failed to prepare MAX profile" });
  }
  const syntheticEmail = `max_${maxUserId.replace(/[^a-zA-Z0-9._-]/g, "_")}@max.local`;
  const secret = config.sessionSecret || "max-session-secret";
  const syntheticPassword = crypto.createHash("sha256").update(`${maxUserId}:${secret}`).digest("hex");
  let userId;
  const existingProfileByPhoneId = !existingProfileByMax && sharedPhone ? await findProfileIdByPhone(serviceClient, sharedPhone) : null;
  const existingProfile = existingProfileByMax || (existingProfileByPhoneId ? { id: existingProfileByPhoneId } : null);
  if (!existingProfile) {
    const { data: createdUser, error: createUserError } = await serviceClient.auth.admin.createUser({
      email: syntheticEmail,
      password: syntheticPassword,
      email_confirm: true,
      user_metadata: {
        max_user_id: maxUserId,
        ...sharedPhone ? { phone: sharedPhone } : {}
      }
    });
    if (createUserError || !(createdUser == null ? void 0 : createdUser.user)) {
      throw createError({ statusCode: 500, statusMessage: "Failed to create MAX user" });
    }
    userId = createdUser.user.id;
    const { error: upsertError } = await serviceClient.from("profiles").upsert(
      {
        id: userId,
        max_user_id: maxUserId,
        max_conversation_id: maxConversationId
      },
      { onConflict: "id" }
    );
    if (upsertError) {
      throw createError({ statusCode: 500, statusMessage: "Failed to link MAX profile" });
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
        throw createError({ statusCode: 500, statusMessage: "Failed to prepare existing MAX user" });
      }
      const syntheticUserId = await findAuthUserIdByEmail(serviceClient, syntheticEmail);
      if (!syntheticUserId) {
        throw createError({ statusCode: 500, statusMessage: "Failed to repair MAX user mapping" });
      }
      const { error: normalizeError } = await serviceClient.auth.admin.updateUserById(syntheticUserId, {
        password: syntheticPassword,
        email_confirm: true,
        user_metadata: {
          max_user_id: maxUserId,
          ...sharedPhone ? { phone: sharedPhone } : {}
        }
      });
      if (normalizeError) {
        throw createError({ statusCode: 500, statusMessage: "Failed to normalize synthetic MAX user" });
      }
      const { error: rebindError } = await serviceClient.from("profiles").update({
        id: syntheticUserId,
        max_user_id: maxUserId,
        max_conversation_id: maxConversationId
      }).eq("id", userId);
      if (rebindError) {
        throw createError({ statusCode: 500, statusMessage: "Failed to rebind MAX profile" });
      }
      userId = syntheticUserId;
    } else {
      await serviceClient.from("profiles").update({ max_user_id: maxUserId, max_conversation_id: maxConversationId }).eq("id", userId);
    }
  }
  const supabaseForAuth = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
  const { data: signInData, error: signInError } = await supabaseForAuth.auth.signInWithPassword({
    email: syntheticEmail,
    password: syntheticPassword
  });
  if (signInError || !(signInData == null ? void 0 : signInData.session)) {
    throw createError({ statusCode: 500, statusMessage: "Failed to create MAX Supabase session" });
  }
  await serviceClient.from("profiles").update({ max_user_id: maxUserId, max_conversation_id: maxConversationId }).eq("id", userId);
  if (sharedPhone) {
    await setProfilePhone(serviceClient, userId, sharedPhone);
  }
  await serviceClient.from("auth_tokens").delete().eq("token", body.token);
  return {
    success: true,
    userId,
    maxUserId,
    bridge_payload: (_c = tokenRow.bridge_payload) != null ? _c : null,
    access_token: signInData.session.access_token,
    refresh_token: signInData.session.refresh_token,
    expires_in: signInData.session.expires_in
  };
});

export { exchangeMaxSession_post as default };
