export function tagsCoverSelection(interestTags: string[], selectedTags: string[]): boolean {
  if (!selectedTags.length) return false
  const set = new Set(interestTags)
  return selectedTags.every((tag) => set.has(tag))
}
