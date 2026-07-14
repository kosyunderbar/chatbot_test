<script setup lang="ts">
import { RouterLink } from 'vue-router'

const posts = [
  { title: '주말에 가기 좋은 곳 추천해요', author: '민지', views: 128 },
  { title: '맛집 정보 공유합니다', author: '준호', views: 95 },
  { title: '서울 야경 명소 추천', author: '서연', views: 84 },
]
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-gray-900">커뮤니티 인기글</h2>
      <RouterLink to="/community" class="text-sm font-medium text-sky-600 hover:text-sky-700">
        커뮤니티 전체 보기
      </RouterLink>
    </div>

    <div class="space-y-4">
      <article v-for="post in posts" :key="post.title" class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-900">{{ post.title }}</h3>
        <div class="mt-2 flex items-center gap-4 text-sm text-gray-500">
          <span>{{ post.author }}</span>
          <span>조회 {{ post.views }}</span>
        </div>
      </article>
    </div>
  </section>
</template>
