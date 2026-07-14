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
  { id: 'suggestion-1', text: '서울 야경 명소 추천해줘' },
  { id: 'suggestion-2', text: '비 오는 날 갈 만한 곳은?' },
  { id: 'suggestion-3', text: '홍대 근처 볼거리를 알려줘' },
  { id: 'suggestion-4', text: '가족과 가기 좋은 관광지는?' },
]
