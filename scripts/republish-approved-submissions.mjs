/**
 * Republish content_submissions stuck in approved without published_entity_id.
 * Usage: node scripts/republish-approved-submissions.mjs
 */
import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const client = createClient(url, key, { realtime: { transport: ws } })

// Inline minimal publish (matches server/utils/contentSubmissionPublish fallback)
function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80) || `item-${Date.now()}`
}

function resolveStartsAt(payload) {
  const dates = Array.isArray(payload?.recurrence?.dates) ? payload.recurrence.dates : []
  const parsed = dates.map((d) => new Date(d)).filter((d) => !Number.isNaN(d.getTime())).sort((a, b) => a - b)
  const minStart = Date.now() + 30 * 60 * 1000
  const future = parsed.find((d) => d.getTime() >= minStart)
  if (future) return future.toISOString()
  if (parsed.length) {
    const bumped = new Date(parsed[parsed.length - 1].getTime() + 7 * 86400000)
    return new Date(Math.max(bumped.getTime(), minStart)).toISOString()
  }
  return new Date(minStart).toISOString()
}

async function publishSubmission(sub) {
  const payload = sub.payload || {}
  const cityId = sub.city_id
  const title = String(payload.title || '').trim()
  if (title.length < 3) throw new Error('title too short')

  if (String(payload.event_kind || sub.kind) === 'news') {
    console.log('  skip news -> editorial_posts not implemented in script')
    return null
  }

  const { data: city } = await client.from('cities').select('id,slug,timezone').eq('id', cityId).maybeSingle()
  const { data: shop } = await client.from('shops').select('id').eq('city_id', cityId).eq('slug', 'inuu-editorial').maybeSingle()

  const eventCore = {
    city_id: cityId,
    shop_id: shop?.id || null,
    category_id: null,
    slug: `${slugify(title)}-${String(sub.id).slice(0, 8)}`,
    title,
    description: String(payload.description || title).trim() || title,
    starts_at: resolveStartsAt(payload),
    ends_at: null,
    price: payload.is_free ? 0 : Math.max(0, Math.round(Number(payload.price_from || 0))),
    currency: 'RUB',
    is_published: true,
    is_promoted: typeof sub.editorial_score === 'number' && sub.editorial_score >= 4,
  }

  const { data: ev, error } = await client.from('events').insert(eventCore).select('id,slug,starts_at').maybeSingle()
  if (error) throw error

  await client
    .from('content_submissions')
    .update({
      status: 'approved',
      published_entity_type: 'event',
      published_entity_id: ev.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sub.id)

  return { slug: ev.slug, starts_at: ev.starts_at, city_slug: city?.slug }
}

const { data: stuck, error } = await client
  .from('content_submissions')
  .select('id,city_id,kind,payload,editorial_score,source_kind')
  .eq('status', 'approved')
  .is('published_entity_id', null)

if (error) {
  console.error(error.message)
  process.exit(1)
}

console.log(`Found ${stuck?.length ?? 0} approved submissions without published entity`)
for (const sub of stuck || []) {
  try {
    const result = await publishSubmission(sub)
    if (result) {
      console.log(`OK ${sub.id.slice(0, 8)} -> /${result.city_slug}/events/${result.slug} (${result.starts_at})`)
    }
  } catch (err) {
    console.error(`FAIL ${sub.id.slice(0, 8)}:`, err.message || err)
  }
}
