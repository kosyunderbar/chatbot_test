<script setup lang="ts">
import BaseButton from '../common/BaseButton.vue'
import PostShareButtons from './PostShareButtons.vue'
import type { BoardPost } from '../../types/board'

interface Props {
  post: BoardPost
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
  (e: 'back'): void
  (e: 'like'): void
}>()

const handleEdit = () => emit('edit')
const handleDelete = () => emit('delete')
const handleBack = () => emit('back')
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="space-y-4">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-semibold text-gray-900">{{ props.post.title }}</h1>
        <div class="flex flex-wrap gap-2">
          <BaseButton variant="secondary" size="md" @click="handleBack">목록</BaseButton>
          <BaseButton size="md" @click="handleEdit">수정</BaseButton>
          <BaseButton variant="secondary" size="md" @click="handleDelete">삭제</BaseButton>
        </div>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <p class="text-sm text-gray-500">지역</p>
          <p class="mt-2 text-base text-gray-900">{{ props.post.region || '정보 없음' }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">카테고리</p>
          <p class="mt-2 text-base text-gray-900">{{ props.post.category || '정보 없음' }}</p>
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500">관광지</p>
        <p v-if="props.post.locationType === 'tour'" class="mt-2 text-base text-gray-900">{{ props.post.tourTitle }}<span class="ml-2 text-sm text-gray-500">{{ props.post.tourAddress }}</span></p>
        <p v-else class="mt-2 text-base text-gray-500">지역 없음</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <p class="text-sm text-gray-500">작성일</p>
          <p class="mt-2 text-base text-gray-900">{{ props.post.createdAt }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">수정일</p>
          <p class="mt-2 text-base text-gray-900">{{ props.post.updatedAt }}</p>
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500">본문</p>
        <div class="mt-3 whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-5 text-gray-800">{{ props.post.content }}</div>
      </div>
      <PostShareButtons :title="props.post.title" :description="props.post.content" />
      <BaseButton variant="secondary" size="md" @click="emit('like')">{{ props.post.isLiked ? '좋아요 취소' : '좋아요' }} {{ props.post.likeCount }}</BaseButton>
      <div v-if="props.post.tags && props.post.tags.length" class="space-y-2">
        <p class="text-sm text-gray-500">태그</p>
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in props.post.tags" :key="tag" class="rounded-full bg-sky-50 px-2.5 py-1 text-sm text-sky-700">#{{ tag }}</span>
        </div>
      </div>
      <div v-if="props.post.images?.length" class="space-y-2">
        <p class="text-sm text-gray-500">첨부 이미지</p>
        <div class="flex flex-wrap gap-3">
          <img v-for="image in props.post.images" :key="image.id" :src="image.url" :alt="image.original_name" class="h-32 w-auto rounded-xl border border-gray-200 object-cover" />
        </div>
      </div>
    </div>
  </div>
</template>
