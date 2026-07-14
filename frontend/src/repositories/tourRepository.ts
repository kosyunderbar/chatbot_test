import {
  getMockToursByCategory as getMockToursByCategoryApi,
  searchMockTours as searchMockToursApi,
} from '../api/tourApi'
import { useMockApi } from '../config/appConfig'
import type { TourCategory, TourItem, TourApiItem, TourApiResponse } from '../types/tour'

const throwFastApiNotReady = (): never => {
  throw new Error('FastAPI 연동이 아직 준비되지 않았습니다.')
}

/**
 * Repository for Tour operations
 * Currently uses Mock API; will switch to FastAPI once backend is ready
 * API DTOs are imported for type safety and future backend integration
 *
 * Transform logic from TourApiItem to TourItem will be implemented here
 * when FastAPI is ready
 */

/**
 * Transform TourApiItem (API DTO with snake_case) to TourItem (UI type with camelCase)
 * Used when FastAPI integration is complete
 */
export function transformTourApiItemToTourItem(item: TourApiItem): TourItem {
  return {
    id: item.contentid,
    title: item.title,
    category: 'attraction',
    address: `${item.addr1} ${item.addr2}`.trim(),
    imageUrl: item.firstimage,
    thumbnailUrl: item.firstimage2,
    longitude: item.mapx ? parseFloat(item.mapx) : null,
    latitude: item.mapy ? parseFloat(item.mapy) : null,
    telephone: item.tel,
  }
}

/**
 * Transform TourApiResponse (API DTO list) to TourItem[] (UI type)
 * Used when FastAPI integration is complete
 */
export function transformTourApiResponseToTourItems(response: TourApiResponse): TourItem[] {
  return response.items.map(transformTourApiItemToTourItem)
}

export const getMockToursByCategory = async (category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  if (!useMockApi) {
    throwFastApiNotReady()
  }

  return getMockToursByCategoryApi(category)
}

export const searchMockTours = async (keyword: string, category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  if (!useMockApi) {
    throwFastApiNotReady()
  }

  return searchMockToursApi(keyword, category)
}
