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

const linkMax_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.token)) {
    throw createError({ statusCode: 400, statusMessage: "Token is required" });
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
  return {
    success: true,
    maxUserId: tokenRow.max_user_id || null,
    maxConversationId: tokenRow.max_conversation_id || null
  };
});

export { linkMax_post as default };
