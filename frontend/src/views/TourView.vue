<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import BasePagination from '../components/common/BasePagination.vue'
import TourFilter from '../components/tour/TourFilter.vue'
import TourGrid from '../components/tour/TourGrid.vue'
import TourSearchBar from '../components/tour/TourSearchBar.vue'
import { useTourStore } from '../stores/tourStore'

const tourStore = useTourStore(); const route = useRoute()
const { keyword, selectedCategory, tours, currentPage, totalPages, isLoading, errorMessage } = storeToRefs(tourStore)
onMounted(async () => { const category = route.query.category; if (typeof category === 'string' && ['attraction', 'culture', 'shopping', 'food'].includes(category)) await tourStore.changeCategory(category as 'attraction' | 'culture' | 'shopping' | 'food'); else await tourStore.fetchTours() })
</script>
<template><main class="bg-gray-50 py-8"><div class="space-y-6"><TourSearchBar v-model="keyword" @search="tourStore.searchTours" /><TourFilter :model-value="selectedCategory" @update:model-value="tourStore.changeCategory($event)" /><div v-if="isLoading" class="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-gray-500">불러오는 중입니다...</div><div v-else-if="errorMessage" class="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-red-500">{{ errorMessage }}</div><template v-else><TourGrid :tours="tours" /><BasePagination v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages" @change="tourStore.changePage" /></template></div></main></template>
