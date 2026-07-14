export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
}

export interface ChatSuggestion {
  id: string
  text: string
}

export interface ChatResponse {
  message: ChatMessage
}
