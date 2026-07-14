import {
  getMockToursByCategory as getMockToursByCategoryApi,
  searchMockTours as searchMockToursApi,
} from '../api/tourApi'
import type { TourCategory, TourItem } from '../types/tour'

export const getMockToursByCategory = async (category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  return getMockToursByCategoryApi(category)
}

export const getMockTours = async (category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  return getMockToursByCategoryApi(category)
}

export const searchMockTours = async (keyword: string, category: TourCategory | 'all' = 'all'): Promise<TourItem[]> => {
  return searchMockToursApi(keyword, category)
}

export const getPopularTours = async (): Promise<TourItem[]> => {
  const tours = await getMockToursByCategoryApi('attraction')
  return tours.slice(0, 3)
}
