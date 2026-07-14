import httpClient from './httpClient'

export interface PresenceResponse {
  active_visitors: number
  expires_in_seconds: number
}

export const sendPresenceHeartbeat = () => httpClient.post<PresenceResponse>('/api/presence/heartbeat')
