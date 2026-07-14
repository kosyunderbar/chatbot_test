import {
  getInitialMockMessages as getInitialMockMessagesApi,
  getMockSuggestions as getMockSuggestionsApi,
  sendMockChatMessage as sendMockChatMessageApi,
} from '../api/chatApi'
import { useMockApi } from '../config/appConfig'
import type { ChatMessage, ChatResponse, ChatSuggestion, ChatRequest, ChatApiResponse } from '../types/chat'

const throwFastApiNotReady = (): never => {
  throw new Error('FastAPI 연동이 아직 준비되지 않았습니다.')
}

/**
 * Repository for Chat operations
 * Currently uses Mock API; will switch to FastAPI once backend is ready
 * API DTOs are imported for type safety and future backend integration
 *
 * When FastAPI is ready:
 * - sendMockChatMessage will use ChatRequest to send data to backend
 * - Backend will return ChatApiResponse which will be transformed to ChatResponse
 */

/**
 * Transform ChatApiResponse (API DTO) to ChatResponse (UI type)
 * Used when FastAPI integration is complete
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

/**
 * Transform ChatMessage[] and new message to ChatRequest (API DTO)
 * Used when FastAPI integration is complete
 */
export function transformChatMessagesToChatRequest(content: string, history?: ChatMessage[], region?: string): ChatRequest {
  return {
    message: content,
    region,
    history,
  }
}

export const getInitialMockMessages = async (): Promise<ChatMessage[]> => {
  if (!useMockApi) {
    throwFastApiNotReady()
  }

  return getInitialMockMessagesApi()
}

export const getMockSuggestions = async (): Promise<ChatSuggestion[]> => {
  if (!useMockApi) {
    throwFastApiNotReady()
  }

  return getMockSuggestionsApi()
}

export const sendMockChatMessage = async (content: string): Promise<ChatResponse> => {
  if (!useMockApi) {
    throwFastApiNotReady()
  }

  return sendMockChatMessageApi(content)
}
