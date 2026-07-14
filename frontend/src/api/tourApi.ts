import httpClient from './httpClient'
import type { TourCategory, TourItem, TourListQuery, TourListResult } from '../types/tour'

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
  category,
  keyword,
  page = 1,
  size = 12,
}: {
  category?: TourCategory | 'all'
  keyword?: string
  page?: number
  size?: number
} = {}): Promise<TourListResult> => {
  const params: Record<string, string | number | undefined> = {
    limit: size,
    offset: (page - 1) * size,
  }

  const normalizedKeyword = keyword?.trim()
  if (normalizedKeyword) {
    params.keyword = normalizedKeyword
  }

  if (category && category !== 'all') {
    params.category = category
  }

  const response = await httpClient.get<LocationListApiResponse>('/api/locations', {
    params,
  })

  const items = response.data.items
    .map(mapLocationToTourItem)
    .filter((item): item is TourItem => item !== null)

  return {
    items,
    total: response.data.total,
    page,
    size,
  }
}

export const getTours = async (params: TourListQuery): Promise<TourListResult> => {
  const { page, size, category, keyword } = params

  return fetchLocations({
    category: category === 'all' ? undefined : (category as TourCategory | undefined),
    keyword,
    page,
    size,
  })
}

export const getTourById = async (contentId: string): Promise<TourItem> => {
  const response = await httpClient.get<LocationApiItem>(`/api/locations/${contentId}`)
  const item = mapLocationToTourItem(response.data)
  if (!item) throw new Error('지원하지 않는 관광지 유형입니다.')
  return item
}
