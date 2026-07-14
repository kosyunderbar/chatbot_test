/**
 * Backend API DTO types for Board/Post feature
 * These types match the FastAPI backend response format
 */

export type PostCategory = 'all' | 'free' | 'question' | 'recommendation'

/**
 * API response DTO for a single post from backend
 */
export interface PostApiItem {
  id: number
  title: string
  content: string
  region: string | null
  category: string | null
  created_at: string
  updated_at: string
}

/**
 * API response DTO for post list from backend
 */
export interface PostListApiResponse {
  items: PostApiItem[]
  total: number
  page: number
  size: number
}

/**
 * API request DTO for creating a post
 */
export interface PostCreateRequest {
  title: string
  content: string
  password: string
  region?: string
  category?: string
}

/**
 * API request DTO for updating a post
 */
export interface PostUpdateRequest {
  title: string
  content: string
  password: string
  region?: string
  category?: string
}

/**
 * API request DTO for deleting a post
 */
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
