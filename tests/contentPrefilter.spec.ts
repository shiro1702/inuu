import { describe, expect, it } from 'vitest'
import { evaluateContentPrefilter } from '../server/utils/ai/contentPrefilter'
import { buildEventParseSystemPrompt } from '../server/utils/ai/eventParsePrompt'
import type { EventParseInput } from '../server/utils/ai/eventParseSchema'
import { buildWebSourceExternalId } from '../server/utils/ingestSourceIds'

const JUNK_POSTS = [
  'Скидка 50% на все товары до конца месяца! Успей купить!',
  'Поздравляем с днём рождения нашего директора!',
  'Подписывайтесь на канал и участвуйте в розыгрыше iPhone',
  'Реклама: доставка суши по всему городу, звоните сейчас',
  'Коротко',
]

const EVENT_POSTS = [
  '15 июня в 19:00 — концерт «Байкал Blues». Билеты от 800 ₽. Афиша: https://example.com',
  'Спектакль «Лебединое озеро» 20.06 и 21.06. Бурятский театр драмы. Вход по билетам.',
  'Stand-up вечер: open mic + три комика. 18.06, 20:00. Бесплатный вход.',
  'Отмена концерта 12.06 из-за болезни артиста. Билеты можно вернуть.',
  'Афиша на неделю:\n1. Выставка — 14.06\n2. Лекция — 15.06\n3. Мастер-класс — 16.06',
]

describe('evaluateContentPrefilter', () => {
  it('skips obvious junk without event signals', () => {
    for (const text of JUNK_POSTS) {
      const result = evaluateContentPrefilter(text)
      expect(result.pass, text).toBe(false)
    }
  })

  it('passes event-like posts with dates, prices or keywords', () => {
    for (const text of EVENT_POSTS) {
      const result = evaluateContentPrefilter(text)
      expect(result.pass, text).toBe(true)
    }
  })

  it('filters at least half of junk fixtures', () => {
    const junkSkipped = JUNK_POSTS.filter((text) => !evaluateContentPrefilter(text).pass).length
    expect(junkSkipped / JUNK_POSTS.length).toBeGreaterThanOrEqual(0.5)
  })
})

describe('buildEventParseSystemPrompt', () => {
  const baseInput: EventParseInput = {
    rawText: 'test',
    sourceKind: 'telegram_parse',
    hints: {
      contextType: 'theater',
      availableTags: [{ slug: 'culture', name: 'Культура' }],
      availableCategories: [{ slug: 'theater', name: 'Театр' }],
    },
  }

  it('includes theater context and forbids club fields', () => {
    const prompt = buildEventParseSystemPrompt(baseInput)
    expect(prompt).toContain('Контекст: театр')
    expect(prompt).toContain('НЕ выдумывай line-up')
    expect(prompt).not.toContain('Контекст: клуб')
  })

  it('restricts tags to dictionary slugs only', () => {
    const prompt = buildEventParseSystemPrompt(baseInput)
    expect(prompt).toContain('ТОЛЬКО из справочника')
    expect(prompt).toContain('Новые slug запрещены')
  })
})

describe('buildWebSourceExternalId', () => {
  it('returns stable id for same url', () => {
    const url = 'https://example.com/afisha'
    expect(buildWebSourceExternalId(url)).toBe(buildWebSourceExternalId(url))
  })

  it('includes hostname prefix', () => {
    expect(buildWebSourceExternalId('https://teatr.example/afisha')).toMatch(/^web:teatr\.example:/)
  })
})
