import {
  getInitialMockMessages as getInitialMockMessagesApi,
  getMockSuggestions as getMockSuggestionsApi,
  sendMockChatMessage as sendMockChatMessageApi,
} from '../api/chatApi'
import { useMockApi } from '../config/appConfig'
import type { ChatMessage, ChatResponse, ChatSuggestion } from '../types/chat'

const throwFastApiNotReady = (): never => {
  throw new Error('FastAPI 연동이 아직 준비되지 않았습니다.')
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
