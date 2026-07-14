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

<<<<<<< HEAD
export const getMockTours = async (): Promise<TourItem[]> => {
  return fetchLocations({ category: 'all' })
}

export const getMockToursByCategory = async (
  category: TourCategory | 'all' = 'all',
  limit?: number,
): Promise<TourItem[]> => {
  return fetchLocations({ category, limit })
=======
export const getMockTours = async (category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  if (category === 'all') {
    return getAllMockTours()
  }

  return getAllMockTours().filter((item) => item.category === category)
>>>>>>> df91493eae76a6d3065ebbbb02faecea473d1453
}

export const getMockToursByCategory = async (category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  return getMockTours(category)
}

export const searchMockTours = async (keyword: string, category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
<<<<<<< HEAD
  return fetchLocations({ category, keyword })
=======
  const normalizedKeyword = keyword.trim().toLowerCase()
  const source = await getMockTours(category)

  if (!normalizedKeyword) {
    return source
  }

  return source.filter((item) => {
    const haystack = `${item.title} ${item.address}`.toLowerCase()
    return haystack.includes(normalizedKeyword)
  })
>>>>>>> df91493eae76a6d3065ebbbb02faecea473d1453
}
