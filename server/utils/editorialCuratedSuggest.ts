import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'

export async function suggestCuratedListSlugs(
  event: H3Event,
  args: { cityId: string; topicTags: string[] },
): Promise<string[]> {
  if (!args.topicTags.length) return []

  const client = await serverSupabaseServiceRole(event)
  const { data: lists } = await client
    .from('curated_lists')
    .select('slug,title,description')
    .eq('city_id', args.cityId)
    .eq('is_published', true)
    .limit(40)

  if (!lists?.length) return []

  const tags = new Set(args.topicTags.map((t) => t.toLowerCase()))
  const scored = (lists as Array<{ slug: string; title: string; description?: string | null }>)
    .map((list) => {
      const hay = `${list.slug} ${list.title} ${list.description || ''}`.toLowerCase()
      let score = 0
      for (const tag of tags) {
        if (hay.includes(tag)) score += 1
      }
      return { slug: list.slug, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, 5).map((x) => x.slug)
}
