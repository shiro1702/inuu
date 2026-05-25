import { y as defineEventHandler, aB as requireDashboardAccess, T as getQuery, aS as serverSupabaseServiceRole } from '../../../../nitro/nitro.mjs';
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

const notificationEvents_get = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  const query = getQuery(event);
  const status = typeof query.status === "string" ? query.status.trim() : "";
  const channel = typeof query.channel === "string" ? query.channel.trim() : "";
  const restaurantId = typeof query.restaurantId === "string" ? query.restaurantId.trim() : "";
  const page = Math.max(Number(query.page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(query.pageSize) || 25, 1), 100);
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  const client = await serverSupabaseServiceRole(event);
  let db = client.from("notification_events").select("id,notification_key,event_type,channel,shop_id,restaurant_id,city_id,conversation_id,delivery_status,attempt_count,last_error,created_at,updated_at").eq("shop_id", access.shopId).order("created_at", { ascending: false }).range(from, to);
  if (status) db = db.eq("delivery_status", status);
  if (channel) db = db.eq("channel", channel);
  if (restaurantId) db = db.eq("restaurant_id", restaurantId);
  const { data } = await db;
  const rows = data != null ? data : [];
  return {
    ok: true,
    items: rows.slice(0, pageSize),
    pagination: {
      page,
      pageSize,
      hasNext: rows.length > pageSize,
      hasPrev: page > 1
    }
  };
});

export { notificationEvents_get as default };
