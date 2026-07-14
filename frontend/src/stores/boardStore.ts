import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getMockPosts, searchMockPosts } from '../api/boardApi'
import type { BoardPost, PostCategory } from '../types/board'

export const useBoardStore = defineStore('board', () => {
  const posts = ref<BoardPost[]>([])
  const keyword = ref('')
  const selectedCategory = ref<PostCategory>('all')
  const isLoading = ref(false)
  const errorMessage = ref('')

  const fetchPosts = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      posts.value = await getMockPosts()
    } catch (error) {
      errorMessage.value = '게시글을 불러오지 못했습니다.'
      posts.value = []
    } finally {
      isLoading.value = false
    }
  }

  const searchPosts = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      posts.value = await searchMockPosts(keyword.value, selectedCategory.value)
    } catch (error) {
      errorMessage.value = '검색 결과를 불러오지 못했습니다.'
      posts.value = []
    } finally {
      isLoading.value = false
    }
  }

  const setKeyword = (value: string) => {
    keyword.value = value
  }

  const changeCategory = async (category: PostCategory) => {
    selectedCategory.value = category

    if (keyword.value.trim()) {
      await searchPosts()
    } else {
      await fetchPosts()
    }
  }

  const resetFilters = async () => {
    keyword.value = ''
    selectedCategory.value = 'all'
    await fetchPosts()
  }

  return {
    posts,
    keyword,
    selectedCategory,
    isLoading,
    errorMessage,
    fetchPosts,
    searchPosts,
    setKeyword,
    changeCategory,
    resetFilters,
  }
})
