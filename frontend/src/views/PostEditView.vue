<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import PostForm from '../components/board/PostForm.vue'
import BaseEmpty from '../components/common/BaseEmpty.vue'
import { useBoardStore } from '../stores/boardStore'
import type { PostFormData } from '../types/board'

const route = useRoute()
const router = useRouter()
const boardStore = useBoardStore()
const { selectedPost, isLoading, isSubmitting, errorMessage } = storeToRefs(boardStore)
const postId = Number(route.params.id)

onMounted(async () => {
  await boardStore.fetchPostById(postId)
})

const handleSubmit = async (payload: PostFormData) => {
  const updated = await boardStore.updatePost(postId, payload)
  if (updated) {
    router.push({ name: 'post-detail', params: { id: String(updated.id) } })
  }
}

const handleCancel = () => {
  router.push({ name: 'post-detail', params: { id: String(postId) } })
}
</script>

<template>
  <main class="bg-gray-50 py-8">
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-semibold text-gray-900">게시글 수정</h1>
        <p class="text-sm text-gray-500">기존 게시글 내용을 수정하고 저장하세요.</p>
      </div>
      <div class="space-y-4">
        <div v-if="isLoading" class="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
          불러오는 중입니다...
        </div>
        <div v-else-if="selectedPost">
          <PostForm
            :initialData="{ title: selectedPost.title, content: selectedPost.content, region: selectedPost.region, category: selectedPost.category, tags: selectedPost.tags, existingImages: selectedPost.images }"
            submitLabel="수정하기"
            :loading="isSubmitting"
            @submit="handleSubmit"
            @cancel="handleCancel"
          />
        </div>
        <div v-else class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <BaseEmpty title="게시글을 찾을 수 없습니다." description="존재하지 않는 게시글이거나 삭제된 게시글입니다." />
        </div>
        <div v-if="errorMessage" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ errorMessage }}</div>
      </div>
    </section>
  </main>
</template>
