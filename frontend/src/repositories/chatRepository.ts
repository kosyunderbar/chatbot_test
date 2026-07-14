import {
  getInitialMockMessages as getInitialMockMessagesApi,
  getMockSuggestions as getMockSuggestionsApi,
  sendChatMessage as sendChatMessageApi,
  sendMockChatMessage as sendMockChatMessageApi,
} from '../api/chatApi'
import { useMockApi } from '../config/appConfig'
import type { ChatApiResponse, ChatMessage, ChatRequest, ChatResponse, ChatSuggestion } from '../types/chat'

/**
 * Repository for Chat operations.
 * The store only depends on this layer, so switching between mock and real API
 * can be handled here without changing the rest of the frontend.
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
  if (useMockApi) {
    return sendMockChatMessageApi(payload.message)
  }

  return sendChatMessageApi(payload)
}

export const getInitialMockMessages = async (): Promise<ChatMessage[]> => {
  return getInitialMessages()
}

export const getMockSuggestions = async (): Promise<ChatSuggestion[]> => {
  return getSuggestions()
}

export const sendMockChatMessage = async (content: string): Promise<ChatResponse> => {
  return sendMockChatMessageApi(content)
}
