import axios from 'axios'

const VISITOR_ID_KEY = 'localhub-visitor-id'

const getVisitorId = () => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY)
  if (!visitorId) {
    visitorId = crypto.randomUUID()
    localStorage.setItem(VISITOR_ID_KEY, visitorId)
  }
  return visitorId
}

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

httpClient.interceptors.request.use((config) => {
  config.headers.set('X-Visitor-Id', getVisitorId())
  return config
})

export default httpClient
