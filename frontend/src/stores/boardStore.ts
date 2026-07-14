import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getMockPosts,
  searchMockPosts,
  getMockPostById,
  createMockPost,
  updateMockPost,
  deleteMockPost,
} from '../repositories/boardRepository'
import type { BoardPost, PostCategory, PostFormData } from '../types/board'

export const useBoardStore = defineStore('board', () => {
  const posts = ref<BoardPost[]>([])
  const selectedPost = ref<BoardPost | null>(null)
  const keyword = ref('')
  const selectedCategory = ref<PostCategory>('all')
  const isLoading = ref(false)
  const isSubmitting = ref(false)
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

  const fetchPostById = async (id: number) => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      selectedPost.value = await getMockPostById(id)
      if (!selectedPost.value) {
        errorMessage.value = '게시글을 찾을 수 없습니다.'
      }
    } catch (error) {
      errorMessage.value = '게시글을 불러오지 못했습니다.'
      selectedPost.value = null
    } finally {
      isLoading.value = false
    }

    return selectedPost.value
  }

  const createPost = async (payload: PostFormData) => {
    isSubmitting.value = true
    errorMessage.value = ''

    try {
      const created = await createMockPost(payload)
      return created
    } catch (error) {
      errorMessage.value = '게시글을 생성하지 못했습니다.'
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  const updatePost = async (id: number, payload: PostFormData) => {
    isSubmitting.value = true
    errorMessage.value = ''

    try {
      const updated = await updateMockPost(id, payload)
      selectedPost.value = updated
      return updated
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = error.message
      } else {
        errorMessage.value = '게시글을 수정하지 못했습니다.'
      }
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  const deletePost = async (id: number, password: string) => {
    isSubmitting.value = true
    errorMessage.value = ''

    try {
      await deleteMockPost(id, { password })
      selectedPost.value = null
      return true
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = error.message
      } else {
        errorMessage.value = '게시글을 삭제하지 못했습니다.'
      }
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const clearSelectedPost = () => {
    selectedPost.value = null
    errorMessage.value = ''
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
    selectedPost,
    keyword,
    selectedCategory,
    isLoading,
    isSubmitting,
    errorMessage,
    fetchPosts,
    searchPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
    clearSelectedPost,
    setKeyword,
    changeCategory,
    resetFilters,
  }
})
