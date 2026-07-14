const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL

export const apiBaseUrl = rawApiBaseUrl || 'http://127.0.0.1:8000'
