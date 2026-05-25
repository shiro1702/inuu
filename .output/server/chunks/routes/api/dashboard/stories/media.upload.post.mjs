import { y as defineEventHandler, aB as requireDashboardAccess, aA as readBody, t as createError, aS as serverSupabaseServiceRole } from '../../../../nitro/nitro.mjs';
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
  "image/png",
  "image/jpeg",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime"
]);
const MAX_SIZE_BYTES = 8 * 1024 * 1024;
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
  if (mimeType === "video/mp4") return "mp4";
  if (mimeType === "video/webm") return "webm";
  if (mimeType === "video/quicktime") return "mov";
  return "bin";
}
const media_upload_post = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.mimeType) || !body.dataBase64 || !body.fileName) {
    throw createError({
      statusCode: 400,
      statusMessage: "fileName, mimeType and dataBase64 are required"
    });
  }
  if (!ALLOWED_MIME.has(body.mimeType)) {
    throw createError({ statusCode: 400, statusMessage: "Unsupported media type" });
  }
  const bytes = Buffer.from(body.dataBase64, "base64");
  if (!bytes.byteLength || bytes.byteLength > MAX_SIZE_BYTES) {
    throw createError({ statusCode: 400, statusMessage: "File too large (max 8MB)" });
  }
  const extension = getExtension(body.fileName, body.mimeType);
  const safeName = sanitizeFileName(body.fileName);
  const sub = body.kind === "preview" ? "stories/preview" : "stories/slides";
  const objectPath = `${access.shopId}/${sub}/${Date.now()}-${safeName}.${extension}`;
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
    url: publicUrl,
    path: objectPath
  };
});

export { media_upload_post as default };
