<script setup lang="ts">
import BaseCard from '../common/BaseCard.vue'

interface Props {
  title: string
  category: string
  author: string
  date: string
  views: number
  comments: number
}

const props = defineProps<Props>()
</script>

<template>
  <BaseCard>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">{{ props.category }}</span>
          <h2 class="text-base font-semibold text-gray-900">{{ props.title }}</h2>
        </div>
        <div class="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
          <span>작성자 {{ props.author }}</span>
          <span>{{ props.date }}</span>
          <span>조회 {{ props.views }}</span>
          <span>댓글 {{ props.comments }}</span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
