import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getInitialMockMessages, getMockSuggestions, sendMockChatMessage } from '../api/chatApi'
import type { ChatMessage, ChatSuggestion } from '../types/chat'

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
        getInitialMockMessages(),
        getMockSuggestions(),
      ])

      messages.value = initialMessages
      suggestions.value = initialSuggestions
      hasInitialized.value = true
    } catch (error) {
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

    try {
      const response = await sendMockChatMessage(trimmedMessage)
      messages.value = [...messages.value, response.message]
    } catch (error) {
      errorMessage.value = '답변을 생성하지 못했습니다.'
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
