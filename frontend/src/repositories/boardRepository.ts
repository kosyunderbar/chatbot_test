import {
  getMockPosts as getMockPostsApi,
  searchMockPosts as searchMockPostsApi,
  getMockPostById as getMockPostByIdApi,
  createMockPost as createMockPostApi,
  updateMockPost as updateMockPostApi,
  deleteMockPost as deleteMockPostApi,
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

const throwFastApiNotReady = (): never => {
  throw new Error('FastAPI 연동이 아직 준비되지 않았습니다.')
}

/**
 * Repository for Board/Post operations
 * Currently uses Mock API; will switch to FastAPI once backend is ready
 * API DTOs are imported for type safety and future backend integration
 */

/**
 * Transform PostApiItem (API DTO) to BoardPost (UI type)
 * Used when FastAPI integration is complete
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
 * Used when FastAPI integration is complete
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
 * Used when FastAPI integration is complete
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
 * Used when FastAPI integration is complete
 */
export function transformToPostDeleteRequest(password: string): PostDeleteRequest {
  return { password }
}

/**
 * Transform PostListApiResponse (API DTO) to BoardPost[] (UI type)
 * Used when FastAPI integration is complete
 */
export function transformPostListApiResponse(response: PostListApiResponse): BoardPost[] {
  return response.items.map(transformPostApiItemToBoardPost)
}

export const getMockPosts = async (): Promise<BoardPost[]> => {
  if (!useMockApi) {
    throwFastApiNotReady()
  }

  return getMockPostsApi()
}

export const searchMockPosts = async (keyword: string, category: PostCategory = 'all'): Promise<BoardPost[]> => {
  if (!useMockApi) {
    throwFastApiNotReady()
  }

  return searchMockPostsApi(keyword, category)
}

export const getMockPostById = async (id: number): Promise<BoardPost | null> => {
  if (!useMockApi) {
    throwFastApiNotReady()
  }

  return getMockPostByIdApi(id)
}

export const createMockPost = async (payload: PostFormData): Promise<BoardPost> => {
  if (!useMockApi) {
    throwFastApiNotReady()
  }

  return createMockPostApi(payload)
}

export const updateMockPost = async (id: number, payload: PostFormData): Promise<BoardPost> => {
  if (!useMockApi) {
    throwFastApiNotReady()
  }

  return updateMockPostApi(id, payload)
}

export const deleteMockPost = async (id: number, payload: { password: string }): Promise<void> => {
  if (!useMockApi) {
    throwFastApiNotReady()
  }

  return deleteMockPostApi(id, payload)
}
