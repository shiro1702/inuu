import { y as defineEventHandler, T as getQuery, t as createError, aS as serverSupabaseServiceRole } from '../../../nitro/nitro.mjs';
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

const maxLinkStatus_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const token = typeof query.token === "string" ? query.token.trim() : "";
  if (!token) {
    throw createError({ statusCode: 400, statusMessage: "token is required" });
  }
  const serviceClient = await serverSupabaseServiceRole(event);
  const { data: row, error } = await serviceClient.from("auth_tokens").select("max_user_id, expires_at, channel").eq("token", token).maybeSingle();
  if (error) {
    console.error("max-link-status query failed", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to check token" });
  }
  if (!row) {
    return { ok: true, state: "invalid" };
  }
  if (String(row.channel || "") !== "max") {
    return { ok: true, state: "invalid" };
  }
  const now = Date.now();
  const expiresAt = new Date(String(row.expires_at)).getTime();
  if (Number.isFinite(expiresAt) && expiresAt < now) {
    await serviceClient.from("auth_tokens").delete().eq("token", token);
    return { ok: true, state: "expired" };
  }
  const maxUser = row.max_user_id;
  if (maxUser != null && String(maxUser).trim() !== "") {
    return { ok: true, state: "ready" };
  }
  return { ok: true, state: "pending" };
});

export { maxLinkStatus_get as default };
