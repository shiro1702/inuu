import { y as defineEventHandler, aA as readBody, t as createError, aS as serverSupabaseServiceRole } from '../../../nitro/nitro.mjs';
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

const linkTelegram_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.token)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token is required"
    });
  }
  const serviceClient = await serverSupabaseServiceRole(event);
  const { data: tokenRow, error: tokenError } = await serviceClient.from("auth_tokens").select("*").eq("token", body.token).maybeSingle();
  if (tokenError) {
    console.error("Error querying auth_tokens:", tokenError);
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
  const rawTg = tokenRow.telegram_id;
  const telegramId = typeof rawTg === "number" && Number.isFinite(rawTg) ? rawTg : typeof rawTg === "string" ? Number.parseInt(rawTg, 10) : Number(rawTg);
  if (!Number.isFinite(telegramId)) {
    throw createError({
      statusCode: 500,
      statusMessage: "Invalid telegram id on token"
    });
  }
  const { data: profileRows, error: profileError } = await serviceClient.from("profiles").select("id").eq("telegram_id", telegramId).limit(1);
  const existingProfile = (_a = profileRows == null ? void 0 : profileRows[0]) != null ? _a : null;
  if (profileError) {
    console.error("Error querying profiles by telegram_id:", profileError);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to link Telegram"
    });
  }
  let userId;
  if (existingProfile) {
    userId = existingProfile.id;
  } else {
    const syntheticEmail = `tg_${telegramId}@telegram.local`;
    const syntheticPassword = crypto.randomUUID();
    const { data: createdUser, error: createUserError } = await serviceClient.auth.admin.createUser({
      email: syntheticEmail,
      password: syntheticPassword,
      email_confirm: true,
      user_metadata: {
        telegram_id: telegramId
      }
    });
    if (createUserError || !(createdUser == null ? void 0 : createdUser.user)) {
      console.error("Error creating auth user for telegram_id:", createUserError);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create user for Telegram link"
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
      console.error("Error creating profile with telegram_id:", upsertError);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to link Telegram"
      });
    }
  }
  const { error: deleteError } = await serviceClient.from("auth_tokens").delete().eq("token", body.token);
  if (deleteError) {
    console.error("Error deleting used token:", deleteError);
  }
  return {
    success: true,
    telegramId,
    userId
  };
});

export { linkTelegram_post as default };
