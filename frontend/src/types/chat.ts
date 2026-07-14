/**
 * Chat feature types
 * Separates backend API DTOs from frontend UI types
 */

export type ChatRole = 'user' | 'assistant'

/**
 * Frontend UI type for displaying chat messages
 * Used in store and components for message management
 */
export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
}

/**
 * Frontend UI type for chat suggestions
 */
export interface ChatSuggestion {
  id: string
  text: string
}

/**
 * Frontend response type for chat operations
 */
export interface ChatResponse {
  message: ChatMessage
}

/**
 * Backend API request DTO for sending chat message
 */
export interface ChatRequest {
  message: string
  region?: string
  history?: ChatMessage[]
}

/**
 * Backend API response DTO for chat message processing
 */
export interface ChatApiResponse {
  answer: string
  references?: unknown[]
  relatedPosts?: unknown[]
  relatedLocations?: unknown[]
}
