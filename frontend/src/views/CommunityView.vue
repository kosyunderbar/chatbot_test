<script setup lang="ts">
import BoardCategoryFilter from '../components/board/BoardCategoryFilter.vue'
import BoardHeader from '../components/board/BoardHeader.vue'
import BoardSearchBar from '../components/board/BoardSearchBar.vue'
import PostList from '../components/board/PostList.vue'
</script>

<template>
  <main class="bg-gray-50 py-8">
    <div class="space-y-6">
      <BoardHeader />
      <BoardSearchBar />
      <BoardCategoryFilter />
      <PostList />
    </div>
  </main>
</template>
