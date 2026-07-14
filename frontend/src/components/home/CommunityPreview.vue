<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getBoardPosts } from '../../repositories/boardRepository'
import type { BoardPost } from '../../types/board'

const posts = ref<BoardPost[]>([])
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  try {
    posts.value = await getBoardPosts({ size: 3, sort: 'likes' })
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-gray-900">커뮤니티 인기글</h2>
      <RouterLink to="/community" class="text-sm font-medium text-sky-600 hover:text-sky-700">커뮤니티 전체 보기</RouterLink>
    </div>

    <div v-if="isLoading" class="rounded-2xl border border-gray-200 bg-white p-5 text-center text-sm text-gray-500">인기글을 불러오는 중입니다.</div>
    <div v-else-if="posts.length" class="space-y-4">
      <RouterLink v-for="post in posts" :key="post.id" :to="{ name: 'post-detail', params: { id: String(post.id) } }" class="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-sky-300">
        <h3 class="text-lg font-semibold text-gray-900">{{ post.title }}</h3>
        <div class="mt-2 flex items-center gap-4 text-sm text-gray-500"><span>{{ post.createdAt }}</span><span>좋아요 {{ post.likeCount }}</span><span>조회 {{ post.viewCount }}</span></div>
      </RouterLink>
    </div>
    <p v-else class="rounded-2xl border border-gray-200 bg-white p-5 text-center text-sm text-gray-500">표시할 인기글이 없습니다.</p>
  </section>
</template>
