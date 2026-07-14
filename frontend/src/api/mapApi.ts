import httpClient from './httpClient'
import type { MapLocationResponse, MapPopularPost } from '../types/map'

export const getMapLocations = (params: {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
  category?: string
  signal?: AbortSignal
}) =>
  httpClient.get<MapLocationResponse>('/api/map/locations', {
    params: {
      min_lat: params.minLat,
      max_lat: params.maxLat,
      min_lng: params.minLng,
      max_lng: params.maxLng,
      category: params.category === 'all' ? undefined : params.category,
    },
    signal: params.signal,
  })

export const getMapPopularPosts = (tourContentId: string) =>
  httpClient.get<{ items: MapPopularPost[] }>(`/api/map/locations/${tourContentId}/popular-posts`)
