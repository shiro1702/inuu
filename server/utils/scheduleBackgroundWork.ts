import type { H3Event } from 'h3'

type WaitUntilEvent = H3Event & {
  waitUntil?: (promise: Promise<unknown>) => void
}

export async function runOrScheduleBackground(
  event: H3Event,
  work: () => Promise<unknown>,
): Promise<{ scheduled: boolean }> {
  const promise = work()
  const waitUntil = (event as WaitUntilEvent).waitUntil
  if (typeof waitUntil === 'function') {
    waitUntil(promise)
    return { scheduled: true }
  }
  await promise
  return { scheduled: false }
}
