import { y as defineEventHandler, aB as requireDashboardAccess, aS as serverSupabaseServiceRole, aA as readBody, t as createError } from '../../../../nitro/nitro.mjs';
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

const index_post = defineEventHandler(async (event) => {
  var _a, _b;
  const access = await requireDashboardAccess(event);
  const client = await serverSupabaseServiceRole(event);
  const body = await readBody(event);
  const title = typeof (body == null ? void 0 : body.title) === "string" ? body.title.trim() : "";
  if (!title) {
    throw createError({ statusCode: 400, statusMessage: "title is required" });
  }
  const placement = (body == null ? void 0 : body.placement) === "catalog_grid" ? "catalog_grid" : "top_bar";
  const previewUrl = typeof (body == null ? void 0 : body.previewUrl) === "string" && body.previewUrl.trim() ? body.previewUrl.trim() : null;
  const isActive = (body == null ? void 0 : body.isActive) !== false;
  const validFrom = (_a = body == null ? void 0 : body.validFrom) != null ? _a : null;
  const validUntil = (_b = body == null ? void 0 : body.validUntil) != null ? _b : null;
  const targeting = (body == null ? void 0 : body.targeting) && typeof body.targeting === "object" ? body.targeting : {};
  const { data: campaign, error: insErr } = await client.from("story_campaigns").insert({
    shop_id: access.shopId,
    title,
    preview_url: previewUrl,
    placement,
    is_active: isActive,
    valid_from: validFrom,
    valid_until: validUntil,
    targeting
  }).select("id").single();
  if (insErr || !(campaign == null ? void 0 : campaign.id)) {
    console.error("create story campaign:", insErr);
    throw createError({ statusCode: 500, statusMessage: "Failed to create campaign" });
  }
  const campaignId = campaign.id;
  const slidesInput = Array.isArray(body == null ? void 0 : body.slides) ? body.slides : [];
  if (slidesInput.length) {
    const rows = slidesInput.map((s, idx) => ({
      campaign_id: campaignId,
      sort_order: typeof s.sortOrder === "number" ? s.sortOrder : idx,
      media_url: typeof s.mediaUrl === "string" ? s.mediaUrl.trim() : "",
      duration_seconds: typeof s.durationSeconds === "number" && s.durationSeconds >= 1 ? Math.min(120, s.durationSeconds) : 5,
      action_type: normalizeActionType(s.actionType),
      action_payload: s.actionPayload && typeof s.actionPayload === "object" ? s.actionPayload : {}
    }));
    const { error: slideErr } = await client.from("story_slides").insert(rows);
    if (slideErr) {
      await client.from("story_campaigns").delete().eq("id", campaignId);
      console.error("create story slides:", slideErr);
      throw createError({ statusCode: 500, statusMessage: "Failed to create slides" });
    }
  }
  return { ok: true, id: campaignId };
});
function normalizeActionType(raw) {
  const s = typeof raw === "string" ? raw : "none";
  if (["add_to_cart", "apply_promo", "open_category", "none"].includes(s)) return s;
  return "none";
}

export { index_post as default };
