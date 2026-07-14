import {
  getMockPosts as getMockPostsApi,
  searchMockPosts as searchMockPostsApi,
  getMockPostById as getMockPostByIdApi,
  createMockPost as createMockPostApi,
  updateMockPost as updateMockPostApi,
  deleteMockPost as deleteMockPostApi,
} from '../api/boardApi'
import { useMockApi } from '../config/appConfig'
import type { BoardPost, PostCategory, PostFormData } from '../types/board'

const throwFastApiNotReady = (): never => {
  throw new Error('FastAPI 연동이 아직 준비되지 않았습니다.')
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
