<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { getTourById } from '../api/tourApi'
import { getMapPopularPosts } from '../api/mapApi'
import { TOUR_CATEGORY_LABELS, type TourItem } from '../types/tour'
import type { MapPopularPost } from '../types/map'

const route = useRoute()
const router = useRouter()
const tour = ref<TourItem | null>(null)
const posts = ref<MapPopularPost[]>([])
const loading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const id = String(route.params.id)
    tour.value = await getTourById(id)
    posts.value = (await getMapPopularPosts(id)).data.items
  } catch {
    errorMessage.value = '관광지 정보를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="bg-gray-50 py-8"><section class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
    <button type="button" class="mb-5 text-sm font-medium text-sky-600" @click="router.push('/tour')">← 관광 목록</button>
    <div v-if="loading" class="rounded-2xl bg-white p-10 text-center text-gray-500">관광지 정보를 불러오는 중...</div>
    <div v-else-if="errorMessage" class="rounded-2xl bg-white p-10 text-center text-red-600">{{ errorMessage }}</div>
    <template v-else-if="tour"><article class="overflow-hidden rounded-2xl bg-white shadow-sm"><img v-if="tour.imageUrl" :src="tour.imageUrl" :alt="tour.title" class="h-80 w-full object-cover" /><div v-else class="flex h-80 items-center justify-center bg-gray-200 text-gray-500">이미지 없음</div><div class="p-6"><p class="text-sm text-sky-600">{{ TOUR_CATEGORY_LABELS[tour.category] }}</p><h1 class="mt-2 text-3xl font-semibold text-gray-900">{{ tour.title }}</h1><p class="mt-6 text-gray-700">{{ tour.address || '주소 정보 없음' }}</p><p class="mt-3 text-gray-700">{{ tour.telephone || '전화 정보 없음' }}</p></div></article><section class="mt-6 rounded-2xl bg-white p-6 shadow-sm"><h2 class="text-xl font-semibold text-gray-900">{{ tour.title }} 인기 게시글</h2><p class="mt-1 text-sm text-gray-500">좋아요 수 기준 상위 3개</p><p v-if="!posts.length" class="py-8 text-center text-sm text-gray-500">이 장소와 연결된 게시글이 없습니다.</p><div v-else class="mt-4 space-y-3"><RouterLink v-for="post in posts" :key="post.id" :to="{ name: 'post-detail', params: { id: String(post.id) } }" class="block rounded-xl bg-gray-50 p-4 hover:bg-sky-50"><p class="font-medium text-gray-900">{{ post.title }}</p><div class="mt-2 flex gap-3 text-sm text-gray-500"><span>조회 {{ post.view_count }}</span><span>댓글 {{ post.comment_count }}</span><span>좋아요 {{ post.like_count }}</span></div></RouterLink></div></section></template>
  </section></main>
</template>
