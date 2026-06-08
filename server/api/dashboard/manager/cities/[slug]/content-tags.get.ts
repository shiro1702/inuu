import { defineEventHandler, getQuery } from 'h3'
import { groupTagsByCategory } from '~/server/utils/contentTagCatalog'
import { listCityContentTags } from '~/server/utils/cityContentTaxonomy'
import {
  collectCityContentTagSlugsInUse,
  filterTagGroupsByUsedSlugs,
  filterTaxonomyByUsedSlugs,
  parseContentTagUsageScope,
} from '~/server/utils/cityContentTagsInUse'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const cityScope = await resolveManagerCityScopeOrThrow(event, slug)
  const query = getQuery(event)
  const q = typeof query.q === 'string' ? query.q : ''
  const usageScope = parseContentTagUsageScope(query.scope)

  let items = await listCityContentTags(event, cityScope.cityId, q)
  let groups = groupTagsByCategory(items)

  if (usageScope) {
    const usedSlugs = await collectCityContentTagSlugsInUse(event, cityScope.cityId, usageScope)
    items = filterTaxonomyByUsedSlugs(items, usedSlugs)
    groups = filterTagGroupsByUsedSlugs(groups, usedSlugs)
  }

  return { ok: true as const, items, groups, scope: usageScope ?? null }
})
