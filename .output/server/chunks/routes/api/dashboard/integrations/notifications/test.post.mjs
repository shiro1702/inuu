import crypto from 'node:crypto';
import { y as defineEventHandler, aB as requireDashboardAccess, aA as readBody, t as createError, B as dispatchNotificationEvent } from '../../../../../nitro/nitro.mjs';
import '@supabase/ssr';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:url';
import '@supabase/supabase-js';

const test_post = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  const body = await readBody(event).catch(() => ({}));
  const restaurantId = (_a = body.restaurantId) == null ? void 0 : _a.trim();
  if (!restaurantId) {
    throw createError({ statusCode: 400, statusMessage: "restaurantId is required" });
  }
  await dispatchNotificationEvent(event, {
    eventId: crypto.randomUUID(),
    eventType: "ORDER_CREATED",
    occurredAt: (/* @__PURE__ */ new Date()).toISOString(),
    tenantContext: {
      shopId: access.shopId,
      restaurantId,
      cityId: null
    },
    orderContext: {
      orderId: crypto.randomUUID(),
      orderNumber: "TEST-ORDER",
      totalAmount: 0,
      status: "new"
    }
  });
  return { ok: true };
});

export { test_post as default };
