import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { createBoardPost, getBoardPostById, getBoardPosts, removeBoardPost, searchBoardPosts, toggleBoardPostLike, updateBoardPost } from '../repositories/boardRepository'
import type { BoardPost, PostCategory, PostFormData } from '../types/board'

/**
 * Map HTTP error codes to user-friendly error messages
 */
function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const message = error.response?.data?.detail

    if (status === 403) {
      return '비밀번호가 일치하지 않습니다.'
    }
    if (status === 404) {
      return '게시글을 찾을 수 없습니다.'
    }
    if (status === 422) {
      return '입력 내용을 확인해 주세요.'
    }
    if (message && typeof message === 'string') {
      return message
    }
    if (error.message === 'Network Error' || !error.response) {
      return '서버에 연결할 수 없습니다.'
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return '요청 처리 중 오류가 발생했습니다.'
}

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
      posts.value = await getBoardPosts()
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
      posts.value = []
    } finally {
      isLoading.value = false
    }
  }

  const searchPosts = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const trimmedKeyword = keyword.value.trim()
      posts.value = await searchBoardPosts(trimmedKeyword, selectedCategory.value)
    } catch (error) {
      errorMessage.value = '게시글을 검색하는 중 오류가 발생했습니다.'
      posts.value = []
    } finally {
      isLoading.value = false
    }
  }

  const fetchPostById = async (id: number) => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      selectedPost.value = await getBoardPostById(id)
      if (!selectedPost.value) {
        errorMessage.value = '게시글을 찾을 수 없습니다.'
      }
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
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
      const created = await createBoardPost(payload)
      return created
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  const updatePost = async (id: number, payload: PostFormData) => {
    isSubmitting.value = true
    errorMessage.value = ''

    try {
      const updated = await updateBoardPost(id, payload)
      selectedPost.value = updated
      return updated
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  const deletePost = async (id: number, password: string) => {
    isSubmitting.value = true
    errorMessage.value = ''

    try {
      await removeBoardPost(id, password)
      selectedPost.value = null
      return true
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const clearSelectedPost = () => {
    selectedPost.value = null
    errorMessage.value = ''
  }

  const toggleLike = async (post: BoardPost) => {
    const result = await toggleBoardPostLike(post.id, post.isLiked ?? false)
    const applyLike = (item: BoardPost) => {
      if (item.id === post.id) {
        item.isLiked = result.liked
        item.likeCount = result.like_count
      }
    }
    if (selectedPost.value) applyLike(selectedPost.value)
    posts.value.forEach(applyLike)
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
    toggleLike,
    setKeyword,
    changeCategory,
    resetFilters,
  }
})
