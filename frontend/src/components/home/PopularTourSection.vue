<script setup lang="ts">
// @ts-ignore
import attractions from '../../mock/attractions.json'

const tours = (attractions.items as Array<{
  contentid: string
  title: string
  addr1: string
  addr2: string
  firstimage: string
  firstimage2: string
}>).slice(0, 3).map((item) => ({
  id: item.contentid,
  name: item.title,
  region: item.addr1,
  description: '서울의 대표 관광지 정보입니다.',
  imageUrl: item.firstimage2 || item.firstimage,
}))
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Tour Spotlight</p>
        <h2 class="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">인기 관광지는?</h2>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-3">
      <article
        v-for="tour in tours"
        :key="tour.id"
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      >
        <img
          v-if="tour.imageUrl"
          :src="tour.imageUrl"
          :alt="tour.name"
          class="h-40 w-full object-cover"
        />
        <div v-else class="flex h-40 items-center justify-center bg-gray-200 text-sm text-gray-500">
          사진 없음
        </div>
        <div class="p-5">
          <h3 class="text-lg font-semibold text-gray-900">{{ tour.name }}</h3>
          <p class="mt-1 text-sm text-gray-500">{{ tour.region }}</p>
          <p class="mt-3 text-sm text-gray-600">{{ tour.description }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
