import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getMockToursByCategory, searchMockTours } from '../repositories/tourRepository'
import type { TourCategory, TourItem } from '../types/tour'

export const useTourStore = defineStore('tour', () => {
  const tours = ref<TourItem[]>([])
  const keyword = ref('')
  const selectedCategory = ref<TourCategory | 'all'>('all')
  const isLoading = ref(false)
  const errorMessage = ref('')

  const fetchTours = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      tours.value = await getMockToursByCategory(selectedCategory.value)
    } catch (error) {
      errorMessage.value = '관광 데이터를 불러오지 못했습니다.'
      tours.value = []
    } finally {
      isLoading.value = false
    }
  }

  const searchTours = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      tours.value = await searchMockTours(keyword.value, selectedCategory.value)
    } catch (error) {
      errorMessage.value = '검색 결과를 불러오지 못했습니다.'
      tours.value = []
    } finally {
      isLoading.value = false
    }
  }

  const changeCategory = async (category: TourCategory | 'all') => {
    selectedCategory.value = category

    if (keyword.value.trim()) {
      await searchTours()
    } else {
      await fetchTours()
    }
  }

  const setKeyword = (value: string) => {
    keyword.value = value
  }

  const resetFilters = async () => {
    keyword.value = ''
    selectedCategory.value = 'all'
    await fetchTours()
  }

  return {
    tours,
    keyword,
    selectedCategory,
    isLoading,
    errorMessage,
    fetchTours,
    searchTours,
    changeCategory,
    setKeyword,
    resetFilters,
  }
})
