<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import PostForm from '../components/board/PostForm.vue'
import { useBoardStore } from '../stores/boardStore'
import type { PostFormData } from '../types/board'

const router = useRouter()
const boardStore = useBoardStore()
const { isSubmitting, errorMessage } = storeToRefs(boardStore)

const handleSubmit = async (payload: PostFormData) => {
  const created = await boardStore.createPost(payload)
  if (created) {
    router.push({ name: 'post-detail', params: { id: String(created.id) } })
  }
}

const handleCancel = () => {
  router.push({ name: 'community' })
}
</script>

<template>
  <main class="bg-gray-50 py-8">
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-semibold text-gray-900">게시글 작성</h1>
        <p class="text-sm text-gray-500">새로운 게시글을 작성하고 등록하세요.</p>
      </div>
      <div class="space-y-4">
        <PostForm submitLabel="작성하기" :loading="isSubmitting" @submit="handleSubmit" @cancel="handleCancel" />
        <div v-if="errorMessage" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ errorMessage }}</div>
      </div>
    </section>
  </main>
</template>
