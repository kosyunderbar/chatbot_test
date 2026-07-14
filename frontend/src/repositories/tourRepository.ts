import { getTours as getToursApi } from '../api/tourApi'
import type { TourCategory, TourItem, TourListQuery, TourListResult } from '../types/tour'

export const getMockToursByCategory = async (category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  const result = await getToursApi({
    page: 1,
    size: 1000,
    category: category === 'all' ? undefined : category,
  })

  return result.items
}

export const getMockTours = async (category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  return getMockToursByCategory(category)
}

export const searchMockTours = async (keyword: string, category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  const result = await getToursApi({
    page: 1,
    size: 1000,
    category: category === 'all' ? undefined : category,
    keyword,
  })

  return result.items
}

export const getPopularTours = async (): Promise<TourItem[]> => {
  const result = await getToursApi({
    page: 1,
    size: 3,
    category: 'attraction',
  })

  return result.items
}

export const getTours = async (params: TourListQuery): Promise<TourListResult> => {
  return getToursApi(params)
}
