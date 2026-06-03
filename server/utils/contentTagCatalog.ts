export type ContentTagGroup =
  | 'legacy'
  | 'vibes'
  | 'audience'
  | 'utility'
  | 'format'
  | 'gastro'
  | 'content-format'

export type MasterContentTag = {
  slug: string
  name: string
  sortOrder: number
  tagGroup: ContentTagGroup
}

export const TAG_GROUP_ORDER: ContentTagGroup[] = [
  'vibes',
  'audience',
  'utility',
  'format',
  'gastro',
  'content-format',
  'legacy',
]

export const TAG_GROUP_LABELS: Record<ContentTagGroup, string> = {
  vibes: 'Вайб и атмосфера',
  audience: 'Для кого',
  utility: 'Условия',
  format: 'На площадке',
  gastro: 'Еда и напитки',
  'content-format': 'Тип контента',
  legacy: 'Темы',
}

/** Canonical master list — spec 31-content-tags-vibes-taxonomy.md */
export const MASTER_CONTENT_TAGS: MasterContentTag[] = [
  // legacy (10–80)
  { slug: 'food', name: '🍽️ Еда', sortOrder: 10, tagGroup: 'legacy' },
  { slug: 'culture', name: '🎭 Культура', sortOrder: 20, tagGroup: 'legacy' },
  { slug: 'family', name: '👨‍👩‍👧 Семья', sortOrder: 30, tagGroup: 'legacy' },
  { slug: 'nightlife', name: '🌙 Ночная жизнь', sortOrder: 40, tagGroup: 'legacy' },
  { slug: 'sport', name: '⚽ Спорт', sortOrder: 50, tagGroup: 'legacy' },
  { slug: 'beauty', name: '💅 Красота', sortOrder: 60, tagGroup: 'legacy' },
  { slug: 'tourism', name: '🧳 Туризм', sortOrder: 70, tagGroup: 'legacy' },
  { slug: 'city', name: '🏙️ Город', sortOrder: 80, tagGroup: 'legacy' },
  // vibes (100–199)
  { slug: 'chill', name: '🛋️ Чилл / уютно', sortOrder: 100, tagGroup: 'vibes' },
  { slug: 'lampovo', name: '☕ Лампово', sortOrder: 101, tagGroup: 'vibes' },
  { slug: 'zen', name: '🧘‍♀️ Дзен / релакс', sortOrder: 102, tagGroup: 'vibes' },
  { slug: 'drive', name: '🪩 Разнос / драйв', sortOrder: 103, tagGroup: 'vibes' },
  { slug: 'loud', name: '🔊 Громко', sortOrder: 104, tagGroup: 'vibes' },
  { slug: 'active', name: '⚡ Актив', sortOrder: 105, tagGroup: 'vibes' },
  { slug: 'aesthetic', name: '📸 Инстаграмно', sortOrder: 106, tagGroup: 'vibes' },
  { slug: 'romance', name: '🕯️ Романтика', sortOrder: 107, tagGroup: 'vibes' },
  { slug: 'premium', name: '🎩 Премиум', sortOrder: 108, tagGroup: 'vibes' },
  { slug: 'underground', name: '⛓️ Андеграунд', sortOrder: 109, tagGroup: 'vibes' },
  { slug: 'speakeasy', name: '🤫 Спикизи / секретно', sortOrder: 110, tagGroup: 'vibes' },
  { slug: 'retro', name: '📼 Ретро / ностальгия', sortOrder: 111, tagGroup: 'vibes' },
  { slug: 'smart', name: '🧠 Культурно / умно', sortOrder: 112, tagGroup: 'vibes' },
  { slug: 'trash-fun', name: '🤪 Трэш / кринж', sortOrder: 113, tagGroup: 'vibes' },
  // audience (200–299)
  { slug: 'date', name: '🥂 На свидание', sortOrder: 200, tagGroup: 'audience' },
  { slug: 'friends', name: '👯‍♀️ С друзьями', sortOrder: 201, tagGroup: 'audience' },
  { slug: 'solo', name: '🎧 Одиночкам', sortOrder: 202, tagGroup: 'audience' },
  { slug: 'kids', name: '🧸 С детьми', sortOrder: 203, tagGroup: 'audience' },
  { slug: 'dog-friendly', name: '🐶 Дог-френдли', sortOrder: 204, tagGroup: 'audience' },
  { slug: 'networking', name: '👔 Нетворкинг', sortOrder: 205, tagGroup: 'audience' },
  // utility (300–399)
  { slug: 'free', name: '🤑 Бесплатно', sortOrder: 300, tagGroup: 'utility' },
  { slug: 'discount', name: '💸 Скидка / акция', sortOrder: 301, tagGroup: 'utility' },
  { slug: 'open-air', name: '🌳 Опен-эйр', sortOrder: 302, tagGroup: 'utility' },
  { slug: 'late-night', name: '🌙 Ночью (23:00+)', sortOrder: 303, tagGroup: 'utility' },
  { slug: 'new-venue', name: '🌟 Новое место', sortOrder: 304, tagGroup: 'utility' },
  { slug: 'invite-only', name: '👑 Закрытое / FC', sortOrder: 305, tagGroup: 'utility' },
  // format (400–499)
  { slug: 'live-music', name: '🎸 Живая музыка', sortOrder: 400, tagGroup: 'format' },
  { slug: 'dj-set', name: '🎧 Диджей-сет', sortOrder: 401, tagGroup: 'format' },
  { slug: 'karaoke', name: '🎤 Караоке', sortOrder: 402, tagGroup: 'format' },
  { slug: 'open-mic', name: '🤡 Открытый микрофон', sortOrder: 403, tagGroup: 'format' },
  { slug: 'workshop', name: '🗣️ Мастер-класс / лекция', sortOrder: 404, tagGroup: 'format' },
  { slug: 'board-games', name: '🎲 Настолки / игры', sortOrder: 405, tagGroup: 'format' },
  { slug: 'cinema-bar', name: '🍿 Кинопоказ (не кинотеатр)', sortOrder: 406, tagGroup: 'format' },
  { slug: 'market', name: '🛍️ Маркет / ярмарка', sortOrder: 407, tagGroup: 'format' },
  // gastro (500–599)
  { slug: 'cocktails', name: '🍹 Коктейли', sortOrder: 500, tagGroup: 'gastro' },
  { slug: 'craft-beer', name: '🍺 Крафт / пиво', sortOrder: 501, tagGroup: 'gastro' },
  { slug: 'wine', name: '🍷 Вино', sortOrder: 502, tagGroup: 'gastro' },
  { slug: 'brunch', name: '🍳 Завтраки / бранч', sortOrder: 503, tagGroup: 'gastro' },
  { slug: 'vegan', name: '🥑 Веган / ЗОЖ', sortOrder: 504, tagGroup: 'gastro' },
  { slug: 'street-food', name: '🍔 Стритфуд', sortOrder: 505, tagGroup: 'gastro' },
  { slug: 'grill', name: '🥩 Мясо / гриль', sortOrder: 506, tagGroup: 'gastro' },
  { slug: 'desserts', name: '🍰 Десерты / выпечка', sortOrder: 507, tagGroup: 'gastro' },
  // content-format (600–699)
  { slug: 'fmt-place', name: '📍 Место', sortOrder: 600, tagGroup: 'content-format' },
  { slug: 'fmt-event', name: '📅 Событие', sortOrder: 601, tagGroup: 'content-format' },
  { slug: 'fmt-collection', name: '📚 Подборка', sortOrder: 602, tagGroup: 'content-format' },
  { slug: 'fmt-video', name: '📹 Видео-обзор', sortOrder: 603, tagGroup: 'content-format' },
  { slug: 'fmt-news', name: '⚡ Новость', sortOrder: 604, tagGroup: 'content-format' },
  { slug: 'fmt-giveaway', name: '🎁 Розыгрыш', sortOrder: 605, tagGroup: 'content-format' },
]

export const MASTER_CONTENT_TAG_SLUGS = new Set(MASTER_CONTENT_TAGS.map((t) => t.slug))

const masterBySlug = new Map(MASTER_CONTENT_TAGS.map((t) => [t.slug, t]))

export function getMasterContentTag(slug: string): MasterContentTag | undefined {
  return masterBySlug.get(slug)
}

export function isMasterContentTagSlug(slug: string): boolean {
  return MASTER_CONTENT_TAG_SLUGS.has(slug)
}

export type TaxonomyTagWithGroup = { slug: string; name: string; tagGroup: string }

export function masterTagsAsTaxonomy(): TaxonomyTagWithGroup[] {
  return MASTER_CONTENT_TAGS.map((t) => ({
    slug: t.slug,
    name: t.name,
    tagGroup: t.tagGroup,
  }))
}

export type ContentTagGroupPayload = {
  id: ContentTagGroup
  label: string
  items: TaxonomyTagWithGroup[]
}

export function groupTagsByCategory(
  tags: TaxonomyTagWithGroup[],
): ContentTagGroupPayload[] {
  const byGroup = new Map<ContentTagGroup, TaxonomyTagWithGroup[]>()
  for (const tag of tags) {
    const group = (tag.tagGroup || 'legacy') as ContentTagGroup
    const list = byGroup.get(group) || []
    list.push(tag)
    byGroup.set(group, list)
  }
  return TAG_GROUP_ORDER.filter((id) => byGroup.has(id)).map((id) => ({
    id,
    label: TAG_GROUP_LABELS[id],
    items: byGroup.get(id) || [],
  }))
}

/** Groq system prompt: slug lines grouped by category */
export function formatTagsForGroqPrompt(
  tags: Array<{ slug: string; name?: string; tagGroup?: string }>,
): string {
  const normalized: TaxonomyTagWithGroup[] = tags.map((t) => ({
    slug: t.slug,
    name: t.name || t.slug,
    tagGroup: t.tagGroup || getMasterContentTag(t.slug)?.tagGroup || 'legacy',
  }))
  const grouped = groupTagsByCategory(normalized)
  return grouped
    .map((g) => `${g.label}: ${g.items.map((i) => i.slug).join(', ')}`)
    .join('\n')
}
