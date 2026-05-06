import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

function toCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

function toSnake(s: string): string {
  return s.replace(/([A-Z])/g, (c) => `_${c.toLowerCase()}`)
}

function transformKeys(data: unknown, fn: (key: string) => string): unknown {
  if (Array.isArray(data)) return data.map((item) => transformKeys(item, fn))
  if (
    data !== null &&
    typeof data === 'object' &&
    !(data instanceof FormData) &&
    !(data instanceof File) &&
    !(data instanceof Blob)
  ) {
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([k, v]) => [fn(k), transformKeys(v, fn)])
    )
  }
  return data
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data && !(config.data instanceof FormData)) {
    config.data = transformKeys(config.data, toSnake)
  }
  if (config.params) {
    config.params = transformKeys(config.params, toSnake)
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = transformKeys(response.data, toCamel)
    }
    return response
  },
  (error) => {
    // Transform error response body so field names match camelCase form fields
    if (error.response?.data) {
      error.response.data = transformKeys(error.response.data, toCamel)
    }

    const msg: string | undefined = error.response?.data?.message
    const isAuthEndpoint = error.config?.url?.includes('/auth/')

    // Show suspension overlay for any non-login request that returns the suspended message
    if (msg?.toLowerCase().includes('suspended') && !isAuthEndpoint) {
      useAuthStore.getState().setSuspensionMessage(msg)
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !isAuthEndpoint) {
      if (msg && msg !== 'Unauthenticated.') {
        sessionStorage.setItem('auth_redirect_message', msg)
      }
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
