import { defineEventHandler, getQuery, setResponseHeader } from 'h3'
import { groupTagsByCategory } from '~/server/utils/contentTagCatalog'
import { listCityContentTags } from '~/server/utils/cityContentTaxonomy'
import {
  collectCityContentTagSlugsInUse,
  filterTagGroupsByUsedSlugs,
  filterTaxonomyByUsedSlugs,
  parseContentTagUsageScope,
} from '~/server/utils/cityContentTagsInUse'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=600')
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const city = await resolveCityBySlug(event, slug)
  const scope = parseContentTagUsageScope(getQuery(event).scope)

  let items = await listCityContentTags(event, city.id)
  let groups = groupTagsByCategory(items)

  if (scope) {
    const usedSlugs = await collectCityContentTagSlugsInUse(event, city.id, scope)
    items = filterTaxonomyByUsedSlugs(items, usedSlugs)
    groups = filterTagGroupsByUsedSlugs(groups, usedSlugs)
  }

  return { ok: true, items, groups, scope: scope ?? null }
})
