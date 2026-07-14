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
  location_type: 'tour' | 'none'
  tour_content_id: string | null
  tour_title: string | null
  tour_address: string | null
  view_count?: number
  like_count?: number
  is_liked?: boolean
  tags?: TagApiItem[]
  images?: PostImageApiItem[]
  created_at: string
  updated_at: string
}

export interface TagApiItem {
  id: number
  name: string
}

export interface PostImageApiItem {
  id: number
  url: string
  original_name: string
  mime_type: string
  size: number
  sort_order: number
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
  location_type: 'tour' | 'none'
  tour_content_id?: string
  tags?: string[]
  image_ids?: number[]
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
  location_type: 'tour' | 'none'
  tour_content_id?: string
  tags?: string[]
  image_ids?: number[]
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
  locationType: '' | 'tour' | 'none'
  tourContentId: string
  tourTitle: string
  tourAddress: string
  tags: string[]
  existingImages: PostImageApiItem[]
  newImages: File[]
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
  locationType: 'tour' | 'none'
  tourContentId: string | null
  tourTitle: string | null
  tourAddress: string | null
  createdAt: string
  updatedAt: string
  author?: string
  viewCount?: number
  commentCount?: number
  likeCount?: number
  isLiked?: boolean
  tags?: string[]
  images?: PostImageApiItem[]
}
