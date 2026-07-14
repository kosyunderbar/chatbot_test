<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import PostForm from '../components/board/PostForm.vue'
import { useBoardStore } from '../stores/boardStore'
import type { PostFormData } from '../types/board'

const router = useRouter()
const boardStore = useBoardStore()
const { isSubmitting, errorMessage } = storeToRefs(boardStore)
const handleSubmit = async (payload: PostFormData) => { const created = await boardStore.createPost(payload); if (created) router.push({ name: 'post-detail', params: { id: String(created.id) } }) }
</script>

<template>
  <main class="min-h-screen bg-slate-50 py-8 sm:py-12">
    <section class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="relative mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-600 via-sky-600 to-indigo-700 px-7 py-9 text-white shadow-xl shadow-sky-200 sm:px-10">
        <div class="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10"></div>
        <div class="relative"><p class="text-sm font-semibold tracking-[0.18em] text-sky-100">COMMUNITY</p><h1 class="mt-3 text-3xl font-bold sm:text-4xl">새로운 이야기를 들려주세요</h1><p class="mt-3 max-w-2xl text-sm leading-6 text-sky-100 sm:text-base">관광지를 선택하면 같은 장소를 경험한 사람들의 이야기도 함께 연결됩니다.</p></div>
      </div>
      <div class="mb-5 flex items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800"><span class="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">1</span> 별표(*) 항목과 관광지 또는 지역 없음을 선택해 주세요.</div>
      <PostForm submit-label="게시글 등록" :loading="isSubmitting" @submit="handleSubmit" @cancel="router.push({ name: 'community' })" />
      <div v-if="errorMessage" class="mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{{ errorMessage }}</div>
    </section>
  </main>
</template>
