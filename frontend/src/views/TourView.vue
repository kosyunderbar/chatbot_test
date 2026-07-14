<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import BasePagination from '../components/common/BasePagination.vue'
import TourFilter from '../components/tour/TourFilter.vue'
import TourGrid from '../components/tour/TourGrid.vue'
import TourSearchBar from '../components/tour/TourSearchBar.vue'
import { useTourStore } from '../stores/tourStore'

const tourStore = useTourStore()
const { keyword, selectedCategory, tours, currentPage, totalPages, isLoading, errorMessage } = storeToRefs(tourStore)

const handleSearch = async () => {
  await tourStore.searchTours()
}

const handlePageChange = async (page: number) => {
  await tourStore.changePage(page)
}

onMounted(async () => {
  await tourStore.fetchTours()
})
</script>

<template>
  <main class="bg-gray-50 py-8">
    <div class="space-y-6">
      <TourSearchBar v-model="keyword" @search="handleSearch" />
      <TourFilter :model-value="selectedCategory" @update:model-value="tourStore.changeCategory($event)" />

      <div v-if="isLoading" class="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-gray-500">
        불러오는 중입니다...
      </div>
      <div v-else-if="errorMessage" class="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-red-500">
        {{ errorMessage }}
      </div>
      <template v-else>
        <TourGrid :tours="tours" />
        <BasePagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="handlePageChange"
        />
      </template>
    </div>

    <p class="mt-8 px-4 pb-6 text-center text-xs text-gray-400 sm:px-6 lg:px-8">
      이 서비스는 한국관광공사 Tour API(TourAPI 4.0)의 데이터를 활용하였습니다.
    </p>
  </main>
</template>
