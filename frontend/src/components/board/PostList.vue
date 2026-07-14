<script setup lang="ts">
import BaseEmpty from '../common/BaseEmpty.vue'
import type { BoardPost } from '../../types/board'
import PostListItem from './PostListItem.vue'

interface Props {
  posts: BoardPost[]
  isLoading?: boolean
  errorMessage?: string
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
  errorMessage: '',
})
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div v-if="isLoading" class="text-center text-sm text-gray-500">불러오는 중입니다...</div>
    <div v-else-if="errorMessage" class="text-center text-sm text-red-500">{{ errorMessage }}</div>
    <div v-else-if="posts.length === 0" class="space-y-4">
      <BaseEmpty title="아직 게시글이 없습니다." description="다른 검색어로 다시 시도해 보세요." />
    </div>
    <div v-else class="space-y-4">
      <PostListItem v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </section>
</template>
