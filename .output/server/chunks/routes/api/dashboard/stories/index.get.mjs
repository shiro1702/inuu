import { y as defineEventHandler, aB as requireDashboardAccess, aS as serverSupabaseServiceRole, t as createError } from '../../../../nitro/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  var _a;
  const access = await requireDashboardAccess(event);
  const client = await serverSupabaseServiceRole(event);
  const { data: campaigns, error } = await client.from("story_campaigns").select("id, title, preview_url, placement, is_active, valid_from, valid_until, targeting, created_at").eq("shop_id", access.shopId).order("created_at", { ascending: false });
  if (error) {
    console.error("dashboard stories campaigns list:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to load story campaigns" });
  }
  const ids = (campaigns != null ? campaigns : []).map((c) => c.id);
  const slideCountByCampaign = /* @__PURE__ */ new Map();
  if (ids.length) {
    const { data: slides, error: sErr } = await client.from("story_slides").select("campaign_id").in("campaign_id", ids);
    if (sErr) {
      console.error("dashboard stories slides:", sErr);
      throw createError({ statusCode: 500, statusMessage: "Failed to load story slides" });
    }
    for (const s of slides != null ? slides : []) {
      const cid = s.campaign_id;
      slideCountByCampaign.set(cid, ((_a = slideCountByCampaign.get(cid)) != null ? _a : 0) + 1);
    }
  }
  return {
    ok: true,
    items: (campaigns != null ? campaigns : []).map((row) => {
      var _a2, _b;
      return {
        id: row.id,
        title: row.title,
        previewUrl: row.preview_url,
        placement: row.placement,
        isActive: row.is_active,
        validFrom: row.valid_from,
        validUntil: row.valid_until,
        targeting: (_a2 = row.targeting) != null ? _a2 : {},
        createdAt: row.created_at,
        slides: Array.from({ length: (_b = slideCountByCampaign.get(row.id)) != null ? _b : 0 }, () => ({}))
      };
    })
  };
});

export { index_get as default };
