import { y as defineEventHandler, aB as requireDashboardAccess, t as createError, aA as readBody, s as createCustomPreset } from '../../../../nitro/nitro.mjs';
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

const stylePresets_post = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can create custom presets" });
  }
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.title) || !(body == null ? void 0 : body.config)) {
    throw createError({ statusCode: 400, statusMessage: "Preset title and config are required" });
  }
  const created = await createCustomPreset(event, access.shopId, access.userId, {
    title: body.title,
    mood: (_a = body.mood) != null ? _a : "",
    config: body.config
  });
  return {
    ok: true,
    item: created
  };
});

export { stylePresets_post as default };
