/** Calendar context for Groq event extraction (TASK-018 / spec 25). */

export function formatEventPublicationContext(timezone: string): {
  publicationDate: string
  publicationWeekday: string
  currentDate: string
  currentWeekday: string
} {
  const tz = timezone?.trim() || 'Asia/Irkutsk'
  const now = new Date()
  const publicationDate = now.toLocaleDateString('en-CA', { timeZone: tz })
  const publicationWeekday = now.toLocaleDateString('ru-RU', { timeZone: tz, weekday: 'long' })
  const currentDate = publicationDate
  const currentWeekday = publicationWeekday
  return {
    publicationDate,
    publicationWeekday,
    currentDate,
    currentWeekday,
  }
}
