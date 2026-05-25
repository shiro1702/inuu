import { y as defineEventHandler, aB as requireDashboardAccess, aS as serverSupabaseServiceRole } from '../../../../nitro/nitro.mjs';
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

const festivalModeration_get = defineEventHandler(async (event) => {
  const access = await requireDashboardAccess(event);
  const client = await serverSupabaseServiceRole(event);
  const { data: festivalLinks } = await client.from("restaurants").select("festival_id").eq("shop_id", access.shopId).not("festival_id", "is", null);
  const festivalIds = Array.from(new Set((festivalLinks != null ? festivalLinks : []).map((x) => String(x.festival_id || "")).filter(Boolean)));
  let festivals = [];
  if (festivalIds.length) {
    const { data } = await client.from("festivals").select("id,slug,name").in("id", festivalIds).order("starts_at", { ascending: false });
    festivals = (data != null ? data : []).map((x) => ({
      id: String(x.id),
      slug: String(x.slug || ""),
      name: String(x.name || x.slug || "Festival")
    }));
  }
  const { data: chats } = await client.from("festival_moderation_chats").select("id,festival_id,telegram_chat_id,max_chat_id,is_active,updated_at").eq("shop_id", access.shopId).order("updated_at", { ascending: false });
  return {
    ok: true,
    festivals,
    chats: (chats != null ? chats : []).map((x) => ({
      id: String(x.id),
      festivalId: String(x.festival_id),
      telegramChatId: x.telegram_chat_id || "",
      maxChatId: x.max_chat_id || "",
      isActive: x.is_active !== false,
      updatedAt: String(x.updated_at || "")
    }))
  };
});

export { festivalModeration_get as default };
