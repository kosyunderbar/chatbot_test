export type PostCategory = 'all' | 'free' | 'question' | 'recommendation'

export interface PostApiItem {
  id: number
  title: string
  content: string
  region: string | null
  category: string | null
  created_at: string
  updated_at: string
}

export interface PostListApiResponse {
  items: PostApiItem[]
  total: number
  page: number
  size: number
}

export interface PostCreateRequest {
  title: string
  content: string
  password: string
  region?: string
  category?: string
}

export interface PostUpdateRequest {
  title: string
  content: string
  password: string
  region?: string
  category?: string
}

export interface PostDeleteRequest {
  password: string
}

export interface PostFormData {
  title: string
  content: string
  password: string
  region: string
  category: string
}

export interface PostDeletePayload {
  password: string
}

export interface BoardPost {
  id: number
  title: string
  content: string
  region: string
  category: string
  createdAt: string
  updatedAt: string
  author?: string
  viewCount?: number
  commentCount?: number
}
