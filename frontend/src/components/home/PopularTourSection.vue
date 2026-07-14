<script setup lang="ts">
const tours = [
  { name: '경복궁', region: '종로구', description: '전통과 역사가 살아 숨 쉬는 대표 관광지입니다.' },
  { name: '한강공원', region: '여의도', description: '도심 속 자연을 만끽할 수 있는 산책 명소입니다.' },
  { name: '홍대', region: '마포구', description: '트렌디한 문화와 맛집이 모여 있는 핫플레이스입니다.' },
]
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-gray-900">인기 관광지</h2>
    </div>

    <div class="grid gap-6 md:grid-cols-3">
      <article
        v-for="tour in tours"
        :key="tour.name"
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      >
        <div class="h-40 bg-gray-200"></div>
        <div class="p-5">
          <h3 class="text-lg font-semibold text-gray-900">{{ tour.name }}</h3>
          <p class="mt-1 text-sm text-gray-500">{{ tour.region }}</p>
          <p class="mt-3 text-sm text-gray-600">{{ tour.description }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
