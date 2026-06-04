export function formatEventStartsAtRu(
  startsAt: string | null | undefined,
  timeZone: string,
): string {
  if (!startsAt) return 'Дата уточняется'
  const date = new Date(startsAt)
  if (Number.isNaN(date.getTime())) return 'Дата уточняется'
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone,
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
