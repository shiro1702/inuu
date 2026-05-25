import { y as defineEventHandler, aM as resolveShopIdFromEvent, t as createError, Z as getShopById, aF as resolveCanonicalTenantCartPath } from '../../../nitro/nitro.mjs';
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

const resolveCanonical_get = defineEventHandler(async (event) => {
  const ref = await resolveShopIdFromEvent(event);
  if (!ref) {
    throw createError({ statusCode: 400, statusMessage: "Missing shop_id" });
  }
  const shop = await getShopById(event, ref);
  if (!shop || !shop.is_active) {
    throw createError({ statusCode: 404, statusMessage: "Shop not found" });
  }
  const canonical = await resolveCanonicalTenantCartPath(event, shop);
  return {
    ok: true,
    shopId: shop.id,
    citySlug: canonical.citySlug,
    tenantSlug: canonical.tenantSlug,
    cartPath: canonical.cartPath,
    checkoutPath: canonical.checkoutPath
  };
});

export { resolveCanonical_get as default };
