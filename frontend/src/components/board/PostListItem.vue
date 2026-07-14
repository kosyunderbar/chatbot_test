<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue'
import type { BoardPost } from '../../types/board'

interface Props {
  post: BoardPost
}

const props = defineProps<Props>()

const categoryMap: Record<BoardPost['category'], string> = {
  free: '자유',
  question: '질문',
  recommendation: '추천',
}
</script>

<template>
  <BaseCard>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">{{ categoryMap[props.post.category] }}</span>
          <h2 class="text-base font-semibold text-gray-900">{{ props.post.title }}</h2>
        </div>
        <div class="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
          <span>작성자 {{ props.post.author }}</span>
          <span>{{ props.post.createdAt }}</span>
          <span>조회 {{ props.post.viewCount }}</span>
          <span>댓글 {{ props.post.commentCount }}</span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
