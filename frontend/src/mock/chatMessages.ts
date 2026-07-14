import type { ChatMessage, ChatSuggestion } from '../types/chat'

export const initialMessages: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content: '안녕하세요. LocalHub AI 가이드입니다. 서울 관광, 문화, 쇼핑, 숙박 정보를 물어보세요.',
    createdAt: new Date().toISOString(),
  },
]

export const suggestions: ChatSuggestion[] = [
  { id: 'suggestion-1', text: '홍대 근처 맛집 알려줘' },
  { id: 'suggestion-2', text: '지금 하고 있는 축제 알려줘' },
  { id: 'suggestion-3', text: '경복궁 근처 맛집 추천해줘' },
  { id: 'suggestion-4', text: '성동구 데이트 코스 추천해줘' },
]
