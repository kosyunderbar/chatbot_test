const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL
const rawUseMockApi = import.meta.env.VITE_USE_MOCK_API

export const apiBaseUrl = rawApiBaseUrl || 'http://127.0.0.1:8000'
export const useMockApi = rawUseMockApi === 'true'
