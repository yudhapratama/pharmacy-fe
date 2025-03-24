import axios from 'axios'
import type { User, LoginResponse } from '~/services/auth.service'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const API_URL = config.public.apiUrl

  const getStorageItem = (key: string): string | null => {
    if (process.server) return null
    return localStorage.getItem(key)
  }

  const setStorageItem = (key: string, value: string): void => {
    if (process.server) return
    localStorage.setItem(key, value)
  }

  const removeStorageItem = (key: string): void => {
    if (process.server) return
    localStorage.removeItem(key)
  }

  return {
    async login(email: string, password: string): Promise<LoginResponse> {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      })
      setStorageItem('token', response.data.token)
      setStorageItem('refreshToken', response.data.refreshToken)
      return response.data
    },

    async getCurrentUser(): Promise<User> {
      const response = await axios.get(`${API_URL}/auth/me`)
      return response.data
    },

    async logout(): Promise<void> {
      const refreshToken = getStorageItem('refreshToken')
      try {
        await axios.post(`${API_URL}/auth/logout`, { refreshToken })
      } finally {
        removeStorageItem('token')
        removeStorageItem('refreshToken')
      }
    },

    isAuthenticated(): boolean {
      return !!getStorageItem('token')
    },

    getToken(): string | null {
      return getStorageItem('token')
    }
  }
}