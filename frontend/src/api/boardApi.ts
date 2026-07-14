import httpClient from './httpClient'
import type {
  BoardPost,
  PostApiItem,
  PostCategory,
  PostCreateRequest,
  PostUpdateRequest,
  PostDeleteRequest,
  PostListApiResponse,
} from '../types/board'

const postMetadata: Record<number, { author: string; viewCount: number; commentCount: number }> = {
  1: { author: '민지', viewCount: 128, commentCount: 5 },
  2: { author: '도윤', viewCount: 102, commentCount: 3 },
  3: { author: '서연', viewCount: 86, commentCount: 2 },
  4: { author: '준호', viewCount: 145, commentCount: 6 },
  5: { author: '하린', viewCount: 71, commentCount: 4 },
  6: { author: '유진', viewCount: 94, commentCount: 3 },
  7: { author: '태현', viewCount: 112, commentCount: 5 },
  8: { author: '소희', viewCount: 63, commentCount: 2 },
  9: { author: '예린', viewCount: 88, commentCount: 4 },
  10: { author: '지훈', viewCount: 77, commentCount: 2 },
  11: { author: '은우', viewCount: 132, commentCount: 7 },
  12: { author: '나연', viewCount: 59, commentCount: 1 },
}

const DEFAULT_PAGE_SIZE = 100

export const mapPostApiItemToBoardPost = (item: PostApiItem): BoardPost => {
  return {
    id: item.id,
    title: item.title,
    content: item.content,
    region: item.region ?? '',
    category: item.category ?? '',
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    ...postMetadata[item.id],
  }
}

const sortByNewest = (items: BoardPost[]): BoardPost[] => {
  return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

const normalizePostList = (items: PostApiItem[]): BoardPost[] => {
  return sortByNewest(items.map(mapPostApiItemToBoardPost))
}

export const getMockPosts = async (): Promise<BoardPost[]> => {
  const response = await httpClient.get<{ items: PostApiItem[] }>('/api/posts', {
    params: {
      page: 1,
      size: DEFAULT_PAGE_SIZE,
    },
  })

  return normalizePostList(response.data.items)
}

export const searchMockPosts = async (keyword: string, category: PostCategory = 'all'): Promise<BoardPost[]> => {
  const response = await httpClient.get<{ items: PostApiItem[] }>('/api/posts', {
    params: {
      page: 1,
      size: DEFAULT_PAGE_SIZE,
      keyword: keyword.trim() || undefined,
      category: category === 'all' ? undefined : category,
    },
  })

  return normalizePostList(response.data.items)
}

export const getMockPostById = async (id: number): Promise<BoardPost | null> => {
  const response = await httpClient.get<PostApiItem>(`/api/posts/${id}`)
  return mapPostApiItemToBoardPost(response.data)
}

export const createMockPost = async (payload: PostCreateRequest): Promise<BoardPost> => {
  const response = await httpClient.post<PostApiItem>('/api/posts', payload)
  return mapPostApiItemToBoardPost(response.data)
}

export const updateMockPost = async (id: number, payload: PostUpdateRequest): Promise<BoardPost> => {
  const response = await httpClient.put<PostApiItem>(`/api/posts/${id}`, payload)
  return mapPostApiItemToBoardPost(response.data)
}

export const deleteMockPost = async (id: number, payload: PostDeleteRequest): Promise<void> => {
  await httpClient.delete(`/api/posts/${id}`, {
    data: payload,
  })
}

export const getPosts = async (params?: {
  page?: number
  size?: number
  region?: string
  category?: string
  keyword?: string
}): Promise<BoardPost[]> => {
  const response = await httpClient.get<PostListApiResponse>('/api/posts', {
    params: {
      page: params?.page ?? 1,
      size: params?.size ?? DEFAULT_PAGE_SIZE,
      region: params?.region,
      category: params?.category,
      keyword: params?.keyword?.trim(),
    },
  })

  return normalizePostList(response.data.items)
}

export const searchPosts = async (keyword: string, category: PostCategory = 'all'): Promise<BoardPost[]> => {
  return getPosts({
    keyword: keyword.trim() || undefined,
    category: category === 'all' ? undefined : category,
  })
}

export const getPostById = async (id: number): Promise<BoardPost | null> => {
  const response = await httpClient.get<PostApiItem>(`/api/posts/${id}`)
  return mapPostApiItemToBoardPost(response.data)
}

export const createPost = async (payload: PostCreateRequest): Promise<BoardPost> => {
  const response = await httpClient.post<PostApiItem>('/api/posts', payload)
  return mapPostApiItemToBoardPost(response.data)
}

export const updatePost = async (id: number, payload: PostUpdateRequest): Promise<BoardPost> => {
  const response = await httpClient.put<PostApiItem>(`/api/posts/${id}`, payload)
  return mapPostApiItemToBoardPost(response.data)
}

export const deletePost = async (id: number, payload: PostDeleteRequest): Promise<void> => {
  await httpClient.delete(`/api/posts/${id}`, {
    data: payload,
  })
}
