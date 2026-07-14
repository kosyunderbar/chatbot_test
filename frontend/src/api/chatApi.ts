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

export const sendMockChatMessage = async (content: string): Promise<ChatResponse> => {
  await wait(500)

  const normalized = content.trim().toLowerCase()
  let reply = '서울 관광 관련 질문을 더 구체적으로 입력해 주세요. 예를 들어 야경, 실내 장소, 가족 여행, 홍대 방문 같은 키워드를 넣어보세요.'

  if (normalized.includes('야경')) {
    reply = '남산서울타워와 한강공원 쪽은 야경을 즐기기 좋은 곳으로 자주 추천됩니다. 시간대에 따라 분위기가 달라질 수 있어요.'
  } else if (normalized.includes('비') || normalized.includes('비 오는')) {
    reply = '비 오는 날에는 박물관, 미술관, 실내 전시 공간을 중심으로 계획하면 편안하게 둘러보기 좋아요. 실내 활동 위주로 구성해볼게요.'
  } else if (normalized.includes('홍대')) {
    reply = '홍대 근처는 거리 산책과 문화 공간을 함께 즐기기 좋은 곳으로 알려져 있습니다. 주변 분위기를 느끼면서 둘러보기 좋습니다.'
  } else if (normalized.includes('가족')) {
    reply = '가족과 함께라면 서울숲이나 어린이대공원 같은 자연 친화적인 공간이 비교적 편안하게 즐기기 좋습니다. 이동 편의와 쉬는 공간도 고려해볼 수 있어요.'
  }

  return {
    message: {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: reply,
      createdAt: new Date().toISOString(),
    },
  }
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
