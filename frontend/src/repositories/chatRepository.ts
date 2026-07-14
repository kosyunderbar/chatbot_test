import {
  getInitialMockMessages as getInitialMockMessagesApi,
  getMockSuggestions as getMockSuggestionsApi,
  sendChatMessage as sendChatMessageApi,
} from '../api/chatApi'
import type { ChatApiResponse, ChatMessage, ChatRequest, ChatResponse, ChatSuggestion } from '../types/chat'

/**
 * Repository for Chat operations.
 * Initial UI messages stay local, while chat responses come from the backend.
 */
export function transformChatApiResponseToChatResponse(apiResponse: ChatApiResponse, messageId: string): ChatResponse {
  return {
    message: {
      id: messageId,
      role: 'assistant',
      content: apiResponse.answer,
      createdAt: new Date().toISOString(),
    },
  }
}

export function transformChatMessagesToChatRequest(content: string, history?: ChatMessage[], region?: string): ChatRequest {
  return {
    message: content,
    region,
    history: history?.map(({ role, content: historyContent }) => ({ role, content: historyContent })),
  }
}

export const getInitialMessages = async (): Promise<ChatMessage[]> => {
  return getInitialMockMessagesApi()
}

export const getSuggestions = async (): Promise<ChatSuggestion[]> => {
  return getMockSuggestionsApi()
}

export const sendMessage = async (payload: ChatRequest): Promise<ChatResponse> => {
  return sendChatMessageApi(payload)
}
