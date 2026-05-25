import { y as defineEventHandler, aA as readBody, t as createError, aE as requireTenantShop, aD as requireReviewsFeature, aL as resolveReviewIdentity, aC as requireOwnedOrderForReview, aZ as updateShopReviewRating } from '../../nitro/nitro.mjs';
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

const reviews_patch = defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}));
  const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
  const rating = Number(body.rating || 0);
  if (!orderId) throw createError({ statusCode: 400, statusMessage: "orderId is required" });
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw createError({ statusCode: 400, statusMessage: "rating from 1 to 5 is required" });
  }
  const { shopId } = await requireTenantShop(event);
  await requireReviewsFeature(event, shopId);
  const identity = await resolveReviewIdentity(event);
  const order = await requireOwnedOrderForReview(event, { shopId, orderId, identity });
  const review = await updateShopReviewRating(event, {
    shopId,
    order: { id: order.id, shop_id: order.shop_id, restaurant_id: order.restaurant_id },
    identity,
    rating,
    actorChannel: identity.maxUserId ? "max" : identity.telegramId ? "telegram" : "system"
  });
  return { ok: true, item: review };
});

export { reviews_patch as default };
