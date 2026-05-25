import { y as defineEventHandler, Y as getRouterParam, t as createError, aE as requireTenantShop, aK as resolveFestivalOrThrow, aH as resolveCustomerIdentityOrThrow, aS as serverSupabaseServiceRole, a7 as isCustomerBannedForFestival, ae as loadEligibleFestivalOrders } from '../../../../../nitro/nitro.mjs';
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

const eligibility_get = defineEventHandler(async (event) => {
  const festivalSlug = getRouterParam(event, "festival_slug");
  if (!festivalSlug) {
    throw createError({ statusCode: 400, statusMessage: "festival_slug is required" });
  }
  const { shopId } = await requireTenantShop(event);
  const festival = await resolveFestivalOrThrow(event, festivalSlug);
  const identity = await resolveCustomerIdentityOrThrow(event);
  const client = await serverSupabaseServiceRole(event);
  const isBanned = await isCustomerBannedForFestival(client, {
    festivalId: festival.id,
    shopId,
    profileId: identity.profileId,
    telegramId: identity.telegramId,
    maxUserId: identity.maxUserId
  });
  if (isBanned) {
    return {
      ok: true,
      festivalId: festival.id,
      profileId: identity.profileId,
      canPostStory: false,
      canPostReview: false,
      reason: "banned",
      ordersForReview: []
    };
  }
  const orders = await loadEligibleFestivalOrders(client, {
    profileId: identity.profileId,
    festivalId: festival.id,
    shopId,
    limit: 30
  });
  const canPostStory = orders.length > 0;
  const ordersForReview = orders.map((x) => {
    var _a;
    return {
      id: String(x.id),
      orderNumber: String(x.order_number || x.id),
      restaurantId: String(x.restaurant_id || ""),
      restaurantName: String(((_a = x.restaurants) == null ? void 0 : _a.name) || "\u041A\u043E\u0440\u043D\u0435\u0440"),
      createdAt: String(x.created_at || ""),
      items: Array.isArray(x.items) ? x.items : []
    };
  });
  return {
    ok: true,
    festivalId: festival.id,
    profileId: identity.profileId,
    canPostStory,
    canPostReview: ordersForReview.length > 0,
    ordersForReview
  };
});

export { eligibility_get as default };
