import { y as defineEventHandler, T as getQuery, aq as parseListLimit, Z as getShopById, t as createError, aE as requireTenantShop, aa as isShopFeatureEnabled, aS as serverSupabaseServiceRole, r as computePublicRating } from '../../nitro/nitro.mjs';
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

const reviews_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const restaurantId = typeof query.restaurant_id === "string" && query.restaurant_id.trim() ? query.restaurant_id.trim() : "";
  const shopRef = typeof query.shop_id === "string" ? query.shop_id.trim() : "";
  const limit = parseListLimit(query.limit, 20, 50);
  let shopId = "";
  if (shopRef) {
    const shop = await getShopById(event, shopRef);
    if (!shop) throw createError({ statusCode: 404, statusMessage: "Shop not found" });
    shopId = shop.id;
  } else {
    const tenant = await requireTenantShop(event);
    shopId = tenant.shopId;
  }
  const moduleEnabled = await isShopFeatureEnabled(event, shopId, "reputation_reviews_pro");
  if (!moduleEnabled) {
    return {
      ok: true,
      moduleEnabled: false,
      items: [],
      rating: {
        public_rating: null,
        sample_count: 0,
        formula: "\u0420\u0435\u0439\u0442\u0438\u043D\u0433 \u0440\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u043D \u043F\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u043C 20 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043D\u044B\u043C \u043E\u0442\u0437\u044B\u0432\u0430\u043C"
      }
    };
  }
  const client = await serverSupabaseServiceRole(event);
  let reviewsQuery = client.from("shop_reviews").select("id,shop_id,restaurant_id,rating,comment,video_url,published_at,created_at").eq("shop_id", shopId).eq("status", "published").order("published_at", { ascending: false }).limit(limit);
  if (restaurantId) {
    reviewsQuery = reviewsQuery.eq("restaurant_id", restaurantId);
  }
  const { data, error } = await reviewsQuery;
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || "Failed to load reviews" });
  }
  const items = (data != null ? data : []).map((x) => ({
    id: String(x.id),
    rating: Number(x.rating || 0),
    comment: typeof x.comment === "string" ? x.comment : null,
    videoUrl: typeof x.video_url === "string" ? x.video_url : null,
    publishedAt: String(x.published_at || x.created_at || "")
  }));
  const ratingAgg = await computePublicRating(event, {
    shopId,
    restaurantId: restaurantId || null,
    sampleLimit: 20
  });
  return {
    ok: true,
    moduleEnabled: true,
    items,
    rating: ratingAgg
  };
});

export { reviews_get as default };
