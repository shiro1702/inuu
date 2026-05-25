import { y as defineEventHandler, aS as serverSupabaseServiceRole, t as createError } from '../../nitro/nitro.mjs';
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

const platformCities_get = defineEventHandler(async (event) => {
  const client = await serverSupabaseServiceRole(event);
  const { data, error } = await client.from("cities").select("id,name,slug,is_active,created_at").order("name", { ascending: true });
  if (error) {
    console.error("Failed to load platform cities:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to load cities" });
  }
  const rows = data != null ? data : [];
  return {
    ok: true,
    items: rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      isActive: row.is_active,
      createdAt: row.created_at
    }))
  };
});

export { platformCities_get as default };
