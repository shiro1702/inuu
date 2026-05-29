import { defineEventHandler, setResponseHeader } from 'h3'
import { resolveCityBySlug } from '~/server/utils/inuuCity'
import { listCityContentTags } from '~/server/utils/cityContentTaxonomy'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=600')
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const city = await resolveCityBySlug(event, slug)
  const items = await listCityContentTags(event, city.id)
  return { ok: true, items }
})
