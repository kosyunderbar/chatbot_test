// @ts-ignore
import attractions from '../mock/attractions.json'
// @ts-ignore
import leisure from '../mock/leisure.json'
// @ts-ignore
import culture from '../mock/culture.json'
// @ts-ignore
import shopping from '../mock/shopping.json'
// @ts-ignore
import accommodation from '../mock/accommodation.json'
// @ts-ignore
import courses from '../mock/courses.json'
// @ts-ignore
import festivals from '../mock/festivals.json'
import type { TourApiResponse, TourCategory, TourItem } from '../types/tour'

const datasets: Array<{ data: TourApiResponse; category: TourCategory }> = [
  { data: attractions as TourApiResponse, category: 'attraction' },
  { data: leisure as TourApiResponse, category: 'leisure' },
  { data: culture as TourApiResponse, category: 'culture' },
  { data: shopping as TourApiResponse, category: 'shopping' },
  { data: accommodation as TourApiResponse, category: 'accommodation' },
  { data: courses as TourApiResponse, category: 'course' },
  { data: festivals as TourApiResponse, category: 'festival' },
]

const mapToTourItem = (item: TourApiResponse['items'][number], category: TourCategory): TourItem => ({
  id: item.contentid,
  title: item.title,
  category,
  address: [item.addr1, item.addr2].filter(Boolean).join(' '),
  imageUrl: item.firstimage || '',
  thumbnailUrl: item.firstimage2 || '',
  longitude: item.mapx ? Number(item.mapx) : null,
  latitude: item.mapy ? Number(item.mapy) : null,
  telephone: item.tel || '',
})

const getAllMockTours = (): TourItem[] => {
  return datasets.flatMap(({ data, category }) => data.items.map((item) => mapToTourItem(item, category)))
}

export const getMockTours = async (category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  if (category === 'all') {
    return getAllMockTours()
  }

  return getAllMockTours().filter((item) => item.category === category)
}

export const getMockToursByCategory = async (category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  return getMockTours(category)
}

export const searchMockTours = async (keyword: string, category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  const normalizedKeyword = keyword.trim().toLowerCase()
  const source = await getMockTours(category)

  if (!normalizedKeyword) {
    return source
  }

  return source.filter((item) => {
    const haystack = `${item.title} ${item.address}`.toLowerCase()
    return haystack.includes(normalizedKeyword)
  })
}
