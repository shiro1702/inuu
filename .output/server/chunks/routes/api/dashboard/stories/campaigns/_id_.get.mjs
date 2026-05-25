import { y as defineEventHandler, aB as requireDashboardAccess, aS as serverSupabaseServiceRole, t as createError } from '../../../../../nitro/nitro.mjs';
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

const _id__get = defineEventHandler(async (event) => {
  var _a, _b;
  const access = await requireDashboardAccess(event);
  const client = await serverSupabaseServiceRole(event);
  const id = (_a = event.context.params) == null ? void 0 : _a.id;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "ID is required" });
  }
  const { data: row, error } = await client.from("story_campaigns").select("id, title, preview_url, placement, is_active, valid_from, valid_until, targeting, created_at").eq("id", id).eq("shop_id", access.shopId).maybeSingle();
  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Failed to load campaign" });
  }
  if (!row) {
    throw createError({ statusCode: 404, statusMessage: "Campaign not found" });
  }
  const { data: slideRows, error: sErr } = await client.from("story_slides").select("id, sort_order, media_url, duration_seconds, action_type, action_payload").eq("campaign_id", id).order("sort_order", { ascending: true });
  if (sErr) {
    throw createError({ statusCode: 500, statusMessage: "Failed to load slides" });
  }
  const slides = (slideRows != null ? slideRows : []).map((s) => {
    var _a2;
    return {
      id: s.id,
      sortOrder: s.sort_order,
      mediaUrl: s.media_url,
      durationSeconds: s.duration_seconds,
      actionType: s.action_type,
      actionPayload: (_a2 = s.action_payload) != null ? _a2 : {}
    };
  });
  const r = row;
  return {
    ok: true,
    item: {
      id: r.id,
      title: r.title,
      previewUrl: r.preview_url,
      placement: r.placement,
      isActive: r.is_active,
      validFrom: r.valid_from,
      validUntil: r.valid_until,
      targeting: (_b = r.targeting) != null ? _b : {},
      createdAt: r.created_at,
      slides
    }
  };
});

export { _id__get as default };
