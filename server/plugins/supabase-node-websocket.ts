import { WebSocket } from 'ws'
import { defineNitroPlugin } from 'nitropack/runtime'

/**
 * Node.js 20 has no global WebSocket; Supabase Realtime expects one on the server.
 * @see https://supabase.com/docs/guides/realtime
 */
export default defineNitroPlugin(() => {
  if (typeof globalThis.WebSocket === 'undefined') {
    globalThis.WebSocket = WebSocket as unknown as typeof globalThis.WebSocket
  }
})
