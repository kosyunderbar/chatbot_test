<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { searchMockTours, getMockToursByCategory } from '../api/tourApi'
import TourFilter from '../components/tour/TourFilter.vue'
import TourGrid from '../components/tour/TourGrid.vue'
import TourSearchBar from '../components/tour/TourSearchBar.vue'
import type { TourCategory, TourItem } from '../types/tour'

const keyword = ref('')
const selectedCategory = ref<TourCategory | 'all'>('all')
const tours = ref<TourItem[]>([])
const isLoading = ref(false)

const loadTours = async () => {
  isLoading.value = true
  try {
    tours.value = await getMockToursByCategory(selectedCategory.value)
    if (keyword.value.trim()) {
      tours.value = await searchMockTours(keyword.value, selectedCategory.value)
    }
  } finally {
    isLoading.value = false
  }
}

const handleSearch = async () => {
  await loadTours()
}

onMounted(async () => {
  await loadTours()
})
</script>

<template>
  <main class="bg-gray-50 py-8">
    <div class="space-y-6">
      <TourSearchBar v-model="keyword" @search="handleSearch" />
      <TourFilter v-model="selectedCategory" />

      <div v-if="isLoading" class="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-gray-500">
        불러오는 중입니다...
      </div>
      <TourGrid v-else :tours="tours" />
    </div>

    <p class="mt-8 px-4 pb-6 text-center text-xs text-gray-400 sm:px-6 lg:px-8">
      이 서비스는 한국관광공사 Tour API(TourAPI 4.0)의 데이터를 활용하였습니다.
    </p>
  </main>
</template>
