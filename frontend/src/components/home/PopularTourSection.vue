<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getPopularTours } from '../../repositories/tourRepository'
import type { TourItem } from '../../types/tour'

const tours = ref<TourItem[]>([])
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true

  try {
    tours.value = await getPopularTours()
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Tour Spotlight</p>
        <h2 class="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">인기 관광지는?</h2>
      </div>
    </div>

    <div v-if="isLoading" class="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500">
      인기 관광지를 불러오는 중입니다...
    </div>

    <div v-else class="grid gap-6 md:grid-cols-3">
      <article
        v-for="tour in tours"
        :key="tour.id"
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      >
        <img
          v-if="tour.imageUrl"
          :src="tour.imageUrl"
          :alt="tour.title"
          class="h-40 w-full object-cover"
        />
        <div v-else class="flex h-40 items-center justify-center bg-gray-200 text-sm text-gray-500">
          사진 없음
        </div>
        <div class="p-5">
          <h3 class="text-lg font-semibold text-gray-900">{{ tour.title }}</h3>
          <p class="mt-1 text-sm text-gray-500">{{ tour.address || '주소 정보 없음' }}</p>
          <p class="mt-3 text-sm text-gray-600">{{ tour.category }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
