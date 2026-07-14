import httpClient from './httpClient'
import type { TourCategory, TourItem } from '../types/tour'

interface LocationApiItem {
  id: number
  contentid: string
  contenttypeid: string
  content_type_name: string
  title: string
  addr1: string
  addr2: string
  tel: string
  mapx: number | null
  mapy: number | null
  firstimage: string
  firstimage2: string
}

interface LocationListApiResponse {
  items: LocationApiItem[]
  total: number
  category: string
  keyword: string | null
}

const CONTENTTYPE_ID_TO_CATEGORY: Record<string, TourCategory> = {
  '12': 'attraction',
  '28': 'leisure',
  '14': 'culture',
  '38': 'shopping',
  '32': 'accommodation',
  '25': 'course',
  '15': 'festival',
}

const mapLocationToTourItem = (item: LocationApiItem): TourItem | null => {
  const category = CONTENTTYPE_ID_TO_CATEGORY[item.contenttypeid]

  if (!category) {
    return null
  }

  return {
    id: item.contentid,
    title: item.title,
    category,
    address: [item.addr1, item.addr2].filter(Boolean).join(' '),
    imageUrl: item.firstimage2 || item.firstimage || '',
    thumbnailUrl: item.firstimage2 || item.firstimage || '',
    longitude: item.mapx,
    latitude: item.mapy,
    telephone: item.tel || '',
  }
}

const fetchLocations = async ({
  category = 'all',
  keyword,
  limit,
}: {
  category?: TourCategory | 'all'
  keyword?: string
  limit?: number
} = {}): Promise<TourItem[]> => {
  const response = await httpClient.get<LocationListApiResponse>('/api/locations', {
    params: {
      category,
      keyword: keyword?.trim() || undefined,
      limit,
    },
  })

  return response.data.items
    .map(mapLocationToTourItem)
    .filter((item): item is TourItem => item !== null)
}

export const getMockTours = async (category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  return fetchLocations({ category })
}

export const getMockToursByCategory = async (category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  return fetchLocations({ category })
}

export const searchMockTours = async (keyword: string, category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  return fetchLocations({ category, keyword })
}
