/**
 * Common API response and request types
 * These types are shared across all backend API contracts
 */

export interface ApiError {
  detail: string
  status?: number
}

export interface ApiListResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
}

export interface ApiSuccessResponse<T> {
  data: T
}
