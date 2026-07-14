import httpClient from './httpClient'
import type {
  BoardPost,
  PostApiItem,
  PostCategory,
  PostCreateRequest,
  PostDeleteRequest,
  PostImageApiItem,
  PostListApiResponse,
  PostUpdateRequest,
  TagApiItem,
} from '../types/board'

const resolveImageUrl = (url: string) => {
  if (/^https?:\/\//.test(url)) return url
  return new URL(url, httpClient.defaults.baseURL || window.location.origin).toString()
}

export const mapPostApiItemToBoardPost = (item: PostApiItem): BoardPost => ({
  id: item.id,
  title: item.title,
  content: item.content,
  region: item.region ?? '',
  category: item.category ?? '',
  createdAt: item.created_at,
  updatedAt: item.updated_at,
  viewCount: item.view_count,
  likeCount: item.like_count,
  isLiked: item.is_liked,
  tags: item.tags?.map((tag) => tag.name),
  images: item.images?.map((image) => ({ ...image, url: resolveImageUrl(image.url) })),
})

export const getPosts = async (params?: {
  page?: number
  size?: number
  region?: string
  category?: string
  keyword?: string
  searchIn?: string
  sort?: 'latest' | 'views' | 'likes'
}): Promise<BoardPost[]> => {
  const response = await httpClient.get<PostListApiResponse>('/api/posts', {
    params: {
      page: params?.page ?? 1,
      size: params?.size ?? 100,
      region: params?.region,
      category: params?.category,
      keyword: params?.keyword?.trim() || undefined,
      search_in: params?.searchIn,
      sort: params?.sort,
    },
  })
  return response.data.items.map(mapPostApiItemToBoardPost)
}

export const searchPosts = (keyword: string, category: PostCategory = 'all') =>
  getPosts({ keyword, category: category === 'all' ? undefined : category })

export const getPostById = async (id: number): Promise<BoardPost> => {
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

export const deletePost = (id: number, payload: PostDeleteRequest) => httpClient.delete(`/api/posts/${id}`, { data: payload })

export const togglePostLike = async (id: number, liked: boolean) => {
  const response = liked
    ? await httpClient.delete<{ liked: boolean; like_count: number }>(`/api/posts/${id}/likes`)
    : await httpClient.post<{ liked: boolean; like_count: number }>(`/api/posts/${id}/likes`)
  return response.data
}

export const getTags = async (keyword: string): Promise<TagApiItem[]> => {
  const response = await httpClient.get<TagApiItem[]>('/api/tags', { params: { keyword } })
  return response.data
}

export const uploadPostImage = async (file: File): Promise<PostImageApiItem> => {
  const formData = new FormData()
  formData.append('image', file)
  const response = await httpClient.post<PostImageApiItem>('/api/uploads/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return { ...response.data, url: resolveImageUrl(response.data.url) }
}

export const deleteUploadedImage = (imageId: number) => httpClient.delete(`/api/uploads/images/${imageId}`)
