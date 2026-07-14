<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import BoardCategoryFilter from '../components/board/BoardCategoryFilter.vue'
import BoardHeader from '../components/board/BoardHeader.vue'
import BoardSearchBar from '../components/board/BoardSearchBar.vue'
import PostList from '../components/board/PostList.vue'
import { useBoardStore } from '../stores/boardStore'

const boardStore = useBoardStore(); const route = useRoute()
const { keyword, selectedCategory, posts, isLoading, errorMessage } = storeToRefs(boardStore)
onMounted(async () => { if (route.query.category === 'food') await boardStore.changeCategory('food'); else await boardStore.fetchPosts() })
</script>
<template><main class="bg-gray-50 py-8"><div class="space-y-6"><BoardHeader /><BoardSearchBar v-model="keyword" @search="boardStore.searchPosts" /><BoardCategoryFilter :model-value="selectedCategory" @update:model-value="boardStore.changeCategory($event)" /><PostList :posts="posts" :is-loading="isLoading" :error-message="errorMessage" /></div></main></template>
