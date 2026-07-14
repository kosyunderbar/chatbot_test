<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import PostDetail from '../components/board/PostDetail.vue'
import PostPasswordModal from '../components/board/PostPasswordModal.vue'
import BaseEmpty from '../components/common/BaseEmpty.vue'
import { useBoardStore } from '../stores/boardStore'

const route = useRoute()
const router = useRouter()
const boardStore = useBoardStore()
const { selectedPost, isLoading, isSubmitting, errorMessage } = storeToRefs(boardStore)
const showPasswordModal = ref(false)

const postId = Number(route.params.id)

onMounted(async () => {
  await boardStore.fetchPostById(postId)
})

const handleEdit = () => {
  if (!selectedPost.value) return
  router.push({ name: 'post-edit', params: { id: String(selectedPost.value.id) } })
}

const handleDelete = () => {
  showPasswordModal.value = true
}

const handleLike = async () => {
  if (selectedPost.value) await boardStore.toggleLike(selectedPost.value)
}

const handleBack = () => {
  router.push({ name: 'community' })
}

const handleConfirmPassword = async (password: string) => {
  if (!selectedPost.value) return
  const success = await boardStore.deletePost(selectedPost.value.id, password)
  if (success) {
    router.push({ name: 'community' })
  }
}
</script>

<template>
  <main class="bg-gray-50 py-8">
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div v-if="isLoading" class="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
        불러오는 중입니다...
      </div>
      <div v-else-if="selectedPost">
        <PostDetail :post="selectedPost" @edit="handleEdit" @delete="handleDelete" @back="handleBack" @like="handleLike" />
      </div>
      <div v-else class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <BaseEmpty title="게시글을 찾을 수 없습니다." description="존재하지 않는 게시글이거나 삭제된 게시글입니다." />
      </div>
      <div v-if="errorMessage" class="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ errorMessage }}</div>
    </section>
    <PostPasswordModal
      :model-value="showPasswordModal"
      title="비밀번호 확인"
      confirmLabel="삭제하기"
      :loading="isSubmitting"
      @update:modelValue="(value) => (showPasswordModal = value)"
      @confirm="handleConfirmPassword"
    />
  </main>
</template>
