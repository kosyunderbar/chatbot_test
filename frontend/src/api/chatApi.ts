import httpClient from './httpClient'
import { initialMessages, suggestions } from '../mock/chatMessages'
import type { ChatApiResponse, ChatMessage, ChatRequest, ChatResponse, ChatSuggestion } from '../types/chat'

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

const createAssistantMessageId = (): string => {
  const globalCrypto = globalThis.crypto

  if (globalCrypto && typeof globalCrypto.randomUUID === 'function') {
    return globalCrypto.randomUUID()
  }

  return `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export const getInitialMockMessages = async (): Promise<ChatMessage[]> => {
  await wait(50)
  return initialMessages.map((message) => ({ ...message }))
}

export const getMockSuggestions = async (): Promise<ChatSuggestion[]> => {
  await wait(50)
  return suggestions.map((item) => ({ ...item }))
}

export const sendChatMessage = async (payload: ChatRequest): Promise<ChatResponse> => {
  const response = await httpClient.post<ChatApiResponse>('/api/chat', payload)

  return {
    message: {
      id: createAssistantMessageId(),
      role: 'assistant',
      content: response.data.answer,
      createdAt: new Date().toISOString(),
    },
  }
}
