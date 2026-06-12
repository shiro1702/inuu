import { describe, expect, it } from 'vitest'
import {
  isMetaLikeSlideTitle,
  parseSlideEventText,
  reconcileSlideWithSourceText,
} from '~/utils/parseSlideEventText'

describe('parseSlideEventText', () => {
  it('parses labeled details block from quick prompt', () => {
    const text = 'Начало в 19:00\nАдрес: ул. Ленина, 12\nВход свободный'
    const parsed = parseSlideEventText(text)

    expect(parsed.isStructured).toBe(true)
    expect(parsed.event_datetime).toBe('19:00')
    expect(parsed.event_venue).toBe('ул. Ленина, 12')
    expect(parsed.event_price).toBe('Вход свободный')
    expect(parsed.title).toBeUndefined()
    expect(parsed.theses).toEqual([])
  })

  it('keeps thesis lines separate from meta', () => {
    const text = 'Начало в 19:00\nКафе Эфир\nДегустационный сет из 5 блюд'
    const parsed = parseSlideEventText(text)

    expect(parsed.event_datetime).toBe('19:00')
    expect(parsed.event_venue).toBe('Кафе Эфир')
    expect(parsed.theses).toEqual(['Дегустационный сет из 5 блюд'])
  })

  it('detects meta-like titles', () => {
    expect(isMetaLikeSlideTitle('Начало в 19:00')).toBe(true)
    expect(isMetaLikeSlideTitle('Адрес: ул. Ленина, 12')).toBe(true)
    expect(isMetaLikeSlideTitle('Летний бранч в кафе')).toBe(false)
  })

  it('reconciles groq slide with structured source text', () => {
    const source = 'Начало в 19:00\nАдрес: ул. Ленина, 12\nВход свободный'
    const groqSlide = {
      role: 'body' as const,
      title: 'Начало в 19:00',
      event_datetime: 'Адрес: ул. Ленина, 12',
      event_venue: 'Кафе Эфир',
      event_price: 'от 500₽',
      bullets: ['Вход свободный'],
      gradient: 'party',
    }

    const fixed = reconcileSlideWithSourceText(groqSlide, source, 'body')

    expect(fixed.title).toBeUndefined()
    expect(fixed.event_datetime).toBe('19:00')
    expect(fixed.event_venue).toBe('ул. Ленина, 12')
    expect(fixed.event_price).toBe('Вход свободный')
    expect(fixed.bullets).toBeUndefined()
  })

  it('parses menu quick prompt into title, cta and schedule', () => {
    const text = 'Дегустационный сет из 5 блюд\nБронь по телефону\nПятница–воскресенье'
    const parsed = parseSlideEventText(text)

    expect(parsed.title).toBe('Дегустационный сет из 5 блюд')
    expect(parsed.cta_text).toBe('Бронь по телефону')
    expect(parsed.event_datetime).toBe('Пятница–воскресенье')
    expect(parsed.event_venue).toBe('')
    expect(parsed.theses).toEqual([])
  })

  it('reconciles groq field shift for menu prompt', () => {
    const source = 'Дегустационный сет из 5 блюд\nБронь по телефону\nПятница–воскресенье'
    const groqSlide = {
      role: 'body' as const,
      title: 'Новый слайд',
      event_datetime: 'Дегустационный сет из 5 блюд',
      event_venue: 'Бронь по телефону',
      event_price: null,
      bullets: ['Пятница–воскресенье'],
      gradient: 'party',
    }

    const fixed = reconcileSlideWithSourceText(groqSlide, source, 'body')

    expect(fixed.title).toBe('Дегустационный сет из 5 блюд')
    expect(fixed.cta_text).toBe('Бронь по телефону')
    expect(fixed.event_datetime).toBe('Пятница–воскресенье')
    expect(fixed.event_venue).toBeNull()
    expect(fixed.bullets).toBeUndefined()
  })
})
