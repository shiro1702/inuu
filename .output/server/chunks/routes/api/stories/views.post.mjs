import { y as defineEventHandler, aE as requireTenantShop, aA as readBody, t as createError, aS as serverSupabaseServiceRole, aT as serverSupabaseUser } from '../../../nitro/nitro.mjs';
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

function normalizeUserId(raw) {
  if (!raw || typeof raw !== "object") return null;
  const o = raw;
  if (typeof o.id === "string" && o.id) return o.id;
  if (typeof o.sub === "string" && o.sub) return o.sub;
  return null;
}
const views_post = defineEventHandler(async (event) => {
  const { shopId } = await requireTenantShop(event);
  const body = await readBody(event);
  const slideId = typeof (body == null ? void 0 : body.slideId) === "string" ? body.slideId.trim() : "";
  if (!slideId) {
    throw createError({ statusCode: 400, statusMessage: "slideId is required" });
  }
  const client = await serverSupabaseServiceRole(event);
  const supabaseUser = await serverSupabaseUser(event);
  const userId = normalizeUserId(supabaseUser);
  const { data: slideRow, error: slideErr } = await client.from("story_slides").select("id, campaign_id").eq("id", slideId).maybeSingle();
  if (slideErr || !slideRow) {
    throw createError({ statusCode: 404, statusMessage: "Slide not found" });
  }
  const { data: campaign, error: campErr } = await client.from("story_campaigns").select("id, shop_id").eq("id", slideRow.campaign_id).maybeSingle();
  if (campErr || !campaign || campaign.shop_id !== shopId) {
    throw createError({ statusCode: 400, statusMessage: "Invalid slide for this shop" });
  }
  const { error: insErr } = await client.from("story_views").insert({
    slide_id: slideId,
    user_id: userId,
    viewed_at: (/* @__PURE__ */ new Date()).toISOString()
  });
  if (insErr) {
    console.error("story_views insert:", insErr);
    throw createError({ statusCode: 500, statusMessage: "Failed to record view" });
  }
  return { ok: true };
});

export { views_post as default };
