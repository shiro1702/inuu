import { createHash } from 'node:crypto'

export function buildWebSourceExternalId(sourceUrl: string): string {
  const normalized = sourceUrl.trim().replace(/\/$/, '')
  let hostname = 'unknown'
  try {
    hostname = new URL(normalized).hostname
  } catch {
    // keep unknown
  }
  const hash = createHash('sha256').update(normalized).digest('hex').slice(0, 16)
  return `web:${hostname}:${hash}`
}
