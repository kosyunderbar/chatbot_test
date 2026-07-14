import {
  getMockPosts as getMockPostsApi,
  searchMockPosts as searchMockPostsApi,
  getMockPostById as getMockPostByIdApi,
  createMockPost as createMockPostApi,
  updateMockPost as updateMockPostApi,
  deleteMockPost as deleteMockPostApi,
  getPosts,
  searchPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../api/boardApi'
import { useMockApi } from '../config/appConfig'
import type {
  BoardPost,
  PostCategory,
  PostFormData,
  PostApiItem,
  PostCreateRequest,
  PostUpdateRequest,
  PostDeleteRequest,
  PostListApiResponse,
} from '../types/board'

/**
 * Repository for Board/Post operations
 * Conditionally uses Mock API or real FastAPI based on VITE_USE_MOCK_API config
 * Store layer remains unchanged, transparent to actual API source
 */

/**
 * Transform PostApiItem (API DTO) to BoardPost (UI type)
 */
export function transformPostApiItemToBoardPost(item: PostApiItem): BoardPost {
  return {
    id: item.id,
    title: item.title,
    content: item.content,
    region: item.region || '전국',
    category: item.category || 'free',
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }
}

/**
 * Transform PostFormData (UI form) to PostCreateRequest (API DTO)
 */
export function transformFormDataToPostCreateRequest(data: PostFormData): PostCreateRequest {
  return {
    title: data.title,
    content: data.content,
    password: data.password,
    region: data.region || undefined,
    category: data.category || undefined,
  }
}

/**
 * Transform PostFormData (UI form) to PostUpdateRequest (API DTO)
 */
export function transformFormDataToPostUpdateRequest(data: PostFormData): PostUpdateRequest {
  return {
    title: data.title,
    content: data.content,
    password: data.password,
    region: data.region || undefined,
    category: data.category || undefined,
  }
}

/**
 * Transform PostDeleteRequest payload
 */
export function transformToPostDeleteRequest(password: string): PostDeleteRequest {
  return { password }
}

/**
 * Transform PostListApiResponse (API DTO) to BoardPost[] (UI type)
 */
export function transformPostListApiResponse(response: PostListApiResponse): BoardPost[] {
  return response.items.map(transformPostApiItemToBoardPost)
}

export const getMockPosts = async (): Promise<BoardPost[]> => {
  if (useMockApi) {
    return getMockPostsApi()
  }
  return getPosts()
}

export const searchMockPosts = async (keyword: string, category: PostCategory = 'all'): Promise<BoardPost[]> => {
  if (useMockApi) {
    return searchMockPostsApi(keyword, category)
  }
  return searchPosts(keyword, category)
}

export const getMockPostById = async (id: number): Promise<BoardPost | null> => {
  if (useMockApi) {
    return getMockPostByIdApi(id)
  }
  return getPostById(id)
}

export const createMockPost = async (payload: PostFormData): Promise<BoardPost> => {
  const createPayload: PostCreateRequest = {
    title: payload.title,
    content: payload.content,
    password: payload.password,
    region: payload.region || undefined,
    category: payload.category || undefined,
  }

  if (useMockApi) {
    return createMockPostApi(createPayload)
  }
  return createPost(createPayload)
}

export const updateMockPost = async (id: number, payload: PostFormData): Promise<BoardPost> => {
  const updatePayload: PostUpdateRequest = {
    title: payload.title,
    content: payload.content,
    password: payload.password,
    region: payload.region || undefined,
    category: payload.category || undefined,
  }

  if (useMockApi) {
    return updateMockPostApi(id, updatePayload)
  }
  return updatePost(id, updatePayload)
}

export const deleteMockPost = async (id: number, payload: { password: string }): Promise<void> => {
  const deletePayload: PostDeleteRequest = {
    password: payload.password,
  }

  if (useMockApi) {
    return deleteMockPostApi(id, deletePayload)
  }
  return deletePost(id, deletePayload)
}
