<script setup lang="ts">
import { RouterLink } from 'vue-router'
const categories = [
  { icon: '🏛️', title: '관광', description: '서울의 대표 명소를 둘러보세요.', to: { path: '/tour', query: { category: 'attraction' } } },
  { icon: '🍜', title: '맛집', description: '가성비 좋은 맛집 정보를 확인해보세요.', to: { path: '/community', query: { category: 'food' } } },
  { icon: '🎭', title: '문화', description: '전시와 공연을 놓치지 마세요.', to: { path: '/tour', query: { category: 'culture' } } },
  { icon: '🛍️', title: '쇼핑', description: '핫한 쇼핑 스팟을 탐색해보세요.', to: { path: '/tour', query: { category: 'shopping' } } },
]
</script>
<template><section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><RouterLink v-for="category in categories" :key="category.title" :to="category.to" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-md"><div class="text-3xl">{{ category.icon }}</div><h3 class="mt-4 text-lg font-semibold text-gray-900">{{ category.title }}</h3><p class="mt-2 text-sm text-gray-600">{{ category.description }}</p><p class="mt-4 text-sm font-medium text-sky-600">둘러보기 →</p></RouterLink></div></section></template>
