import {
  getMockTours as getMockToursApi,
  searchMockTours as searchMockToursApi,
} from '../api/tourApi'
<<<<<<< HEAD
import type { TourCategory, TourItem } from '../types/tour'

export const getMockToursByCategory = async (category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  return getMockToursByCategoryApi(category)
=======
import type { TourApiItem, TourApiResponse, TourCategory, TourItem } from '../types/tour'

/**
 * Repository for Tour operations.
 * The store only depends on this layer, so future FastAPI integration can be
 * handled by updating this file without changing the rest of the frontend.
 */
export function transformTourApiItemToTourItem(item: TourApiItem): TourItem {
  return {
    id: item.contentid,
    title: item.title,
    category: 'attraction',
    address: [item.addr1, item.addr2].filter(Boolean).join(' '),
    imageUrl: item.firstimage || '',
    thumbnailUrl: item.firstimage2 || '',
    longitude: item.mapx ? Number(item.mapx) : null,
    latitude: item.mapy ? Number(item.mapy) : null,
    telephone: item.tel || '',
  }
}

export function transformTourApiResponseToTourItems(response: TourApiResponse): TourItem[] {
  return response.items.map(transformTourApiItemToTourItem)
}

export const getMockTours = async (category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  return getMockToursApi(category)
}

export const getMockToursByCategory = async (category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  return getMockTours(category)
>>>>>>> df91493eae76a6d3065ebbbb02faecea473d1453
}

export const searchMockTours = async (keyword: string, category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  return searchMockToursApi(keyword, category)
}

export const getPopularTours = async (): Promise<TourItem[]> => {
  return getMockToursByCategoryApi('attraction', 3)
}
