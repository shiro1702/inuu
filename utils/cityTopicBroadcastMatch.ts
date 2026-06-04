export function eventTopicTagsMatchInterest(
  eventTopicTags: string[],
  interestTags: string[],
): boolean {
  const eventTags = eventTopicTags.map((t) => String(t || '').trim().toLowerCase()).filter(Boolean)
  const interests = interestTags.map((t) => String(t || '').trim().toLowerCase()).filter(Boolean)
  if (!interests.length) return true
  if (!eventTags.length) return true
  return eventTags.some((tag) => interests.includes(tag))
}
