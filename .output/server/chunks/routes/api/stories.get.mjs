import { y as defineEventHandler, aE as requireTenantShop, aS as serverSupabaseServiceRole, aT as serverSupabaseUser, t as createError, ab as isTargetingEmpty, o as campaignMatchesTargeting, l as buildDemoStoryCampaigns } from '../../nitro/nitro.mjs';
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
const stories_get = defineEventHandler(async (event) => {
  const { shopId } = await requireTenantShop(event);
  const client = await serverSupabaseServiceRole(event);
  const supabaseUser = await serverSupabaseUser(event);
  const userId = normalizeUserId(supabaseUser);
  let viewer = {
    userId,
    gender: null,
    birthDate: null,
    ordersCount: 0,
    daysSinceLastOrder: null
  };
  if (userId) {
    const { data: profile } = await client.from("profiles").select("gender, birth_date").eq("id", userId).maybeSingle();
    const gender = profile && typeof profile.gender === "string" ? profile.gender : null;
    const birthDate = profile && profile.birth_date != null ? String(profile.birth_date).slice(0, 10) : null;
    const { count: orderCount } = await client.from("orders").select("*", { count: "exact", head: true }).eq("shop_id", shopId).eq("customer_profile_id", userId).neq("status", "cancelled");
    const { data: lastOrder } = await client.from("orders").select("created_at").eq("shop_id", shopId).eq("customer_profile_id", userId).neq("status", "cancelled").order("created_at", { ascending: false }).limit(1).maybeSingle();
    let daysSinceLastOrder = null;
    if (lastOrder == null ? void 0 : lastOrder.created_at) {
      const last = new Date(lastOrder.created_at);
      const now = /* @__PURE__ */ new Date();
      daysSinceLastOrder = Math.floor(
        (now.getTime() - last.getTime()) / (24 * 60 * 60 * 1e3)
      );
    }
    viewer = {
      userId,
      gender,
      birthDate,
      ordersCount: orderCount != null ? orderCount : 0,
      daysSinceLastOrder
    };
  }
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const { data: campaigns, error: campErr } = await client.from("story_campaigns").select(
    "id, shop_id, title, preview_url, placement, is_active, valid_from, valid_until, targeting, created_at"
  ).eq("shop_id", shopId).eq("is_active", true);
  if (campErr) {
    console.error("stories.get campaigns:", campErr);
    throw createError({ statusCode: 500, statusMessage: "Failed to load stories" });
  }
  const timeOk = (c) => {
    const row = c;
    const vf = row.valid_from;
    const vu = row.valid_until;
    if (vf && typeof vf === "string" && vf > nowIso) return false;
    if (vu && typeof vu === "string" && vu < nowIso) return false;
    return true;
  };
  const filtered = (campaigns != null ? campaigns : []).filter((c) => {
    if (!timeOk(c)) return false;
    const targeting = c.targeting;
    if (!userId) {
      return isTargetingEmpty(targeting);
    }
    return campaignMatchesTargeting(targeting, viewer);
  });
  const campaignIds = filtered.map((c) => c.id);
  if (campaignIds.length === 0) {
    const allowDemo = process.env.STORIES_DEMO === "1";
    if (allowDemo) {
      const demo = buildDemoStoryCampaigns();
      const topBar2 = demo.filter((c) => c.placement === "top_bar" && c.slides.length > 0);
      const catalogGrid2 = demo.filter((c) => c.placement === "catalog_grid" && c.slides.length > 0);
      return {
        ok: true,
        shopId,
        topBar: topBar2,
        catalogGrid: catalogGrid2,
        campaigns: demo
      };
    }
    return {
      ok: true,
      shopId,
      topBar: [],
      catalogGrid: [],
      campaigns: []
    };
  }
  const { data: slides, error: slideErr } = await client.from("story_slides").select(
    "id, campaign_id, sort_order, media_url, duration_seconds, action_type, action_payload"
  ).in("campaign_id", campaignIds).order("sort_order", { ascending: true });
  if (slideErr) {
    console.error("stories.get slides:", slideErr);
    throw createError({ statusCode: 500, statusMessage: "Failed to load story slides" });
  }
  const slidesByCampaign = /* @__PURE__ */ new Map();
  for (const s of slides != null ? slides : []) {
    const cid = s.campaign_id;
    if (!slidesByCampaign.has(cid)) slidesByCampaign.set(cid, []);
    slidesByCampaign.get(cid).push(s);
  }
  const mapSlide = (s) => {
    var _a;
    const actionPayload = (_a = s.action_payload) != null ? _a : {};
    const title = typeof actionPayload.title === "string" ? actionPayload.title : null;
    const text = typeof actionPayload.text === "string" ? actionPayload.text : null;
    return {
      id: s.id,
      campaignId: s.campaign_id,
      sortOrder: s.sort_order,
      mediaUrl: s.media_url || "",
      durationSeconds: s.duration_seconds,
      actionType: s.action_type,
      actionPayload,
      title,
      text
    };
  };
  const mapCampaign = (c) => {
    var _a, _b;
    const id = c.id;
    const rawSlides = (_a = slidesByCampaign.get(id)) != null ? _a : [];
    return {
      id,
      title: c.title,
      previewUrl: (_b = c.preview_url) != null ? _b : null,
      placement: c.placement,
      targeting: c.targeting,
      slides: rawSlides.map((x) => mapSlide(x))
    };
  };
  const mapped = filtered.map((c) => mapCampaign(c));
  const topBar = mapped.filter((c) => c.placement === "top_bar" && c.slides.length > 0);
  const catalogGrid = mapped.filter((c) => c.placement === "catalog_grid" && c.slides.length > 0);
  return {
    ok: true,
    shopId,
    topBar,
    catalogGrid,
    campaigns: mapped
  };
});

export { stories_get as default };
