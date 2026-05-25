import { y as defineEventHandler, aB as requireDashboardAccess, aD as requireReviewsFeature, aA as readBody, t as createError, e as applyReviewModerationAction } from '../../../../nitro/nitro.mjs';
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
  const access = await requireDashboardAccess(event);
  await requireReviewsFeature(event, access.shopId);
  const body = await readBody(event).catch(() => ({}));
  const reviewId = typeof body.reviewId === "string" ? body.reviewId.trim() : "";
  if (!reviewId) {
    throw createError({ statusCode: 400, statusMessage: "reviewId is required" });
  }
  const action = body.action || "reject";
  const allowed = /* @__PURE__ */ new Set(["publish", "reject", "resolve", "reopen"]);
  if (!allowed.has(action)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid action" });
  }
  const result = await applyReviewModerationAction(event, {
    reviewId,
    shopId: access.shopId,
    action,
    actorUserId: access.userId
  });
  return { ok: true, status: result.status };
});

export { action_post as default };
