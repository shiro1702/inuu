import { defineEventHandler, setResponseHeader } from 'h3'
import { groupTagsByCategory } from '~/server/utils/contentTagCatalog'
import { listCityContentTags } from '~/server/utils/cityContentTaxonomy'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=600')
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const city = await resolveCityBySlug(event, slug)
  const items = await listCityContentTags(event, city.id)
  const groups = groupTagsByCategory(items)
  return { ok: true, items, groups }
})
