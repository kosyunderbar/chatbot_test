<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import BoardCategoryFilter from '../components/board/BoardCategoryFilter.vue'
import BoardHeader from '../components/board/BoardHeader.vue'
import BoardSearchBar from '../components/board/BoardSearchBar.vue'
import PostList from '../components/board/PostList.vue'
import { useBoardStore } from '../stores/boardStore'

const boardStore = useBoardStore()
const { keyword, selectedCategory, posts, isLoading, errorMessage } = storeToRefs(boardStore)

const handleSearch = async () => {
  await boardStore.searchPosts()
}

onMounted(async () => {
  await boardStore.fetchPosts()
})
</script>

<template>
  <main class="bg-gray-50 py-8">
    <div class="space-y-6">
      <BoardHeader />
      <BoardSearchBar v-model="keyword" @search="handleSearch" />
      <BoardCategoryFilter :model-value="selectedCategory" @update:model-value="boardStore.changeCategory($event)" />
      <PostList :posts="posts" :is-loading="isLoading" :error-message="errorMessage" />
    </div>
  </main>
</template>
