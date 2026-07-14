import { readonly, ref } from 'vue'
import { sendPresenceHeartbeat } from '../api/presenceApi'

const activeVisitors = ref(0)
let intervalId: ReturnType<typeof setInterval> | undefined

const heartbeat = async () => {
  try {
    const response = await sendPresenceHeartbeat()
    activeVisitors.value = response.data.active_visitors
  } catch {
    // Presence is non-essential; keep the last known count on a transient failure.
  }
}

export const startPresence = () => {
  void heartbeat()
  if (!intervalId) intervalId = setInterval(() => void heartbeat(), 30_000)
}

export const stopPresence = () => {
  if (intervalId) clearInterval(intervalId)
  intervalId = undefined
}

export const usePresence = () => ({ activeVisitors: readonly(activeVisitors) })
