<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue'
import type { BoardPost } from '../../types/board'

interface Props {
  post: BoardPost
}

const props = defineProps<Props>()

const categoryMap: Record<string, string> = {
  free: '자유',
  question: '질문',
  recommendation: '추천',
  food: 'food',
}
</script>

<template>
  <router-link :to="{ name: 'post-detail', params: { id: String(props.post.id) } }">
    <BaseCard>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">{{ categoryMap[props.post.category] ?? props.post.category }}</span>
            <h2 class="text-base font-semibold text-gray-900">{{ props.post.title }}</h2>
          </div>
          <div class="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
            <span>작성자 {{ props.post.author ?? '-' }}</span>
            <span>{{ props.post.createdAt }}</span>
            <span>조회 {{ props.post.viewCount ?? 0 }}</span>
            <span>댓글 {{ props.post.commentCount ?? 0 }}</span>
            <span v-if="props.post.likeCount !== undefined">좋아요 {{ props.post.likeCount }}</span>
          </div>
          <p v-if="props.post.locationType === 'tour'" class="mt-2 text-sm text-sky-700">{{ props.post.tourTitle }} · {{ props.post.tourAddress }}</p>
          <div v-if="props.post.tags && props.post.tags.length" class="mt-2 flex flex-wrap gap-2">
            <span v-for="tag in props.post.tags" :key="tag" class="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">#{{ tag }}</span>
          </div>
        </div>
      </div>
    </BaseCard>
  </router-link>
</template>
