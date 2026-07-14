<script setup lang="ts">
import { computed } from 'vue'
import BaseEmpty from '../common/BaseEmpty.vue'
import TourCard from './TourCard.vue'
import type { TourItem } from '../../types/tour'

interface Props {
  tours: TourItem[]
}

const props = defineProps<Props>()
const visibleTours = computed(() => props.tours.slice(0, 12))
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div v-if="visibleTours.length" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <TourCard v-for="tour in visibleTours" :key="tour.id" :item="tour" />
    </div>
    <BaseEmpty v-else title="검색 결과가 없습니다." description="다른 키워드나 카테고리로 다시 검색해 보세요." />
  </section>
</template>
