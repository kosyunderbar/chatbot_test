import { isAxiosError } from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getInitialMessages, getSuggestions, sendMessage as sendChatRepositoryMessage } from '../repositories/chatRepository'
import type { ChatMessage, ChatSuggestion, ChatHistoryItem } from '../types/chat'

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])
  const suggestions = ref<ChatSuggestion[]>([])
  const inputMessage = ref('')
  const isLoading = ref(false)
  const errorMessage = ref('')
  const hasInitialized = ref(false)

  const initializeChat = async () => {
    if (hasInitialized.value) {
      return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
      const [initialMessages, initialSuggestions] = await Promise.all([
        getInitialMessages(),
        getSuggestions(),
      ])

      messages.value = initialMessages
      suggestions.value = initialSuggestions
      hasInitialized.value = true
    } catch {
      errorMessage.value = '챗봇을 불러오지 못했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  const setInputMessage = (value: string) => {
    inputMessage.value = value
  }

  const sendMessage = async () => {
    const trimmedMessage = inputMessage.value.trim()

    if (!trimmedMessage) {
      return
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedMessage,
      createdAt: new Date().toISOString(),
    }

    messages.value = [...messages.value, userMessage]
    inputMessage.value = ''
    isLoading.value = true
    errorMessage.value = ''

    const history: ChatHistoryItem[] = messages.value
      .filter((message) => message.id !== userMessage.id)
      .map(({ role, content }) => ({ role, content }))

    try {
      const response = await sendChatRepositoryMessage({
        message: trimmedMessage,
        history,
      })
      messages.value = [...messages.value, response.message]
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const status = error.response?.status

        if (status === 422) {
          errorMessage.value = '질문 내용을 확인해 주세요.'
        } else if (status === 404 || status === 0 || error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          errorMessage.value = '챗봇 서버에 연결할 수 없습니다.'
        } else {
          errorMessage.value = '답변을 불러오는 중 오류가 발생했습니다.'
        }
      } else {
        errorMessage.value = '답변을 불러오는 중 오류가 발생했습니다.'
      }
    } finally {
      isLoading.value = false
    }
  }

  const selectSuggestion = (text: string) => {
    inputMessage.value = text
  }

  const resetChat = async () => {
    hasInitialized.value = false
    messages.value = []
    suggestions.value = []
    inputMessage.value = ''
    errorMessage.value = ''
    await initializeChat()
  }

  return {
    messages,
    suggestions,
    inputMessage,
    isLoading,
    errorMessage,
    initializeChat,
    setInputMessage,
    sendMessage,
    selectSuggestion,
    resetChat,
  }
})
