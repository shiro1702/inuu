import { y as defineEventHandler, Y as getRouterParam, t as createError, aA as readBody, aE as requireTenantShop, aK as resolveFestivalOrThrow, aH as resolveCustomerIdentityOrThrow, aS as serverSupabaseServiceRole } from '../../../../../nitro/nitro.mjs';
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

const ALLOWED_MIME = /* @__PURE__ */ new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "image/jpeg",
  "image/png",
  "image/webp"
]);
const MAX_SIZE_BYTES = 20 * 1024 * 1024;
function sanitizeFileName(input) {
  const cleaned = input.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80) || "upload";
  return cleaned.replace(/\.[a-zA-Z0-9]+$/, "");
}
function getExtension(fileName, mimeType) {
  var _a;
  const fromName = (_a = fileName.split(".").pop()) == null ? void 0 : _a.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;
  if (mimeType === "video/mp4") return "mp4";
  if (mimeType === "video/webm") return "webm";
  if (mimeType === "video/quicktime") return "mov";
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "bin";
}
const upload_post = defineEventHandler(async (event) => {
  const festivalSlug = getRouterParam(event, "festival_slug");
  if (!festivalSlug) {
    throw createError({ statusCode: 400, statusMessage: "festival_slug is required" });
  }
  const body = await readBody(event).catch(() => ({}));
  if (!(body == null ? void 0 : body.fileName) || !(body == null ? void 0 : body.mimeType) || !(body == null ? void 0 : body.dataBase64)) {
    throw createError({ statusCode: 400, statusMessage: "fileName, mimeType and dataBase64 are required" });
  }
  if (!ALLOWED_MIME.has(body.mimeType)) {
    throw createError({ statusCode: 400, statusMessage: "Unsupported media type" });
  }
  const bytes = Buffer.from(body.dataBase64, "base64");
  if (!bytes.byteLength || bytes.byteLength > MAX_SIZE_BYTES) {
    throw createError({ statusCode: 400, statusMessage: "File too large (max 20MB)" });
  }
  const { shopId } = await requireTenantShop(event);
  const festival = await resolveFestivalOrThrow(event, festivalSlug);
  const identity = await resolveCustomerIdentityOrThrow(event);
  const client = await serverSupabaseServiceRole(event);
  const extension = getExtension(body.fileName, body.mimeType);
  const safeName = sanitizeFileName(body.fileName);
  const objectPath = `${shopId}/festival/${festival.id}/ugc/${identity.profileId}/${Date.now()}-${safeName}.${extension}`;
  const upload = await client.storage.from("organization-media").upload(objectPath, bytes, {
    contentType: body.mimeType,
    upsert: true
  });
  if (upload.error) {
    throw createError({ statusCode: 500, statusMessage: upload.error.message || "Upload failed" });
  }
  const publicUrl = client.storage.from("organization-media").getPublicUrl(objectPath).data.publicUrl;
  return { ok: true, url: publicUrl, path: objectPath, mimeType: body.mimeType };
});

export { upload_post as default };
