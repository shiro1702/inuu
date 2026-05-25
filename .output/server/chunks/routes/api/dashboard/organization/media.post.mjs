import { y as defineEventHandler, aB as requireDashboardAccess, t as createError, aA as readBody, aS as serverSupabaseServiceRole } from '../../../../nitro/nitro.mjs';
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

const ALLOWED_MIME = /* @__PURE__ */ new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/x-icon"]);
const MAX_SIZE_BYTES = 2 * 1024 * 1024;
function sanitizeFileName(input) {
  const cleaned = input.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80) || "upload";
  return cleaned.replace(/\.[a-zA-Z0-9]+$/, "");
}
function getExtension(fileName, mimeType) {
  var _a;
  const fromName = (_a = fileName.split(".").pop()) == null ? void 0 : _a.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/svg+xml") return "svg";
  if (mimeType === "image/x-icon") return "ico";
  return "bin";
}
function validateDimensions(kind, width, height) {
  if (kind === "favicon") return;
  if (!Number.isFinite(width) || !Number.isFinite(height) || !width || !height) {
    throw createError({ statusCode: 400, statusMessage: "Image dimensions are required" });
  }
  if ((kind === "logo" || kind === "logo-large") && (width < 256 || height < 256)) {
    throw createError({ statusCode: 400, statusMessage: "Logo must be at least 256x256" });
  }
}
const media_post = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can upload organization media" });
  }
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.kind) || !body.mimeType || !body.dataBase64 || !body.fileName) {
    throw createError({ statusCode: 400, statusMessage: "kind, fileName, mimeType and dataBase64 are required" });
  }
  if (!["logo", "logo-large", "favicon", "restaurant-card", "hero"].includes(body.kind)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid media kind" });
  }
  if (!ALLOWED_MIME.has(body.mimeType)) {
    throw createError({ statusCode: 400, statusMessage: "Unsupported media type" });
  }
  validateDimensions(body.kind, body.width, body.height);
  const bytes = Buffer.from(body.dataBase64, "base64");
  if (!bytes.byteLength || bytes.byteLength > MAX_SIZE_BYTES) {
    throw createError({ statusCode: 400, statusMessage: "File size must be between 1B and 2MB" });
  }
  const extension = getExtension(body.fileName, body.mimeType);
  const safeName = sanitizeFileName(body.fileName);
  const objectPath = `${access.shopId}/${body.kind}/${Date.now()}-${safeName}.${extension}`;
  const client = await serverSupabaseServiceRole(event);
  const upload = await client.storage.from("organization-media").upload(objectPath, bytes, {
    contentType: body.mimeType,
    upsert: true
  });
  if (upload.error) {
    throw createError({ statusCode: 500, statusMessage: upload.error.message || "Upload failed" });
  }
  const publicUrl = client.storage.from("organization-media").getPublicUrl(objectPath).data.publicUrl;
  return {
    ok: true,
    kind: body.kind,
    url: publicUrl,
    path: objectPath
  };
});

export { media_post as default };
