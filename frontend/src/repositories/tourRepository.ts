import {
  getMockToursByCategory as getMockToursByCategoryApi,
  searchMockTours as searchMockToursApi,
} from '../api/tourApi'
import { useMockApi } from '../config/appConfig'
import type { TourCategory, TourItem } from '../types/tour'

const throwFastApiNotReady = (): never => {
  throw new Error('FastAPI 연동이 아직 준비되지 않았습니다.')
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
