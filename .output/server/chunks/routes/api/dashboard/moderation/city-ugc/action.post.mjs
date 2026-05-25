import { y as defineEventHandler, aB as requireDashboardAccess, t as createError, aA as readBody, c as applyFestivalModerationAction } from '../../../../../nitro/nitro.mjs';
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

const action_post = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  if (access.role !== "owner") {
    throw createError({ statusCode: 403, statusMessage: "Only owner can moderate city UGC" });
  }
  const body = await readBody(event).catch(() => ({}));
  const submissionId = (_a = body.submissionId) == null ? void 0 : _a.trim();
  if (!submissionId) {
    throw createError({ statusCode: 400, statusMessage: "submissionId is required" });
  }
  const action = body.action || "reject";
  const allowed = /* @__PURE__ */ new Set(["approve_menu", "approve_feed", "approve_menu_and_feed", "reject", "forward_to_corner", "shadow_ban", "tag_category"]);
  if (!allowed.has(action)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid action" });
  }
  const result = await applyFestivalModerationAction(event, {
    submissionId,
    action,
    category: body.category || null,
    actorChannel: "dashboard",
    actorUserId: access.userId
  });
  return { ok: true, status: result.status };
});

export { action_post as default };
