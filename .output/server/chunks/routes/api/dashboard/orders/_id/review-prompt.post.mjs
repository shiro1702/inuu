import { y as defineEventHandler, aB as requireDashboardAccess, aD as requireReviewsFeature, Y as getRouterParam, t as createError, D as enqueueManualReviewPrompts } from '../../../../../nitro/nitro.mjs';
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

const reviewPrompt_post = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  await requireReviewsFeature(event, access.shopId);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Order id is required" });
  }
  try {
    const result = await enqueueManualReviewPrompts(event, {
      shopId: access.shopId,
      orderId: id,
      actorProfileId: access.userId
    });
    return { ok: true, ...result };
  } catch (e) {
    const msg = String((e == null ? void 0 : e.message) || "failed");
    if (msg === "feature_disabled") {
      throw createError({ statusCode: 402, statusMessage: "Review prompts module disabled" });
    }
    if (msg === "order_not_found") {
      throw createError({ statusCode: 404, statusMessage: "Order not found" });
    }
    throw createError({ statusCode: 500, statusMessage: msg });
  }
});

export { reviewPrompt_post as default };
