export type ParseAttempt = {
  ok: boolean
  attempt: number
  model?: string
  raw?: string
  error?: string
  usage?: {
    promptTokens: number | null
    completionTokens: number | null
    totalTokens: number | null
  }
}
