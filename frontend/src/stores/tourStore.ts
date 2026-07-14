import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getTours } from '../repositories/tourRepository'
import type { TourCategory, TourItem } from '../types/tour'

export const useTourStore = defineStore('tour', () => {
  const tours = ref<TourItem[]>([])
  const keyword = ref('')
  const selectedCategory = ref<TourCategory | 'all'>('all')
  const currentPage = ref(1)
  const pageSize = ref(12)
  const totalTours = ref(0)
  const isLoading = ref(false)
  const errorMessage = ref('')

  const totalPages = computed(() => {
    if (totalTours.value <= 0) {
      return 1
    }

    return Math.ceil(totalTours.value / pageSize.value)
  })

  const fetchTours = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const query = {
        page: currentPage.value,
        size: pageSize.value,
        category: selectedCategory.value === 'all' ? undefined : selectedCategory.value,
        keyword: keyword.value.trim() || undefined,
      }

      const result = await getTours(query)
      tours.value = result.items
      totalTours.value = result.total
      currentPage.value = result.page
    } catch {
      errorMessage.value = '관광 데이터를 불러오지 못했습니다.'
      tours.value = []
      totalTours.value = 0
    } finally {
      isLoading.value = false
    }
  }

  const searchTours = async () => {
    currentPage.value = 1
    await fetchTours()
  }

  const changeCategory = async (category: TourCategory | 'all') => {
    selectedCategory.value = category
    currentPage.value = 1
    await fetchTours()
  }

  const changePage = async (page: number) => {
    if (page < 1 || page > totalPages.value) {
      return
    }

    currentPage.value = page
    await fetchTours()

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const setKeyword = (value: string) => {
    keyword.value = value
  }

  const resetFilters = async () => {
    keyword.value = ''
    selectedCategory.value = 'all'
    currentPage.value = 1
    await fetchTours()
  }

  return {
    tours,
    keyword,
    selectedCategory,
    currentPage,
    pageSize,
    totalTours,
    totalPages,
    isLoading,
    errorMessage,
    fetchTours,
    searchTours,
    changeCategory,
    changePage,
    setKeyword,
    resetFilters,
  }
})
