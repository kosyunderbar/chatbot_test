<script setup lang="ts">
const categories = [
  { icon: '🏛️', title: '관광', description: '서울의 대표 명소를 둘러보세요.' },
  { icon: '🍜', title: '맛집', description: '가성비 좋은 맛집 정보를 확인해보세요.' },
  { icon: '🎭', title: '문화', description: '전시와 공연을 놓치지 마세요.' },
  { icon: '🛍️', title: '쇼핑', description: '핫한 쇼핑 스팟을 탐색해보세요.' },
]
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="category in categories"
        :key="category.title"
        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div class="text-3xl">{{ category.icon }}</div>
        <h3 class="mt-4 text-lg font-semibold text-gray-900">{{ category.title }}</h3>
        <p class="mt-2 text-sm text-gray-600">{{ category.description }}</p>
      </div>
    </div>
  </section>
</template>
