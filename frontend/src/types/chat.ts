/**
 * Chat feature types.
 * API DTOs represent backend payloads, while UI types match the screen layer.
 */

export type ChatRole = 'user' | 'assistant'

/**
 * Frontend UI type for displaying chat messages.
 */
export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
}

/**
 * Frontend UI type for chat suggestions.
 */
export interface ChatSuggestion {
  id: string
  text: string
}

/**
 * Frontend response type for chat operations.
 */
export interface ChatResponse {
  message: ChatMessage
}

/**
 * Backend API request DTO for sending a chat message.
 */
export interface ChatHistoryItem {
  role: ChatRole
  content: string
}

export interface ChatRequest {
  message: string
  region?: string
  history?: ChatHistoryItem[]
}

/**
 * Backend API reference object.
 */
export interface ChatReference {
  type: string
  id?: string | number
  title?: string
}

/**
 * Backend API response DTO for related posts.
 */
export interface ChatRelatedPost {
  id: number
  title: string
}

/**
 * Backend API response DTO for related locations.
 */
export interface ChatRelatedLocation {
  id: string
  title: string
  category?: string
  address?: string
}

/**
 * Backend API response DTO for chat message processing.
 */
export interface ChatApiResponse {
  answer: string
  references?: ChatReference[]
  related_posts?: ChatRelatedPost[]
  related_locations?: ChatRelatedLocation[]
}
