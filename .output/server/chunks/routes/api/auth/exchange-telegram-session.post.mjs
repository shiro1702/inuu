import { y as defineEventHandler, aA as readBody, t as createError, aS as serverSupabaseServiceRole, am as normalizePhone, I as findProfileIdByPhone, aV as setProfilePhone, a$ as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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
    if (error) {
      console.error("Error listing auth users in exchange-session:", error);
      return null;
    }
    const users = (_a = data == null ? void 0 : data.users) != null ? _a : [];
    const hit = users.find((user) => (user.email || "").toLowerCase() === email.toLowerCase());
    if (hit == null ? void 0 : hit.id) return hit.id;
    if (users.length < perPage) break;
    page += 1;
  }
  return null;
}
const exchangeTelegramSession_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.token)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token is required"
    });
  }
  const config = useRuntimeConfig();
  const supabaseUrl = config.supabaseUrl || "";
  const supabaseAnonKey = config.public.supabaseKey || "";
  if (!supabaseUrl || !supabaseAnonKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Supabase URL or anon key missing"
    });
  }
  const serviceClient = await serverSupabaseServiceRole(event);
  const { data: tokenRow, error: tokenError } = await serviceClient.from("auth_tokens").select("*").eq("token", body.token).maybeSingle();
  if (tokenError) {
    console.error("Error querying auth_tokens in exchange-session:", tokenError);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to check token"
    });
  }
  if (!tokenRow) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid token"
    });
  }
  const now = /* @__PURE__ */ new Date();
  const expiresAt = new Date(tokenRow.expires_at);
  if (expiresAt.getTime() < now.getTime()) {
    await serviceClient.from("auth_tokens").delete().eq("token", body.token);
    throw createError({
      statusCode: 400,
      statusMessage: "Token expired"
    });
  }
  if (tokenRow.telegram_id == null) {
    throw createError({
      statusCode: 409,
      statusMessage: "Telegram confirmation pending"
    });
  }
  const bridgeFromToken = tokenRow.bridge_payload || {};
  const sharedPhoneRaw = (_a = bridgeFromToken.telegram_shared_phone) != null ? _a : bridgeFromToken.shared_phone;
  const sharedPhone = typeof sharedPhoneRaw === "string" && sharedPhoneRaw.trim() ? normalizePhone(sharedPhoneRaw.trim()) : "";
  const rawTg = tokenRow.telegram_id;
  const telegramId = typeof rawTg === "number" && Number.isFinite(rawTg) ? rawTg : typeof rawTg === "string" ? Number.parseInt(rawTg, 10) : Number(rawTg);
  if (!Number.isFinite(telegramId)) {
    throw createError({
      statusCode: 500,
      statusMessage: "Invalid telegram id on token"
    });
  }
  const { data: profileRows, error: profileError } = await serviceClient.from("profiles").select("id").eq("telegram_id", telegramId).limit(1);
  const profileByTelegram = (_b = profileRows == null ? void 0 : profileRows[0]) != null ? _b : null;
  const profileByPhoneId = !profileByTelegram && sharedPhone ? await findProfileIdByPhone(serviceClient, sharedPhone) : null;
  const existingProfile = profileByTelegram || (profileByPhoneId ? { id: profileByPhoneId } : null);
  if (profileError) {
    console.error("Error querying profiles by telegram_id in exchange-session:", profileError);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to prepare session for Telegram"
    });
  }
  const syntheticEmail = `tg_${telegramId}@telegram.local`;
  const secret = config.sessionSecret || "telegram-session-secret";
  const syntheticPassword = crypto.createHash("sha256").update(String(telegramId) + ":" + secret).digest("hex");
  let userId;
  if (!existingProfile) {
    const { data: createdUser, error: createUserError } = await serviceClient.auth.admin.createUser({
      email: syntheticEmail,
      password: syntheticPassword,
      email_confirm: true,
      user_metadata: {
        telegram_id: telegramId,
        ...sharedPhone ? { phone: sharedPhone } : {}
      }
    });
    if (createUserError || !(createdUser == null ? void 0 : createdUser.user)) {
      console.error("Error creating auth user for telegram_id in exchange-session:", createUserError);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create user for Telegram"
      });
    }
    userId = createdUser.user.id;
    const { error: upsertError } = await serviceClient.from("profiles").upsert(
      {
        id: userId,
        telegram_id: telegramId
      },
      { onConflict: "id" }
    );
    if (upsertError) {
      console.error("Error creating profile with telegram_id in exchange-session:", upsertError);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to link Telegram profile"
      });
    }
  } else {
    userId = existingProfile.id;
    const { data: existingUserData, error: getUserError } = await serviceClient.auth.admin.getUserById(userId);
    if (getUserError) {
      console.error("Error fetching auth user for existing profile in exchange-session:", getUserError);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to prepare existing user for Telegram session"
      });
    }
    const existingAuthUser = (_c = existingUserData == null ? void 0 : existingUserData.user) != null ? _c : null;
    if (!existingAuthUser) {
      const { data: createdUser, error: createUserError } = await serviceClient.auth.admin.createUser({
        email: syntheticEmail,
        password: syntheticPassword,
        email_confirm: true,
        user_metadata: {
          telegram_id: telegramId,
          ...sharedPhone ? { phone: sharedPhone } : {}
        }
      });
      if (createUserError || !(createdUser == null ? void 0 : createdUser.user)) {
        console.error(
          "Error creating auth user for orphaned profile in exchange-session:",
          createUserError
        );
        throw createError({
          statusCode: 500,
          statusMessage: "Failed to repair Telegram user"
        });
      }
      userId = createdUser.user.id;
      const { error: upsertError } = await serviceClient.from("profiles").upsert(
        {
          id: userId,
          telegram_id: telegramId
        },
        { onConflict: "id" }
      );
      if (upsertError) {
        console.error(
          "Error updating profile for orphaned user in exchange-session:",
          upsertError
        );
        throw createError({
          statusCode: 500,
          statusMessage: "Failed to link repaired Telegram profile"
        });
      }
    } else {
      const { error: updateError } = await serviceClient.auth.admin.updateUserById(userId, {
        email: syntheticEmail,
        password: syntheticPassword,
        email_confirm: true
      });
      if (updateError) {
        console.warn("Primary updateUserById failed, trying repair path in exchange-session:", updateError);
        let syntheticUserId = await findAuthUserIdByEmail(serviceClient, syntheticEmail);
        if (!syntheticUserId) {
          const { data: createdSyntheticUser, error: createSyntheticError } = await serviceClient.auth.admin.createUser({
            email: syntheticEmail,
            password: syntheticPassword,
            email_confirm: true,
            user_metadata: {
              telegram_id: telegramId,
              ...sharedPhone ? { phone: sharedPhone } : {}
            }
          });
          if (createSyntheticError || !((_d = createdSyntheticUser == null ? void 0 : createdSyntheticUser.user) == null ? void 0 : _d.id)) {
            console.error("Error creating synthetic auth user during repair in exchange-session:", createSyntheticError);
            throw createError({
              statusCode: 500,
              statusMessage: "Failed to prepare existing Telegram user"
            });
          }
          syntheticUserId = createdSyntheticUser.user.id;
        }
        const { error: normalizeSyntheticError } = await serviceClient.auth.admin.updateUserById(syntheticUserId, {
          password: syntheticPassword,
          email_confirm: true,
          user_metadata: {
            telegram_id: telegramId,
            ...sharedPhone ? { phone: sharedPhone } : {}
          }
        });
        if (normalizeSyntheticError) {
          console.error("Error normalizing synthetic auth user in exchange-session:", normalizeSyntheticError);
          throw createError({
            statusCode: 500,
            statusMessage: "Failed to normalize synthetic Telegram user"
          });
        }
        const { error: rebindError } = await serviceClient.from("profiles").update({ id: syntheticUserId, telegram_id: telegramId }).eq("id", userId).eq("telegram_id", telegramId);
        if (rebindError) {
          console.error("Error rebinding profile to synthetic user in exchange-session:", rebindError);
          throw createError({
            statusCode: 500,
            statusMessage: "Failed to rebind Telegram profile"
          });
        }
        userId = syntheticUserId;
      }
    }
  }
  const supabaseForAuth = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
  const { data: signInData, error: signInError } = await supabaseForAuth.auth.signInWithPassword({
    email: syntheticEmail,
    password: syntheticPassword
  });
  if (signInError || !(signInData == null ? void 0 : signInData.session)) {
    console.error("Error signing in synthetic user for Telegram:", signInError);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create Supabase session"
    });
  }
  const session = signInData.session;
  await serviceClient.from("profiles").update({ telegram_id: telegramId }).eq("id", userId);
  if (sharedPhone) {
    await setProfilePhone(serviceClient, userId, sharedPhone);
  }
  const { error: deleteError } = await serviceClient.from("auth_tokens").delete().eq("token", body.token);
  if (deleteError) {
    console.error("Error deleting auth_token in exchange-session:", deleteError);
  }
  return {
    success: true,
    userId,
    telegramId,
    bridge_payload: (_e = tokenRow.bridge_payload) != null ? _e : null,
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: session.expires_in
  };
});

export { exchangeTelegramSession_post as default };
